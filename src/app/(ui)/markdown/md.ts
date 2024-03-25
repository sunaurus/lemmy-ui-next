/**
 * Initially copied from github.com/LemmyNet/lemmy-ui with small modifications
 */

import MarkdownIt from "markdown-it";

import markdown_it_container from "markdown-it-container";
// @ts-ignore
import markdown_it_bidi from "markdown-it-bidi";
import markdown_it_footnote from "markdown-it-footnote";
// @ts-ignore
import markdown_it_ruby from "markdown-it-ruby";
// @ts-ignore
import markdown_it_sub from "markdown-it-sub";
// @ts-ignore
import markdown_it_sup from "markdown-it-sup";
import markdown_it_highlightjs from "markdown-it-highlightjs";
import Renderer from "markdown-it/lib/renderer";
import Token from "markdown-it/lib/token";

const instanceLinkRegex =
  /(\/[cmu]\/|!)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const relTags = "noopener nofollow";

export let md = new MarkdownIt({ linkify: true });

export let mdNoImages: MarkdownIt = new MarkdownIt();

// Zero disables all rules.
// Only explicitly allow a limited set of rules safe for use in post titles.
export const mdLimited: MarkdownIt = new MarkdownIt("zero").enable([
  "emphasis",
  "backticks",
  "strikethrough",
]);

export function mdToHtmlInline(text: string) {
  return { __html: mdLimited.renderInline(text) };
}

const spoilerConfig = {
  validate: (params: string) => {
    return params.trim().match(/^spoiler\s+(.*)$/);
  },

  render: (tokens: any, idx: any) => {
    const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
    if (tokens[idx].nesting === 1) {
      // opening tag
      const summary = mdToHtmlInline(md.utils.escapeHtml(m[1])).__html;
      return `<details><summary> ${summary} </summary>\n`;
    } else {
      // closing tag
      return "</details>\n";
    }
  },
};

const localInstanceLinkParser = (md: MarkdownIt) => {
  md.core.ruler.push("replace-text", (state) => {
    for (let i = 0; i < state.tokens.length; i++) {
      if (state.tokens[i].type !== "inline") {
        continue;
      }
      const inlineTokens: Token[] = state.tokens[i].children || [];
      for (let j = inlineTokens.length - 1; j >= 0; j--) {
        if (
          inlineTokens[j].type === "text" &&
          new RegExp(instanceLinkRegex).test(inlineTokens[j].content)
        ) {
          const text = inlineTokens[j].content;
          const matches = Array.from(text.matchAll(instanceLinkRegex));

          let lastIndex = 0;
          const newTokens: Token[] = [];

          let linkClass = "community-link";

          for (const match of matches) {
            // If there is plain text before the match, add it as a separate token
            if (match.index !== undefined && match.index > lastIndex) {
              const textToken = new state.Token("text", "", 0);
              textToken.content = text.slice(lastIndex, match.index);
              newTokens.push(textToken);
            }

            let href: string;
            if (match[0].startsWith("!")) {
              href = "/c/" + match[0].substring(1);
            } else if (match[0].startsWith("/m/")) {
              href = "/c/" + match[0].substring(3);
            } else {
              href = match[0];
              if (match[0].startsWith("/u/")) {
                linkClass = "user-link";
              }
            }

            const linkOpenToken = new state.Token("link_open", "a", 1);
            linkOpenToken.attrs = [
              ["href", href],
              ["class", linkClass],
            ];
            const textToken = new state.Token("text", "", 0);
            textToken.content = match[0];
            const linkCloseToken = new state.Token("link_close", "a", -1);

            newTokens.push(linkOpenToken, textToken, linkCloseToken);

            lastIndex =
              (match.index !== undefined ? match.index : 0) + match[0].length;
          }

          // If there is plain text after the last match, add it as a separate token
          if (lastIndex < text.length) {
            const textToken = new state.Token("text", "", 0);
            textToken.content = text.slice(lastIndex);
            newTokens.push(textToken);
          }

          inlineTokens.splice(j, 1, ...newTokens);
        }
      }
    }
  });
};

const markdownItConfig: MarkdownIt.Options = {
  html: false,
  linkify: true,
  typographer: true,
};

md = new MarkdownIt(markdownItConfig)
  .use(markdown_it_sub)
  .use(markdown_it_sup)
  .use(markdown_it_footnote)
  .use(markdown_it_container, "spoiler", spoilerConfig)
  .use(markdown_it_highlightjs, { inline: true })
  .use(markdown_it_ruby)
  .use(localInstanceLinkParser)
  .use(markdown_it_bidi);

mdNoImages = new MarkdownIt(markdownItConfig)
  .use(markdown_it_sub)
  .use(markdown_it_sup)
  .use(markdown_it_footnote)
  .use(markdown_it_container, "spoiler", spoilerConfig)
  .use(markdown_it_highlightjs, { inline: true })
  .use(localInstanceLinkParser)
  .use(markdown_it_bidi)
  .disable("image");
const defaultImageRenderer = md.renderer.rules.image;
md.renderer.rules.image = function (
  tokens: Token[],
  idx: number,
  options: MarkdownIt.Options,
  env: any,
  self: Renderer,
) {
  const item = tokens[idx] as any;
  let title = item.attrs.length >= 3 ? item.attrs[2][1] : "";
  const splitTitle = title.split(/ (.*)/, 2);
  const isEmoji = splitTitle[0] === "emoji";

  const imgElement =
    defaultImageRenderer?.(tokens, idx, options, env, self) ?? "";
  if (imgElement) {
    if (isEmoji) {
      return imgElement.replace("<img ", "<emoji ");
    }
    return imgElement;
  } else return "";
};
md.renderer.rules.table_open = function () {
  return '<table class="table">';
};
const defaultLinkRenderer =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };
md.renderer.rules.link_open = function (
  tokens: Token[],
  idx: number,
  options: MarkdownIt.Options,
  env: any,
  self: Renderer,
) {
  tokens[idx].attrPush(["rel", relTags]);
  return defaultLinkRenderer(tokens, idx, options, env, self);
};
