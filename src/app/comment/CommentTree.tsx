import { CommentNode } from "@/app/comment/buildCommentTrees";
import { Comment } from "@/app/comment/Comment";
import classNames from "classnames";
import { LazyChildComments } from "@/app/comment/LazyChildComments";

export const CommentTree = (props: { node: CommentNode }) => {
  return (
    <div
      className={classNames("border-neutral-700 group mt-4", {
        "border-l": !!props.node.parent,
        "pt-4 border-t": !props.node.parent,
      })}
    >
      <Comment commentView={props.node.commentView}>
        {props.node.children.map((node) => (
          <CommentTree key={node.commentView.comment.id} node={node} />
        ))}
        <LazyChildComments node={props.node} />
      </Comment>
    </div>
  );
};
