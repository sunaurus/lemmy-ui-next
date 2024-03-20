import { Community, ListingType, PostView, SortType } from "lemmy-js-client";
import { apiClient } from "@/app/apiClient";
import { getActiveSortAndListingType } from "@/app/post/getActiveSortAndListingType";
import { PostListItem } from "@/app/post/PostListItem";
import { SortTypeLinks } from "@/app/(ui)/SortTypeLinks";

export type PostListSearchParams = {
  listingType?: ListingType;
  sortType: SortType;
};

export const PostList = async (props: {
  community?: Community;
  searchParams: PostListSearchParams;
}) => {
  const { site_view: siteView, my_user: loggedInUser } =
    await apiClient.getSite();

  const { sortType, listingType } = getActiveSortAndListingType(
    siteView,
    loggedInUser,
    props.searchParams,
  );

  const { posts } = await apiClient.getPosts({
    community_id: props.community?.id,
    limit: 25,
    type_: listingType,
    sort: sortType,
  });

  const availableSortOptions: SortType[] = [
    "Active",
    "Scaled",
    "Hot",
    "New",
    "TopAll",
    "TopYear",
    "TopMonth",
    "TopWeek",
    "TopDay",
  ];

  let basePath = "/";
  if (props.community) {
    basePath = `/c/${props.community.name}`;
    if (!props.community.local) {
      basePath = `${basePath}@${new URL(props.community.actor_id).host}`;
    }
  }

  return (
    <div>
      <SortTypeLinks
        enabledSortOptions={availableSortOptions}
        currentSortType={sortType}
        basePath={basePath}
        searchParams={props.searchParams}
      />
      {posts.map((postView: PostView) => (
        <PostListItem
          key={postView.post.id}
          postView={postView}
          hideCommunityName={!!props.community}
        />
      ))}
    </div>
  );
};
