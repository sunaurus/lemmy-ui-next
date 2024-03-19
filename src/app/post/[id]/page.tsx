import { PostPageInner } from "@/app/post/[id]/PostPageInner";

const PostPage = async ({ params }: { params: { id: Number } }) => {
  return <PostPageInner postId={Number(params.id)} />;
};

export default PostPage;
