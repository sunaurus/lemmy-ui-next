import { CommentView, PostView, SortType } from "lemmy-js-client";
import { isComment } from "@/app/(utils)/isComment";

export const combineAndSortPostAndComments = (
  posts: PostView[],
  comments: CommentView[],
  currentSortType: SortType,
): Array<PostView | CommentView> => {
  switch (currentSortType) {
    case "New":
      return [...comments, ...posts].sort(sortNew);
    case "Old":
      return [...comments, ...posts].sort(sortOld);
    default:
      return [...comments, ...posts].sort(sortScore);
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
