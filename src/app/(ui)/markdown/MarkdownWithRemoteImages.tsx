import "server-only";
import MarkdownIt from "markdown-it";
import { InlineExpandedMedia } from "@/app/(ui)/InlineExpandableMedia";

import { Prose } from "@/app/(ui)/markdown/Prose";
import { apiClient } from "@/app/apiClient";
import {
  getRemoteImageProps,
  RemoteImageProps,
} from "@/app/(utils)/getRemoteImageProps";
import { MarkdownImageReplacement } from "@/app/(ui)/markdown/MarkdownImageReplacement";

type Props = {
  type: MarkdownType;
  id: number;
};

const md = new MarkdownIt({ linkify: true });

export const MarkdownWithRemoteImages = async (props: Props) => {
  const { site_view: siteView } = await apiClient.getSite();
  const { html, replacements } = await getMarkdownWithRemoteImages(
    props.id,
    props.type,
  );

  const nonce = new Date().valueOf();

  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {replacements.map((replacement) => (
        <MarkdownImageReplacement
          key={replacement.selector + nonce}
          selector={replacement.selector}
        >
          <InlineExpandedMedia
            className={"max-w-[830px]"}
            embed={{ url: replacement.src, alt: replacement.alt }}
            isExpanded={true}
            localSiteDomain={siteView.site.name}
            remoteImageProps={Promise.resolve(replacement.remoteImageProps)}
          />
        </MarkdownImageReplacement>
      ))}
    </Prose>
  );
};

export type MarkdownType =
  | "community"
  | "person"
  | "post"
  | "comment"
  | "community_site";
const getMarkdownWithRemoteImages = async (id: number, type: MarkdownType) => {
  const imgRegex = /(<img src="\S+" alt=".*">)/;
  const imgRegexWithCaptures = /<img src="(\S+)" alt="(.*)">/;

  let markdownContent = "";

  switch (type) {
    case "community_site":
      const { site } = await apiClient.getCommunity({
        id,
      });
      markdownContent = site?.sidebar ?? "";
      break;
    case "community":
      const { community_view: communityView } = await apiClient.getCommunity({
        id,
      });
      markdownContent = communityView.community.description ?? "";
      break;
    case "person":
      const { person_view: personView } = await apiClient.getPersonDetails({
        person_id: id,
      });
      markdownContent = personView.person.bio ?? "";
      break;
    case "post":
      const { post_view: postView } = await apiClient.getPost({
        id,
      });
      markdownContent = postView.post.body ?? "";
      break;
    case "comment":
      const { comment_view: commentView } = await apiClient.getComment({
        id,
      });
      markdownContent = commentView.comment.content ?? "";
      break;
    default:
      throw new Error("Unknown type");
  }

  const renderedHtml = md.render(markdownContent);

  const sections = renderedHtml.split(imgRegex);

  let replacedHtml = "";
  let replacements: MarkdownImage[] = [];
  let imageCounter = 1;

  for (const section of sections) {
    const match = section.match(imgRegexWithCaptures);

    if (match === null) {
      replacedHtml = replacedHtml + section;
    } else {
      const [_, src, alt] = match;
      const id = `${type}-img-${imageCounter}`;

      replacedHtml += `<span id="${id}"></span>`;

      const remoteImageProps = await getRemoteImageProps(src, 830);
      replacements.push({
        selector: id,
        remoteImageProps,
        src,
        alt,
      });

      imageCounter++;
    }
  }

  return { html: replacedHtml, replacements };
};

type MarkdownImage = {
  selector: string;
  remoteImageProps: RemoteImageProps;
  src: string;
  alt: string;
};
