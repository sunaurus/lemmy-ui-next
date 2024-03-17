import { PostListItem } from "@/app/post/postListItem";
import { PostView } from "lemmy-js-client";
import { apiClient } from "@/app/apiClient";
import { Sidebar } from "@/app/Sidebar";

const FrontPage = async () => {
  const { site_view: siteView, admins } = await apiClient.getSite();

  const { posts } = await apiClient.getPosts({ limit: 25 });

  return (
    <div className="w-full">
      {posts.map((postView: PostView) => (
        <PostListItem key={postView.post.id} postView={postView} />
      ))}
      <Sidebar
        site={siteView.site}
        admins={admins.map((admin) => admin.person)}
        stats={siteView.counts}
      />
    </div>
  );
};

export default FrontPage;
