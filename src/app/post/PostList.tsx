import {
  Community,
  ListingType,
  Person,
  PostView,
  SortType,
} from "lemmy-js-client";
import { apiClient } from "@/app/apiClient";
import { getActiveSortAndListingType } from "@/app/post/getActiveSortAndListingType";
import { PostListItem } from "@/app/post/PostListItem";
import { Pagination } from "@/app/(ui)/Pagination";
import { SearchParamLinks } from "@/app/(ui)/SearchParamLinks";

export type PostListSearchParams = {
  listingType?: ListingType;
  sortType?: SortType;
  page?: string;
};

export const PostList = async (props: {
  community?: Community;
  person?: Person;
  searchParams: PostListSearchParams;
}) => {
  const { site_view: siteView, my_user: loggedInUser } =
    await apiClient.getSite();

  const { sortType, listingType } = getActiveSortAndListingType(
    siteView,
    loggedInUser,
    props.searchParams,
  );

  const { posts, next_page: nextPage } = await apiClient.getPosts({
    community_id: props.community?.id,
    limit: 25,
    type_: listingType,
    sort: sortType,
    page_cursor: props.searchParams.page,
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
    <div className="m-1 flex flex-col lg:ml-4">
      <SearchParamLinks
        label={"Sort"}
        searchParamKey={"sortType"}
        options={availableSortOptions}
        currentActiveValue={sortType}
      />
      <div>
        {posts.map((postView: PostView) => (
          <PostListItem
            key={postView.post.id}
            postView={postView}
            hideCommunityName={!!props.community}
            autoExpandMedia={
              loggedInUser?.local_user_view.local_user.auto_expand
            }
          />
        ))}
      </div>
      {nextPage && <Pagination nextPage={nextPage} />}
    </div>
  );
};
