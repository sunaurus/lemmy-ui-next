"use server";

import { apiClient } from "@/app/apiClient";
import { GetComments } from "lemmy-js-client/dist/types/GetComments";
import { CommentView } from "lemmy-js-client";
import { getMarkdownWithRemoteImages } from "@/app/(ui)/markdown/MarkdownWithFetchedContent";
import { MarkdownProps } from "@/app/(ui)/markdown/Markdown";
import { ROOT_NODES_BATCH_SIZE } from "@/app/comment/constants";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type CommentNode = {
  commentView: CommentView;
  children: CommentNode[];
  parent: CommentNode | null;
  markdown: MarkdownProps;
};

export type CommentTrees = {
  rootNodes: CommentNode[];
  seenThreads: Set<string>;
};

export const buildCommentTreesAction = async (
  form: GetComments,
  seenThreads: Set<string>,
): Promise<CommentTrees> => {
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
      if (topLevelNodes.length >= ROOT_NODES_BATCH_SIZE) {
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

export const createCommentAction = async (
  postId: number,
  parentId: number | undefined,
  data: FormData,
): Promise<CommentView> => {
  const response = await apiClient.createComment({
    post_id: postId,
    parent_id: parentId,
    content: data.get("content")?.toString() ?? "",
  });

  revalidatePath(`/comment/[id]`, "page");
  revalidatePath(`/post/[id]`, "page");
  if (parentId) {
    return response.comment_view;
  } else {
    redirect(`/comment/${response.comment_view.comment.id}`);
  }
};

export const editCommentAction = async (
  commentId: number,
  data: FormData,
): Promise<CommentView> => {
  const content = data.get("content")?.toString() ?? "";
  const response = await apiClient.editComment({
    comment_id: commentId,
    content,
  });

  revalidatePath(`/comment/[id]`, "page");
  revalidatePath(`/post/[id]`, "page");
  return response.comment_view;
};
export const deleteCommentAction = async (commentId: number) => {
  await apiClient.deleteComment({
    comment_id: commentId,
    deleted: true,
  });

  revalidatePath(`/comment/[id]`, "page");
  revalidatePath(`/post/[id]`, "page");
};
export const restoreCommentAction = async (commentId: number) => {
  await apiClient.deleteComment({
    comment_id: commentId,
    deleted: false,
  });

  revalidatePath(`/comment/[id]`, "page");
  revalidatePath(`/post/[id]`, "page");
};
