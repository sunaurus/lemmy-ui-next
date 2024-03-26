import MarkdownIt from "markdown-it";
import { Prose } from "@/app/(ui)/markdown/Prose";
import { MarkdownImageReplacement } from "@/app/(ui)/markdown/MarkdownImageReplacement";
import { InlineExpandedMedia } from "@/app/(ui)/InlineExpandableMedia";
import { MarkdownImage } from "@/app/(ui)/markdown/MarkdownWithFetchedContent";

export type MarkdownPropsWithReplacements = {
  html: string;
  replacements: MarkdownImage[];
  localSiteName: string;
};

type RawMarkdownProps = {
  content: string;
};
type Props = RawMarkdownProps | MarkdownPropsWithReplacements;
const md = new MarkdownIt({ linkify: true });

export const Markdown = (props: Props) => {
  const isRaw = isRawMarkdown(props);

  const renderedHtml = isRaw ? md.render(props.content ?? "") : props.html;

  const nonce = new Date().valueOf();

  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      {!isRaw &&
        props.replacements.map((replacement) => (
          <MarkdownImageReplacement
            key={replacement.selector + nonce}
            selector={replacement.selector}
          >
            <InlineExpandedMedia
              className={"max-w-[830px]"}
              embed={{ url: replacement.src, alt: replacement.alt }}
              isExpanded={true}
              localSiteDomain={props.localSiteName}
              remoteImageProps={replacement.remoteImageProps}
            />
          </MarkdownImageReplacement>
        ))}
    </Prose>
  );
};

const isRawMarkdown = (props: Props): props is RawMarkdownProps => {
  return (props as RawMarkdownProps).content !== undefined;
};
