import { Community } from "lemmy-js-client";

export const formatCommunityName = (community: Community) =>
  `${community.name}@${new URL(community.actor_id).host}`;
