import { CommentView, PostView, SortType } from "lemmy-js-client";
import { Comment } from "@/app/comment/Comment";
import { PostListItem } from "@/app/post/PostListItem";
import { apiClient } from "@/app/apiClient";
import { getVoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { getMarkdownWithRemoteImages } from "@/app/(ui)/markdown/MarkdownWithFetchedContent";

type Props = {
  posts: PostView[];
  comments: CommentView[];
  sortType: SortType;
};
export const CombinedPostsAndComments = async (props: Props) => {
  const { site_view: siteView } = await apiClient.getSite();

  return sort(props).map(async (view) => {
    return isComment(view) ? (
      <Comment
        key={view.comment.id}
        commentView={view}
        className="my-2"
        addPostLink={true}
        voteConfig={getVoteConfig(siteView.local_site)}
        markdown={{
          ...(await getMarkdownWithRemoteImages(
            view.comment.content,
            `comment-${view.comment.id}`,
          )),
          localSiteName: siteView.site.name,
        }}
      />
    ) : (
      <PostListItem key={view.post.id} postView={view} />
    );
  });
};

const sort = (props: Props): Array<PostView | CommentView> => {
  switch (props.sortType) {
    case "New":
      return [...props.comments, ...props.posts].sort(sortNew);
    case "Old":
      return [...props.comments, ...props.posts].sort(sortOld);
    default:
      return [...props.comments, ...props.posts].sort(sortScore);
  }
};

const sortOld = (
  a: PostView | CommentView,
  b: PostView | CommentView,
): number => {
  const aPublished = isComment(a) ? a.comment.published : a.post.published;
  const bPublished = isComment(b) ? b.comment.published : b.post.published;

  return aPublished > bPublished ? 1 : -1;
};

const sortNew = (
  a: PostView | CommentView,
  b: PostView | CommentView,
): number => {
  const aPublished = isComment(a) ? a.comment.published : a.post.published;
  const bPublished = isComment(b) ? b.comment.published : b.post.published;

  return aPublished < bPublished ? 1 : -1;
};

const sortScore = (
  a: PostView | CommentView,
  b: PostView | CommentView,
): number => {
  const aScore = a.counts.score;
  const bScore = b.counts.score;

  return aScore > bScore ? 1 : -1;
};

const isComment = (input: PostView | CommentView): input is CommentView => {
  return (input as CommentView).comment !== undefined;
};
