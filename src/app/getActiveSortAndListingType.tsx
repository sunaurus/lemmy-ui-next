import { MyUserInfo, SiteView } from "lemmy-js-client";
import { PostListSearchParams } from "@/app/post/PostList";

export const getActiveSortAndListingType = (
  siteView: SiteView,
  loggedInUser: MyUserInfo | undefined,
  searchParams: PostListSearchParams,
) => {
  let sortType = siteView.local_site.default_sort_type ?? "Active";
  let listingType = siteView.local_site.default_post_listing_type;

  if (loggedInUser) {
    sortType = loggedInUser.local_user_view.local_user.default_sort_type;
    listingType = loggedInUser.local_user_view.local_user.default_listing_type;
  }

  if (searchParams.listingType) {
    listingType = searchParams.listingType;
  }

  if (searchParams.sortType) {
    sortType = searchParams.sortType;
  }
  return { sortType, listingType };
};
