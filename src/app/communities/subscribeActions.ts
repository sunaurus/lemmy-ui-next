"use server";

import { apiClient } from "@/app/apiClient";
import { revalidatePath } from "next/cache";

export const subscribeAction = async (communityId: number, data: FormData) => {
  await apiClient.followCommunity({ community_id: communityId, follow: true });
  revalidatePath("/communities");
};
export const unsubscribeAction = async (
  communityId: number,
  data: FormData,
) => {
  await apiClient.followCommunity({ community_id: communityId, follow: false });
  revalidatePath("/communities");
};
