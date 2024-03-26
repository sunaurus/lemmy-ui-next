import { PageWithSidebar } from "@/app/PageWithSidebar";
import { PostListItem } from "@/app/post/PostListItem";
import { apiClient } from "@/app/apiClient";
import { CommentTree } from "@/app/comment/CommentTree";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { CommentSortType } from "lemmy-js-client";
import { SearchParamLinks } from "@/app/(ui)/SearchParamLinks";
import { getVoteConfig, VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { MarkdownWithFetchedContent } from "@/app/(ui)/markdown/MarkdownWithFetchedContent";
import { buildCommentTreesAction } from "@/app/comment/commentActions";
import { LazyComments } from "@/app/comment/LazyComments";
import { GetComments } from "lemmy-js-client/dist/types/GetComments";
import { ROOT_NODES_BATCH_SIZE } from "@/app/comment/constants";

export const PostPageWithSidebar = async (props: {
  postId: number;
  commentThreadParentId?: number;
  searchParams: Record<string, string>;
  highlightCommentId?: number;
}) => {
  const [{ post_view: postView }, { site_view: siteView }] = await Promise.all([
    apiClient.getPost({
      id: props.postId,
    }),
    apiClient.getSite(),
  ]);

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
        {postView.post.body && <PostBody id={postView.post.id} />}
        {postView.counts.comments > 0 ? (
          <Comments
            postId={postView.post.id}
            commentThreadParentId={props.commentThreadParentId}
            searchParams={props.searchParams}
            commentCount={postView.counts.comments}
            highlightCommentId={props.highlightCommentId}
            voteConfig={getVoteConfig(siteView.local_site)}
          />
        ) : (
          <NoComments />
        )}
      </article>
    </PageWithSidebar>
  );
};

const PostBody = (props: { id: number }) => {
  return (
    <div className="rounded bg-neutral-800 mx-2 lg:mx-4 p-4 max-w-[880px]">
      <MarkdownWithFetchedContent id={props.id} type={"post"} />
    </div>
  );
};

const Comments = async (props: {
  postId: number;
  commentThreadParentId?: number;
  searchParams: Record<string, string>;
  commentCount: number;
  highlightCommentId?: number;
  voteConfig: VoteConfig;
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

  const commentRequestForm: GetComments = {
    post_id: props.postId,
    parent_id: props.commentThreadParentId,
    max_depth: maxDepth,
    sort: currentSortType,
    type_: "All",
    saved_only: false,
  };
  const initialCommentTrees = await buildCommentTreesAction(
    commentRequestForm,
    new Set(),
  );

  const enabledSortOptions: CommentSortType[] = [
    "Hot",
    "Top",
    "Controversial",
    "New",
    "Old",
  ];

  return (
    <div>
      <SearchParamLinks
        label={"Sort"}
        searchParamKey={"sortType"}
        options={enabledSortOptions}
        currentActiveValue={currentSortType}
        className="mt-6 ml-1"
      />
      {props.commentThreadParentId && (
        <div className="mt-6 border-neutral-700 border-t p-4 pb-0">
          <div>You are viewing a single thread.</div>
          <StyledLink
            href={`/post/${props.postId}`}
            className="flex items-center"
          >
            View all comments <ArrowRightIcon className="h-4" />
          </StyledLink>
        </div>
      )}
      {initialCommentTrees.rootNodes.map((node) => (
        <CommentTree
          key={node.commentView.comment.id}
          node={node}
          highlightRoot={
            props.highlightCommentId === node.commentView.comment.id
          }
          voteConfig={props.voteConfig}
        />
      ))}
      {initialCommentTrees.rootNodes.length >= ROOT_NODES_BATCH_SIZE && (
        <LazyComments
          form={commentRequestForm}
          voteConfig={props.voteConfig}
          initialSeenThreads={initialCommentTrees.seenThreads}
        />
      )}
    </div>
  );
};

const NoComments = () => {
  return <div className="m-6 text-neutral-400">No comments yet!</div>;
};
