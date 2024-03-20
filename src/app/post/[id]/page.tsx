import { PostPageInner } from "@/app/post/[id]/PostPageInner";

const PostPage = async ({
  params,
  searchParams,
}: {
  params: { id: Number };
  searchParams: Record<string, string>;
}) => {
  return (
    <PostPageInner postId={Number(params.id)} searchParams={searchParams} />
  );
};

export default PostPage;
