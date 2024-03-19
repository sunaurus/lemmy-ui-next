"use server";

import { apiClient } from "@/app/apiClient";

export const loadChildCommentsAction = async (parentId: number) => {
  const { comments } = await apiClient.getComments({
    parent_id: parentId,
    max_depth: 8,
    sort: "Hot",
    type_: "All",
    saved_only: false,
  });

  return comments;
};
