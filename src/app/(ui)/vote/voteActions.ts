"use server";

import { apiClient } from "@/app/apiClient";
import { revalidatePath } from "next/cache";

export const votePostAction = async (postId: number, score: number) => {
  console.log(score);
  await apiClient.likePost({ post_id: postId, score });

  revalidatePath("/");
  revalidatePath(`/post/${postId}`);
};

export const voteCommentAction = async (
  postId: number,
  commentId: number,
  score: number,
) => {
  await apiClient.likeComment({ comment_id: commentId, score });

  revalidatePath("/");
  revalidatePath(`/post/${postId}`);
  revalidatePath(`/comment/[id]`, "page");
};
