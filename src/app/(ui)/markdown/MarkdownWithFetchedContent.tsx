import "server-only";
import { apiClient } from "@/app/apiClient";
import {
  getRemoteImageProps,
  RemoteImageProps,
} from "@/app/(utils)/getRemoteImageProps";
import { md } from "@/app/(ui)/markdown/md";
import { Markdown } from "@/app/(ui)/markdown/Markdown";

type Props = {
  type: MarkdownType;
  id: number;
};

export const MarkdownWithFetchedContent = async (props: Props) => {
  const { site_view: siteView } = await apiClient.getSite();
  const content = await getMarkdownContent(props.id, props.type);
  const { html, replacements } = await getMarkdownWithRemoteImages(
    content,
    `${props.type}-${props.id}`,
  );

  return (
    <Markdown
      localSiteName={siteView.site.name}
      html={html}
      replacements={replacements}
    />
  );
};

export type MarkdownType =
  | "community"
  | "person"
  | "post"
  | "comment"
  | "community_site";

const getMarkdownContent = async (id: number, type: MarkdownType) => {
  switch (type) {
    case "community_site":
      const { site } = await apiClient.getCommunity({
        id,
      });
      return site?.sidebar ?? "";
    case "community":
      const { community_view: communityView } = await apiClient.getCommunity({
        id,
      });
      return communityView.community.description ?? "";
    case "person":
      const { person_view: personView } = await apiClient.getPersonDetails({
        person_id: id,
      });
      return personView.person.bio ?? "";
    case "post":
      const { post_view: postView } = await apiClient.getPost({
        id,
      });
      return postView.post.body ?? "";
    case "comment":
      const { comment_view: commentView } = await apiClient.getComment({
        id,
      });
      return commentView.comment.content ?? "";
    default:
      throw new Error("Unknown type");
  }
};

export const getMarkdownWithRemoteImages = async (
  content: string,
  prefix: string,
) => {
  const imgRegex = /(<(?:img|emoji) src="\S+" alt=".*">)/;
  const imgRegexWithCaptures = /<(img|emoji) src="(\S+)" alt="(.*)">/;

  const renderedHtml = md.render(content);

  const sections = renderedHtml.split(imgRegex);

  console.log(sections);

  let replacedHtml = "";
  let replacements: MarkdownImage[] = [];
  let imageCounter = 1;

  for (const section of sections) {
    const match = section.match(imgRegexWithCaptures);

    if (match === null) {
      replacedHtml = replacedHtml + section;
    } else {
      const [_, type, src, alt] = match;
      const id = `${prefix}-img-${imageCounter}`;

      replacedHtml += `<span id="${id}"></span>`;

      const remoteImageProps = await getRemoteImageProps(
        src,
        type === "emoji" ? 60 : 830,
      );
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

export type MarkdownImage = {
  selector: string;
  remoteImageProps: RemoteImageProps;
  src: string;
  alt: string;
};
