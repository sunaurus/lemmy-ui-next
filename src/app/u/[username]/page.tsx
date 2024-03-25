import { apiClient } from "@/app/apiClient";
import { SortType } from "lemmy-js-client";
import { PostListItem } from "@/app/post/PostListItem";
import { Pagination } from "@/app/(ui)/Pagination";
import { SearchParamLinks } from "@/app/(ui)/SearchParamLinks";
import { Comment } from "@/app/comment/Comment";
import { Metadata, ResolvingMetadata } from "next";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";
import { formatDistanceToNowStrict } from "date-fns";
import { CombinedPostsAndComments } from "@/app/search/CombinedPostsAndComments";
import { Header } from "@/app/(ui)/Header";
import { getVoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { MarkdownWithRemoteImages } from "@/app/(ui)/markdown/MarkdownWithRemoteImages";

type UserPageProps = {
  params: { username: string };
  searchParams: Record<string, string>;
};
export const generateMetadata = async (
  props: UserPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const username = decodeURIComponent(props.params.username);

  const { person_view: personView } = await apiClient.getPersonDetails({
    username,
  });

  const { site_view: siteView } = await apiClient.getSite();

  let images = (await parent).openGraph?.images || [];

  if (personView.person.banner) {
    images = [personView.person.banner, ...images];
  }
  if (personView.person.avatar) {
    images = [personView.person.avatar, ...images];
  }

  const title = `Profile of ${formatPersonUsername(personView.person)} on ${siteView.site.name}`;
  return {
    title: title,
    description: personView.person.bio,
    openGraph: {
      title: title,
      description: `Joined ${formatDistanceToNowStrict(
        new Date(personView.person.published),
        {
          addSuffix: true,
        },
      )} • ${personView.counts.post_count} posts and ${personView.counts.comment_count} comments`,
      siteName: siteView.site.name,
      images: [images[0]],
      username: formatPersonUsername(personView.person),
    },
  };
};

type ViewType = "Overview" | "Comments" | "Posts";

const UserPage = async (props: UserPageProps) => {
  const username = decodeURIComponent(props.params.username);

  const { site_view: siteView } = await apiClient.getSite();

  const currentSortType: SortType =
    (props.searchParams["sortType"] as SortType) ?? "New";
  const currentPage = props.searchParams["page"]
    ? Number(props.searchParams["page"])
    : 1;
  const currentView = (props.searchParams["view"] as ViewType) ?? "Overview";

  const availableSortTypes: SortType[] = ["New", "Old", "TopAll"];
  const availableViewOptions: ViewType[] = ["Overview", "Posts", "Comments"];

  const {
    person_view: personView,
    moderates,
    site,
    comments,
    posts,
  } = await apiClient.getPersonDetails({
    username,
    sort: currentSortType,
    page: currentPage,
  });

  return (
    <div className="m-2 mt-4">
      <Header view={personView} />
      <div className="ml-4 mt-2">
        <MarkdownWithRemoteImages type="person" id={personView.person.id} />
      </div>
      <div className="m-2 ml-3">
        <SearchParamLinks
          label={"Filter"}
          searchParamKey={"view"}
          options={availableViewOptions}
          currentActiveValue={currentView}
        />
        <SearchParamLinks
          label={"Sort"}
          searchParamKey={"sortType"}
          options={availableSortTypes}
          currentActiveValue={currentSortType}
        />
      </div>
      <div className="flex flex-col gap-2 items-start">
        {currentView === "Posts" &&
          posts.map((postView) => (
            <PostListItem key={postView.post.id} postView={postView} />
          ))}
        {currentView === "Comments" &&
          comments.map((commentView) => (
            <Comment
              key={commentView.comment.id}
              commentView={commentView}
              addPostLink={true}
              voteConfig={getVoteConfig(siteView.local_site)}
            />
          ))}
        {currentView === "Overview" && (
          <CombinedPostsAndComments
            posts={posts}
            comments={comments}
            sortType={currentSortType}
          />
        )}
      </div>
      <Pagination
        prevPage={currentPage > 1 ? currentPage - 1 : undefined}
        nextPage={currentPage + 1}
      />
    </div>
  );
};

export default UserPage;
