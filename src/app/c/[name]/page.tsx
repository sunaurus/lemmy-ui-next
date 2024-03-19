import { apiClient } from "@/app/apiClient";
import { CommunityView, PostView } from "lemmy-js-client";
import Image from "next/image";
import { PostListItem } from "@/app/post/postListItem";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { PageWithSidebar } from "@/app/PageWithSidebar";

const CommunityPage = async (props: { params: { name: string } }) => {
  const communityName = decodeURIComponent(props.params.name);

  const {
    community_view: communityView,
    moderators,
    site,
  } = await apiClient.getCommunity({
    name: communityName,
  });

  const { posts } = await apiClient.getPosts({
    community_id: communityView.community.id,
    limit: 25,
  });

  return (
    <PageWithSidebar
      community={communityView.community}
      mods={moderators.map((mod) => mod.moderator)}
      stats={communityView.counts}
      site={site}
    >
      <>
        <Header communityView={communityView} />

        {posts.map((postView: PostView) => (
          <PostListItem
            key={postView.post.id}
            postView={postView}
            hideCommunityName={true}
          />
        ))}
      </>
    </PageWithSidebar>
  );
};

const Header = (props: { communityView: CommunityView }) => {
  const bannerSrc = props.communityView.community.banner;
  return (
    <header>
      {bannerSrc && (
        <div className="relative h-[240px] max-w-[1000px]">
          <Image
            className={"object-cover rounded"}
            src={bannerSrc}
            fill={true}
            alt={"Community banner"}
            sizes="1000px"
          />
        </div>
      )}

      <h1 className="text-2xl">{props.communityView.community.name}</h1>
      <div className="text-md text-neutral-400">
        !{formatCommunityName(props.communityView.community)}
      </div>
    </header>
  );
};

export default CommunityPage;
