import { PostPageInner } from "@/app/post/[id]/PostPageInner";
import { Metadata, ResolvingMetadata } from "next";
import { apiClient } from "@/app/apiClient";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";

type PostPageProps = {
  params: { id: Number };
  searchParams: Record<string, string>;
};
export const generateMetadata = async (
  props: PostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const [{ post_view: postView }, { site_view: siteView }] = await Promise.all([
    apiClient.getPost({
      id: Number(props.params.id),
    }),
    apiClient.getSite(),
  ]);

  let images = (await parent).openGraph?.images || [];

  if (postView.community.icon) {
    images = [postView.community.icon, ...images];
  }
  if (postView.community.banner) {
    images = [postView.community.banner, ...images];
  }

  if (postView.post.thumbnail_url) {
    images = [postView.post.thumbnail_url, ...images];
  }

  return {
    title: postView.post.name,
    description: postView.community.title,
    openGraph: {
      title: postView.post.name,
      description: `Posted in ${formatCommunityName(postView.community)} by ${formatPersonUsername(postView.creator)} • ${postView.counts.score} points and ${postView.counts.comments} comments`,
      siteName: siteView.site.name,
      images: [images[0]],
    },
  };
};

const PostPage = async ({ params, searchParams }: PostPageProps) => {
  return (
    <PostPageInner postId={Number(params.id)} searchParams={searchParams} />
  );
};

export default PostPage;
