import { apiClient } from "@/app/apiClient";
import { SortType } from "lemmy-js-client";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { PageWithSidebar } from "@/app/PageWithSidebar";
import { PostList } from "@/app/post/PostList";
import { Metadata, ResolvingMetadata } from "next";
import { Header } from "@/app/(ui)/Header";

type CommunityPageProps = {
  params: { name: string };
  searchParams: { sortType: SortType };
};

export const generateMetadata = async (
  props: CommunityPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const communityName = decodeURIComponent(props.params.name);

  const [
    { community_view: communityView, moderators },
    { site_view: siteView },
  ] = await Promise.all([
    apiClient.getCommunity({
      name: communityName,
    }),
    apiClient.getSite(),
  ]);

  let images = (await parent).openGraph?.images || [];

  if (communityView.community.icon) {
    images = [communityView.community.icon, ...images];
  }
  if (communityView.community.banner) {
    images = [communityView.community.banner, ...images];
  }

  return {
    title: `!${formatCommunityName(communityView.community)}`,
    description: communityView.community.title,
    openGraph: {
      title: `!${formatCommunityName(communityView.community)}`,
      description: `${communityView.community.title} • ${communityView.counts.posts} posts and ${communityView.counts.comments} comments`,
      siteName: siteView.site.name,
      images: [images[0]],
      type: "website",
    },
  };
};

const CommunityPage = async (props: CommunityPageProps) => {
  const communityName = decodeURIComponent(props.params.name);

  const {
    community_view: communityView,
    moderators,
    site,
  } = await apiClient.getCommunity({
    name: communityName,
  });

  return (
    <PageWithSidebar
      community={communityView.community}
      mods={moderators.map((mod) => mod.moderator)}
      stats={communityView.counts}
      site={site}
    >
      <>
        <Header view={communityView} />

        <PostList
          community={communityView.community}
          searchParams={props.searchParams}
        />
      </>
    </PageWithSidebar>
  );
};

export default CommunityPage;
