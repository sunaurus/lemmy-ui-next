import { PostListItem } from "@/app/post/postListItem";
import { apiClient } from "@/app/apiClient";
import { CommentTree } from "@/app/post/[id]/CommentTree";
import { buildCommentTrees } from "@/app/post/[id]/buildCommentTrees";
import { Markdown } from "@/app/_ui/Markdown";
import { Suspense } from "react";
import { Spinner } from "@/app/_ui/Spinner";
import { PageWithSidebar } from "@/app/PageWithSidebar";

const PostPage = async ({ params }: { params: { id: Number } }) => {
  const { post_view: postView } = await apiClient.getPost({
    id: Number(params.id),
  });

  const { community_view: communityView, moderators } =
    await apiClient.getCommunity({
      id: postView.community.id,
    });

  return (
    <div className="">
      <PageWithSidebar
        community={communityView.community}
        mods={moderators.map((mod) => mod.moderator)}
        stats={communityView.counts}
      >
        <article className="w-full">
          <PostListItem key={postView.post.id} postView={postView} />
          {postView.post.body && <PostBody body={postView.post.body} />}
          {postView.counts.comments > 0 ? (
            <Suspense fallback={<CommentsLoading />}>
              <Comments postId={postView.post.id} />
            </Suspense>
          ) : (
            <NoComments />
          )}
        </article>
      </PageWithSidebar>
    </div>
  );
};

const PostBody = (props: { body: string }) => {
  return (
    <div className="rounded bg-neutral-800 ml-4 p-4 max-w-[880px]">
      <Markdown content={props.body} />
    </div>
  );
};

const Comments = async (props: { postId: number }) => {
  const { comments } = await apiClient.getComments({
    post_id: props.postId,
    max_depth: 4,
    sort: "Hot",
    type_: "All",
    saved_only: false,
  });

  const commentTrees = buildCommentTrees(comments);

  return (
    <div>
      {commentTrees.map((node) => (
        <CommentTree key={node.commentView.comment.id} node={node} />
      ))}
    </div>
  );
};

const CommentsLoading = () => {
  return (
    <div className="m-6 text-neutral-400 flex items-center">
      <Spinner />
      Loading comments...
    </div>
  );
};

const NoComments = () => {
  return <div className="m-6 text-neutral-400">No comments yet!</div>;
};

export default PostPage;
