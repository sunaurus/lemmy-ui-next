import { CommentView, PostView, SortType } from "lemmy-js-client";
import { Comment } from "@/app/comment/Comment";
import { PostListItem } from "@/app/post/PostListItem";

type Props = {
  posts: PostView[];
  comments: CommentView[];
  sortType: SortType;
};
export const CombinedPostsAndComments = (props: Props) => {
  return sort(props).map((view) => {
    return isComment(view) ? (
      <Comment key={view.comment.id} commentView={view} className="my-2" />
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
