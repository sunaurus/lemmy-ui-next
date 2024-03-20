import { Community, ListingType, PostView, SortType } from "lemmy-js-client";
import { apiClient } from "@/app/apiClient";
import { getActiveSortAndListingType } from "@/app/getActiveSortAndListingType";
import { StyledLink } from "@/app/(ui)/StyledLink";
import classNames from "classnames";
import { PostListItem } from "@/app/post/PostListItem";

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

  const sortTypes: SortType[] = [
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

  return (
    <div>
      <div className="m-1 lg:ml-4 flex items-center gap-1 lg:gap-2 flex-wrap text-xs lg:text-sm">
        <div>Sort:</div>
        {sortTypes.map((target) => {
          let communityUrl = undefined;
          if (props.community) {
            communityUrl = `/c/${props.community.name}`;
            if (!props.community.local) {
              communityUrl = `${communityUrl}@${new URL(props.community.actor_id).host}`;
            }
          }

          return (
            <SortTypeLink
              key={target}
              path={communityUrl ?? "/"}
              currentSortType={sortType}
              currentSearchParams={props.searchParams}
              targetSortType={target}
            />
          );
        })}
      </div>

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

const SortTypeLink = (props: {
  path: string;
  currentSearchParams: Record<string, string>;
  currentSortType: SortType;
  targetSortType: SortType;
}) => {
  return (
    <StyledLink
      href={`${props.path}?${new URLSearchParams({
        ...props.currentSearchParams,
        sortType: props.targetSortType,
      }).toString()}`}
      className={classNames({
        "font-bold text-neutral-300":
          props.currentSortType === props.targetSortType,
      })}
    >
      {props.targetSortType}
    </StyledLink>
  );
};
