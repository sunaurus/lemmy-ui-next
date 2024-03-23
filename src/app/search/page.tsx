import { apiClient } from "@/app/apiClient";
import { SearchParamLinks } from "@/app/(ui)/SearchParamLinks";
import { PostListItem } from "@/app/post/PostListItem";
import { Comment } from "@/app/comment/Comment";
import { Pagination } from "@/app/(ui)/Pagination";
import { SearchType, SortType } from "lemmy-js-client";
import { combineAndSortPostAndComments } from "@/app/(utils)/combineAndSortPostsAndComments";
import { isComment } from "@/app/(utils)/isComment";
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
};
const SearchPage = async (props: { searchParams: SearchPageSearchParams }) => {
  const currentSortType: SortType = props.searchParams.sortType ?? "New";
  const currentPage = props.searchParams.page
    ? Number(props.searchParams.page)
    : 1;
  const currentSearchType = props.searchParams.type ?? "All";

  const availableSortTypes: SortType[] = ["New", "Old", "TopAll"];
  const availableSearchOptions: SearchType[] = [
    "All",
    "Posts",
    "Comments",
    "Communities",
    "Users",
  ];

  const data = props.searchParams.q
    ? await apiClient.search({
        q: props.searchParams.q,
        type_: currentSearchType,
        page: currentPage,
        sort: currentSortType,
      })
    : undefined;

  return (
    <div className="m-3">
      <div className="">
        <SearchParamLinks
          label={"Filter"}
          searchParamKey={"type"}
          options={availableSearchOptions}
          currentActiveValue={currentSearchType}
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

      <div className="flex flex-col gap-2 items-start mt-4">
        {currentSearchType === "Posts" &&
          data?.posts &&
          data.posts.map((postView) => (
            <PostListItem key={postView.post.id} postView={postView} />
          ))}
        {currentSearchType === "Comments" &&
          data?.comments &&
          data.comments.map((commentView) => (
            <Comment key={commentView.comment.id} commentView={commentView} />
          ))}
        {currentSearchType === "All" &&
          (data?.posts || data?.comments) &&
          combineAndSortPostAndComments(
            data.posts,
            data.comments,
            currentSortType,
          ).map((view) => {
            return isComment(view) ? (
              <Comment key={view.comment.id} commentView={view} />
            ) : (
              <PostListItem key={view.post.id} postView={view} />
            );
          })}
        {(currentSearchType === "All" || currentSearchType === "Communities") &&
          data?.communities &&
          data.communities.map((view) => (
            <CommunityLink key={view.community.id} community={view.community} />
          ))}
        {(currentSearchType === "All" || currentSearchType === "Users") &&
          data?.users &&
          data.users.map((view) => (
            <UserLink key={view.person.id} person={view.person} />
          ))}
      </div>
      {data && (
        <Pagination
          prevPage={currentPage > 1 ? currentPage - 1 : undefined}
          nextPage={currentPage + 1}
        />
      )}
    </div>
  );
};

export default SearchPage;
