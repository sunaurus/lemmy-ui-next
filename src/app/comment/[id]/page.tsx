import { PostPageInner } from "@/app/post/[id]/PostPageInner";
import { apiClient } from "@/app/apiClient";

const CommentPage = async ({ params }: { params: { id: string } }) => {
  const { comment_view: commentView } = await apiClient.getComment({
    id: Number(params.id),
  });

  return (
    <PostPageInner
      postId={commentView.post.id}
      commentThreadParentId={commentView.comment.id}
    />
  );
};

export default CommentPage;
