"use server";

import { apiClient } from "@/app/apiClient";
import { GetComments } from "lemmy-js-client/dist/types/GetComments";
import { CommentView } from "lemmy-js-client";
import { getMarkdownWithRemoteImages } from "@/app/(ui)/markdown/MarkdownWithFetchedContent";
import { MarkdownPropsWithReplacements } from "@/app/(ui)/markdown/Markdown";

export type CommentNode = {
  commentView: CommentView;
  children: CommentNode[];
  parent: CommentNode | null;
  markdown: MarkdownPropsWithReplacements;
};
export const buildCommentTreesAction = async (
  form: GetComments,
  rootNode?: CommentNode,
): Promise<CommentNode[]> => {
  const [{ comments }, { site_view: siteView }] = await Promise.all([
    apiClient.getComments(form),
    apiClient.getSite(),
  ]);

  const commentNodeMap = new Map<string, CommentNode>();
  const topLevelNodes = [];

  for (const commentView of comments) {
    const path = commentView.comment.path.split(".");
    const commentId = path[path.length - 1];
    const parentId = path[path.length - 2];
    let parentNode = null;
    if (rootNode) {
      if (String(rootNode.commentView.comment.id) == parentId) {
        parentNode = rootNode;
      }
    } else if (parentId !== "0") {
      parentNode = commentNodeMap.get(parentId) ?? null;
    }

    const commentNode =
      rootNode && parentId === "0"
        ? rootNode
        : {
            commentView,
            children: [],
            parent: parentNode,
            markdown: {
              ...(await getMarkdownWithRemoteImages(
                commentView.comment.content,
                `comment-${commentView.comment.id}`,
              )),
              localSiteName: siteView.site.name,
            },
          };

    if (parentNode) {
      parentNode.children.push(commentNode);
    }

    if (!parentNode) {
      topLevelNodes.push(commentNode);
    }

    commentNodeMap.set(commentId, commentNode);
  }

  return topLevelNodes;
};
