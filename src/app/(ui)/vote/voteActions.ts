"use server";

import { apiClient } from "@/app/apiClient";
import { revalidatePath } from "next/cache";
import { loginPageWithRedirectAction } from "@/app/login/auth";

export const votePostAction = async (postId: number, score: number) => {
  try {
    await apiClient.likePost({ post_id: postId, score });
  } catch (e) {
    await loginPageWithRedirectAction(`/post/${postId}`);
  }

  revalidatePath("/");
  revalidatePath(`/post/${postId}`);
};

export const voteCommentAction = async (
  postId: number,
  commentId: number,
  score: number,
) => {
  try {
    await apiClient.likeComment({ comment_id: commentId, score });
  } catch (e) {
    await loginPageWithRedirectAction(`/comment/${commentId}`);
  }

  revalidatePath(`/post/${postId}`);
  revalidatePath(`/comment/[id]`, "page");
};
