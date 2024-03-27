import { PageWithSidebar } from "@/app/PageWithSidebar";
import { PostListItem } from "@/app/post/PostListItem";
import { apiClient } from "@/app/apiClient";
import { CommentSortType, MyUserInfo } from "lemmy-js-client";
import { SearchParamLinks } from "@/app/(ui)/SearchParamLinks";
import { getVoteConfig, VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { MarkdownWithFetchedContent } from "@/app/(ui)/markdown/MarkdownWithFetchedContent";
import { buildCommentTreesAction } from "@/app/comment/commentActions";
import { GetComments } from "lemmy-js-client/dist/types/GetComments";
import { CommentsSection } from "@/app/post/[id]/CommentsSection";

export const PostPageWithSidebar = async (props: {
  postId: number;
  commentThreadParentId?: number;
  searchParams: Record<string, string>;
  highlightCommentId?: number;
}) => {
  const [
    { post_view: postView },
    { site_view: siteView, my_user: loggedInUser },
  ] = await Promise.all([
    apiClient.getPost({
      id: props.postId,
    }),
    apiClient.getSite(),
  ]);

  const { community_view: communityView, moderators } =
    await apiClient.getCommunity({
      id: postView.community.id,
    });

  return (
    <PageWithSidebar
      community={communityView.community}
      mods={moderators.map((mod) => mod.moderator)}
      stats={communityView.counts}
    >
      <article className="w-full">
        <PostListItem postView={postView} />
        {postView.post.body && <PostBody id={postView.post.id} />}
        <Comments
          loggedInUser={loggedInUser}
          postId={postView.post.id}
          commentThreadParentId={props.commentThreadParentId}
          searchParams={props.searchParams}
          highlightCommentId={props.highlightCommentId}
          voteConfig={getVoteConfig(siteView.local_site)}
        />
      </article>
    </PageWithSidebar>
  );
};

const PostBody = (props: { id: number }) => {
  return (
    <div className="mx-2 max-w-[880px] rounded bg-neutral-800 p-4 lg:mx-4">
      <MarkdownWithFetchedContent id={props.id} type={"post"} />
    </div>
  );
};

const Comments = async (props: {
  postId: number;
  commentThreadParentId?: number;
  searchParams: Record<string, string>;
  highlightCommentId?: number;
  voteConfig: VoteConfig;
  loggedInUser?: MyUserInfo;
}) => {
  const searchParamsSortType = props.searchParams[
    "sortType"
  ] as CommentSortType;
  const currentSortType = searchParamsSortType ?? "Hot";

  let maxDepth = 4;
  if (props.commentThreadParentId) {
    // If we're only rendering a single thread, we can fetch a few more comments at once
    maxDepth = 6;
  }

  const commentRequestForm: GetComments = {
    post_id: props.postId,
    parent_id: props.commentThreadParentId,
    max_depth: maxDepth,
    sort: currentSortType,
    type_: "All",
    saved_only: false,
  };
  const initialCommentTrees = await buildCommentTreesAction(
    commentRequestForm,
    new Set(),
  );

  const enabledSortOptions: CommentSortType[] = [
    "Hot",
    "Top",
    "Controversial",
    "New",
    "Old",
  ];

  return (
    <div>
      <SearchParamLinks
        label={"Sort"}
        searchParamKey={"sortType"}
        options={enabledSortOptions}
        currentActiveValue={currentSortType}
        className="ml-1 mt-6"
      />
      <CommentsSection
        postId={props.postId}
        voteConfig={props.voteConfig}
        initialCommentTrees={initialCommentTrees}
        commentRequestForm={commentRequestForm}
        commentThreadParentId={props.commentThreadParentId}
      />
    </div>
  );
};
