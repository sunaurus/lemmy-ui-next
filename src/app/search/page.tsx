import { apiClient } from "@/app/apiClient";
import { SearchParamLinks } from "@/app/(ui)/SearchParamLinks";
import { PostListItem } from "@/app/post/PostListItem";
import { Comment } from "@/app/comment/Comment";
import { Pagination } from "@/app/(ui)/Pagination";
import {
  CommentView,
  CommunityView,
  ListingType,
  PersonView,
  PostView,
  SearchResponse,
  SearchType,
  SortType,
} from "lemmy-js-client";
import { CombinedPostsAndComments } from "@/app/search/CombinedPostsAndComments";
import { searchAction } from "@/app/search/searchAction";
import { CommunityLink } from "@/app/c/CommunityLink";
import { UserLink } from "@/app/u/UserLink";
import { SearchButton } from "@/app/search/SearchButton";
import { Input } from "@/app/(ui)/Input";

export type SearchPageSearchParams = {
  q?: string;
  sortType?: SortType;
  page?: string;
  type?: SearchType;
  listingType?: ListingType;
};
const SearchPage = async (props: { searchParams: SearchPageSearchParams }) => {
  const { my_user: loggedInUser } = await apiClient.getSite();

  const currentSortType: SortType = props.searchParams.sortType ?? "New";
  const currentPage = props.searchParams.page
    ? Number(props.searchParams.page)
    : 1;
  const currentSearchType = props.searchParams.type ?? "All";
  const currentListingType = props.searchParams.listingType ?? "All";

  let availableListingTypes: ListingType[] = ["Local", "All"];
  if (loggedInUser) {
    availableListingTypes = ["Subscribed", ...availableListingTypes];
  }

  const availableSortTypes: SortType[] = ["New", "Old", "TopAll"];
  const availableSearchOptions: SearchType[] = [
    "All",
    "Posts",
    "Comments",
    "Communities",
    "Users",
  ];

  const limit = 20;
  const data = props.searchParams.q
    ? await apiClient.search({
        q: props.searchParams.q,
        type_: currentSearchType,
        page: currentPage,
        sort: currentSortType,
        listing_type: currentListingType,
        limit: limit,
      })
    : undefined;

  const nextPageAvailable =
    (data?.comments.length ?? 0) === limit ||
    (data?.posts.length ?? 0) === limit ||
    (data?.communities.length ?? 0) === limit ||
    (data?.users.length ?? 0) === limit;

  return (
    <div className="m-3">
      <div className="">
        <SearchParamLinks
          label={"Items"}
          searchParamKey={"type"}
          options={availableSearchOptions}
          currentActiveValue={currentSearchType}
        />
        <SearchParamLinks
          label={"Filter"}
          searchParamKey={"listingType"}
          options={availableListingTypes}
          currentActiveValue={currentListingType}
        />
        <SearchParamLinks
          label={"Sort"}
          searchParamKey={"sortType"}
          options={availableSortTypes}
          currentActiveValue={currentSortType}
        />
      </div>
      <form action={searchAction.bind(null, props.searchParams)}>
        <div className="flex items-end gap-2">
          <label
            htmlFor="q"
            className="block text-sm font-medium leading-6 sr-only"
          >
            Search term
          </label>
          <Input
            id="q"
            name="q"
            className="mt-2 max-w-[400px]"
            defaultValue={props.searchParams.q}
          />
          <SearchButton />
        </div>
      </form>

      <Results
        data={data}
        currentSortType={currentSortType}
        currentSearchType={currentSearchType}
      />
      {data && (
        <Pagination
          prevPage={currentPage > 1 ? currentPage - 1 : undefined}
          nextPage={nextPageAvailable ? currentPage + 1 : undefined}
        />
      )}
    </div>
  );
};

const Results = (props: {
  data: SearchResponse | undefined;
  currentSearchType: SearchType;
  currentSortType: SortType;
}) => {
  if (!props.data) {
    return null;
  }

  return (
    <div className="mt-4">
      {props.currentSearchType === "Posts" && (
        <Posts posts={props.data.posts} />
      )}{" "}
      {props.currentSearchType === "Comments" && (
        <Comments comments={props.data.comments} />
      )}
      {props.currentSearchType === "All" && (
        <PostsAndComments
          posts={props.data.posts}
          comments={props.data.comments}
          sortType={props.currentSortType}
        />
      )}
      {(props.currentSearchType === "All" ||
        props.currentSearchType === "Communities") && (
        <Communities communities={props.data.communities} />
      )}
      {(props.currentSearchType === "All" ||
        props.currentSearchType === "Users") && (
        <Users users={props.data.users} />
      )}
    </div>
  );
};

const PostsAndComments = (props: {
  posts: PostView[];
  comments: CommentView[];
  sortType: SortType;
}) => {
  return (
    <>
      <ResultTitle>Posts & comments</ResultTitle>
      {props.posts.length > 0 || props.comments.length > 0 ? (
        <CombinedPostsAndComments
          posts={props.posts}
          comments={props.comments}
          sortType={props.sortType}
        />
      ) : (
        <NoResults />
      )}
    </>
  );
};

const Posts = (props: { posts: PostView[] }) => {
  return (
    <>
      <ResultTitle>Posts</ResultTitle>
      {props.posts.length > 0 ? (
        props.posts.map((postView) => (
          <PostListItem key={postView.post.id} postView={postView} />
        ))
      ) : (
        <NoResults />
      )}
    </>
  );
};

const Comments = (props: { comments: CommentView[] }) => {
  return (
    <>
      <ResultTitle>Comments</ResultTitle>
      {props.comments.length > 0 ? (
        props.comments.map((commentView) => (
          <Comment key={commentView.comment.id} commentView={commentView} />
        ))
      ) : (
        <NoResults />
      )}
    </>
  );
};
const Communities = (props: { communities: CommunityView[] }) => {
  return (
    <>
      <ResultTitle>Communities</ResultTitle>
      {props.communities.length > 0 ? (
        props.communities.map((view) => (
          <CommunityLink key={view.community.id} community={view.community} />
        ))
      ) : (
        <NoResults />
      )}
    </>
  );
};
const Users = (props: { users: PersonView[] }) => {
  return (
    <>
      <ResultTitle>Users</ResultTitle>
      {props.users.length > 0 ? (
        props.users.map((view) => (
          <UserLink key={view.person.id} person={view.person} />
        ))
      ) : (
        <NoResults />
      )}
    </>
  );
};

const ResultTitle = (props: { children: string }) => {
  return (
    <h1 className="text-sm font-semibold text-neutral-400 mt-4">
      {props.children}
    </h1>
  );
};

const NoResults = () => {
  return <div className={"text-xs m-1"}>No results found</div>;
};

export default SearchPage;
