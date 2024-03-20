import { apiClient } from "@/app/apiClient";
import { PageWithSidebar } from "@/app/PageWithSidebar";
import { PostList, PostListSearchParams } from "@/app/post/PostList";

const FrontPage = async ({
  searchParams,
}: {
  searchParams: PostListSearchParams;
}) => {
  const { site_view: siteView, admins } = await apiClient.getSite();

  return (
    <div className="w-full">
      <PageWithSidebar
        site={siteView.site}
        admins={admins.map((admin) => admin.person)}
        stats={siteView.counts}
      >
        <PostList searchParams={searchParams} />
      </PageWithSidebar>
    </div>
  );
};

export default FrontPage;
