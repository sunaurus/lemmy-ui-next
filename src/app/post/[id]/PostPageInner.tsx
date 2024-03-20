import { PageWithSidebar } from "@/app/PageWithSidebar";
import { PostListItem } from "@/app/post/PostListItem";
import { Markdown } from "@/app/(ui)/Markdown";
import { apiClient } from "@/app/apiClient";
import { buildCommentTrees } from "@/app/comment/buildCommentTrees";
import { CommentTree } from "@/app/comment/CommentTree";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { ArrowRightIcon } from "@heroicons/react/16/solid";

export const PostPageInner = async (props: {
  postId: number;
  commentThreadParentId?: number;
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
          // <Suspense fallback={<CommentsLoading />}>
          <Comments
            postId={postView.post.id}
            commentThreadParentId={props.commentThreadParentId}
          />
        ) : (
          // </Suspense>
          <NoComments />
        )}
      </article>
    </PageWithSidebar>
  );
};

const PostBody = (props: { body: string }) => {
  return (
    <div className="rounded bg-neutral-800 ml-4 p-4 max-w-[880px]">
      <Markdown content={props.body} />
    </div>
  );
};

const Comments = async (props: {
  postId: number;
  commentThreadParentId?: number;
}) => {
  const { comments } = await apiClient.getComments({
    post_id: props.postId,
    parent_id: props.commentThreadParentId,
    max_depth: props.commentThreadParentId ? 6 : 4,
    sort: "Hot",
    type_: "All",
    saved_only: false,
  });

  const commentTrees = buildCommentTrees(comments);

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
      {commentTrees.map((node) => (
        <CommentTree key={node.commentView.comment.id} node={node} />
      ))}
    </div>
  );
};

const NoComments = () => {
  return <div className="m-6 text-neutral-400">No comments yet!</div>;
};
