import Image from "next/image";
import { apiClient } from "@/app/apiClient";
import { Avatar } from "@/app/(ui)/Avatar";
import { Markdown } from "@/app/(ui)/Markdown";
import { CommentView, PostView, SortType } from "lemmy-js-client";
import { PostListItem } from "@/app/post/PostListItem";
import { Pagination } from "@/app/(ui)/Pagination";
import { SearchParamLinks } from "@/app/(ui)/SearchParamLinks";
import { Comment } from "@/app/comment/Comment";
import { UsernameBadge } from "@/app/u/UsernameBadge";

type ViewType = "Overview" | "Comments" | "Posts";
const UserPage = async (props: {
  params: { username: string };
  searchParams: Record<string, string>;
}) => {
  const username = decodeURIComponent(props.params.username);

  const currentSortType: SortType =
    (props.searchParams["sortType"] as SortType) ?? "New";
  const currentPage = props.searchParams["page"]
    ? Number(props.searchParams["page"])
    : 1;
  const currentView = (props.searchParams["view"] as ViewType) ?? "Overview";

  const availableSortTypes: SortType[] = ["New", "Old", "TopAll"];
  const availableViewOptions: ViewType[] = ["Overview", "Posts", "Comments"];

  const {
    person_view: personView,
    moderates,
    site,
    comments,
    posts,
  } = await apiClient.getPersonDetails({
    username,
    sort: currentSortType,
    page: currentPage,
  });

  const bannerSrc = personView.person.banner;

  return (
    <div className="m-2 mt-4">
      <header className="mx-1 lg:mx-4">
        {bannerSrc && (
          <div className="relative h-[240px] max-w-[1000px]">
            <Image
              className={"object-cover rounded"}
              src={bannerSrc}
              fill={true}
              alt={"User banner"}
              priority={true}
              sizes="1000px"
            />
          </div>
        )}

        <div className="flex items-end gap-2 mt-2">
          <Avatar avatarSrc={personView.person.avatar} size="regular" />

          <div>
            <h1 className="text-2xl flex items-center gap-1">
              {personView.person.display_name ?? personView.person.name}
              {personView.is_admin && (
                <UsernameBadge
                  title={"Instance admin"}
                  content={"A"}
                  className={"mt-1.5 border-rose-500 text-rose-500"}
                />
              )}
              {personView.person.bot_account && (
                <UsernameBadge
                  title={"Bot account"}
                  content={"B"}
                  className={"mt-1.5 border-amber-500 text-amber-500"}
                />
              )}
            </h1>
            <div className="text-md">{username}</div>
          </div>
        </div>
      </header>
      <div className="ml-4 mt-2">
        <Markdown content={personView.person.bio ?? ""} />
      </div>
      <div className="m-2 ml-3">
        <SearchParamLinks
          label={"Filter"}
          searchParamKey={"view"}
          options={availableViewOptions}
          currentActiveValue={currentView}
        />
        <SearchParamLinks
          label={"Sort"}
          searchParamKey={"sortType"}
          options={availableSortTypes}
          currentActiveValue={currentSortType}
        />
      </div>
      <div className="flex flex-col gap-2 items-start">
        {currentView === "Posts" &&
          posts.map((postView) => (
            <PostListItem key={postView.post.id} postView={postView} />
          ))}
        {currentView === "Comments" &&
          comments.map((commentView) => (
            <Comment key={commentView.comment.id} commentView={commentView} />
          ))}
        {currentView === "Overview" &&
          combineAndSortPostAndComments(posts, comments, currentSortType).map(
            (view) => {
              return isComment(view) ? (
                <Comment key={view.comment.id} commentView={view} />
              ) : (
                <PostListItem key={view.post.id} postView={view} />
              );
            },
          )}
      </div>
      <Pagination
        prevPage={currentPage > 1 ? currentPage - 1 : undefined}
        nextPage={currentPage + 1}
      />
    </div>
  );
};

const combineAndSortPostAndComments = (
  posts: PostView[],
  comments: CommentView[],
  currentSortType: SortType,
): Array<PostView | CommentView> => {
  switch (currentSortType) {
    case "New":
      return [...comments, ...posts].sort(sortNew);
    case "Old":
      return [...comments, ...posts].sort(sortOld);
    default:
      return [...comments, ...posts].sort(sortScore);
  }
};

const sortOld = (
  a: PostView | CommentView,
  b: PostView | CommentView,
): number => {
  const aPublished = isComment(a) ? a.comment.published : a.post.published;
  const bPublished = isComment(b) ? b.comment.published : b.post.published;

  return aPublished > bPublished ? 1 : -1;
};

const sortNew = (
  a: PostView | CommentView,
  b: PostView | CommentView,
): number => {
  const aPublished = isComment(a) ? a.comment.published : a.post.published;
  const bPublished = isComment(b) ? b.comment.published : b.post.published;

  return aPublished < bPublished ? 1 : -1;
};

const sortScore = (
  a: PostView | CommentView,
  b: PostView | CommentView,
): number => {
  const aScore = a.counts.score;
  const bScore = b.counts.score;

  return aScore > bScore ? 1 : -1;
};

const isComment = (input: PostView | CommentView): input is CommentView => {
  return (input as CommentView).comment !== undefined;
};

export default UserPage;
