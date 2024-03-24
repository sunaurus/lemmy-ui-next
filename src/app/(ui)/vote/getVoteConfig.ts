import { LocalSite, MyUserInfo } from "lemmy-js-client";

export const getVoteConfig = (
  localSite: LocalSite,
  loggedInUser?: MyUserInfo,
): VoteConfig => {
  return {
    downvotesEnabled: localSite.enable_downvotes,
    scoresVisible: loggedInUser?.local_user_view.local_user.show_scores ?? true,
  };
};

export type VoteConfig = {
  downvotesEnabled: boolean;
  scoresVisible: boolean;
};
