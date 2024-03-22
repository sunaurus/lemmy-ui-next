import { PageWithSidebar } from "@/app/PageWithSidebar";
import { PostListItem } from "@/app/post/PostListItem";
import { Markdown } from "@/app/(ui)/Markdown";
import { apiClient } from "@/app/apiClient";
import { buildCommentTrees } from "@/app/comment/buildCommentTrees";
import { CommentTree } from "@/app/comment/CommentTree";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { CommentSortType } from "lemmy-js-client";
import { SearchParamLinks } from "@/app/(ui)/SearchParamLinks";

export const PostPageInner = async (props: {
  postId: number;
  commentThreadParentId?: number;
  searchParams: Record<string, string>;
}) => {
  const { post_view: postView } = await apiClient.getPost({
    id: props.postId,
  });

  const { community_view: communityView, moderators } =
    await apiClient.getCommunity({
      id: postView.community.id,
    });

  return (
    <PageWithSidebar
      community={communityView.community}
      mods={moderators.map((mod) => mod.moderator)}
      stats={communityView.counts}
    >
      <article className="w-full">
        <PostListItem postView={postView} />
        {postView.post.body && <PostBody body={postView.post.body} />}
        {postView.counts.comments > 0 ? (
          <Comments
            postId={postView.post.id}
            commentThreadParentId={props.commentThreadParentId}
            searchParams={props.searchParams}
            commentCount={postView.counts.comments}
          />
        ) : (
          <NoComments />
        )}
      </article>
    </PageWithSidebar>
  );
};

const PostBody = (props: { body: string }) => {
  return (
    <div className="rounded bg-neutral-800 mx-2 lg:mx-4 p-4 max-w-[880px]">
      <Markdown content={props.body} />
    </div>
  );
};

const Comments = async (props: {
  postId: number;
  commentThreadParentId?: number;
  searchParams: Record<string, string>;
  commentCount: number;
}) => {
  const searchParamsSortType = props.searchParams[
    "sortType"
  ] as CommentSortType;
  const currentSortType = searchParamsSortType ?? "Hot";

  let maxDepth = 4;
  if (props.commentThreadParentId) {
    // If we're only rendering a single thread, we can fetch a few more comments at once
    maxDepth = 6;
  } else if (props.commentCount > 500) {
    // For huge threads, we can improve performance by auto-collapsing very aggressively
    maxDepth = 1;
  } else if (props.commentCount > 100) {
    maxDepth = 3;
  }
  const { comments } = await apiClient.getComments({
    post_id: props.postId,
    parent_id: props.commentThreadParentId,
    max_depth: maxDepth,
    sort: currentSortType,
    type_: "All",
    saved_only: false,
  });

  const commentTrees = buildCommentTrees(comments);

  const enabledSortOptions: CommentSortType[] = [
    "Hot",
    "Top",
    "Controversial",
    "New",
    "Old",
  ];

  return (
    <div>
      {props.commentThreadParentId && (
        <div className="mt-6">
          <div>You are viewing a single comment thread.</div>
          <StyledLink
            href={`/post/${props.postId}`}
            className="flex items-center"
          >
            View all comments <ArrowRightIcon className="h-4" />
          </StyledLink>
        </div>
      )}
      <SearchParamLinks
        label={"Sort"}
        searchParamKey={"sortType"}
        options={enabledSortOptions}
        currentActiveValue={currentSortType}
        className="mt-6 ml-1"
      />

      {commentTrees.map((node) => (
        <CommentTree key={node.commentView.comment.id} node={node} />
      ))}
    </div>
  );
};

const NoComments = () => {
  return <div className="m-6 text-neutral-400">No comments yet!</div>;
};
