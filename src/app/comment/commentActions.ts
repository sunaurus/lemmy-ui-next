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

type Trees = {
  rootNodes: CommentNode[];
  seenThreads: Set<string>;
};

const LIMIT = 5;

export const buildCommentTreesAction = async (
  form: GetComments,
  seenThreads: Set<string>,
): Promise<Trees> => {
  const [{ comments }, { site_view: siteView }] = await Promise.all([
    apiClient.getComments(form),
    apiClient.getSite(),
  ]);

  const commentNodeMap = new Map<string, CommentNode>();

  const topLevelNodes = [];
  const currentBatchThreads = new Set<string>();

  for (const commentView of comments) {
    const path = commentView.comment.path.split(".");

    const commentId = path[path.length - 1];
    const parentId = path[path.length - 2];
    const threadId = path[1];

    if (seenThreads.has(threadId)) {
      continue;
    }

    let parentNode = null;
    const isTopLevelNode = form.parent_id
      ? String(form.parent_id) === commentId
      : parentId === "0";
    if (isTopLevelNode) {
      if (topLevelNodes.length >= LIMIT) {
        continue;
      }
      currentBatchThreads.add(threadId);
    } else {
      parentNode = commentNodeMap.get(parentId) ?? null;
      if (!parentNode) {
        continue;
      }
    }

    const commentNode = {
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

  const combinedSeenThreads = [
    ...Array.from(seenThreads),
    ...Array.from(currentBatchThreads),
  ];
  return {
    rootNodes: topLevelNodes,
    seenThreads: new Set(combinedSeenThreads),
  };
};
