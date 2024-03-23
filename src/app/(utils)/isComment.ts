import { CommentView, PostView } from "lemmy-js-client";

export const isComment = (
  input: PostView | CommentView,
): input is CommentView => {
  return (input as CommentView).comment !== undefined;
};
