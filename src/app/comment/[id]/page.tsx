import { PostPageInner } from "@/app/post/[id]/PostPageInner";
import { apiClient } from "@/app/apiClient";
import { Metadata, ResolvingMetadata } from "next";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";

type CommentPageProps = {
  params: { id: string };
  searchParams: Record<string, string>;
};
export const generateMetadata = async (
  props: CommentPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const { comment_view: commentView } = await apiClient.getComment({
    id: Number(props.params.id),
  });

  const { site_view: siteView } = await apiClient.getSite();

  let images = (await parent).openGraph?.images || [];

  if (commentView.community.icon) {
    images = [commentView.community.icon, ...images];
  }
  if (commentView.community.banner) {
    images = [commentView.community.banner, ...images];
  }

  if (commentView.post.thumbnail_url) {
    images = [commentView.post.thumbnail_url, ...images];
  }

  return {
    title: `Comment by ${formatPersonUsername(commentView.creator)} on ${commentView.post.name}`,
    description: commentView.community.title,
    openGraph: {
      title: `Comment by ${formatPersonUsername(commentView.creator)} on ${commentView.post.name}`,
      description: `Commented in ${formatCommunityName(commentView.community)} by ${formatPersonUsername(commentView.creator)} • ${commentView.counts.score} points and ${commentView.counts.child_count} replies`,
      siteName: siteView.site.name,
      images: [images[0]],
    },
  };
};

const CommentPage = async ({ params, searchParams }: CommentPageProps) => {
  const { comment_view: commentView } = await apiClient.getComment({
    id: Number(params.id),
  });

  return (
    <PostPageInner
      postId={commentView.post.id}
      commentThreadParentId={commentView.comment.id}
      searchParams={searchParams}
    />
  );
};

export default CommentPage;
