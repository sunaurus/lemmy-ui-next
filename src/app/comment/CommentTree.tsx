import { CommentNode } from "@/app/comment/commentActions";
import { Comment } from "@/app/comment/Comment";
import classNames from "classnames";
import { LazyChildComments } from "@/app/comment/LazyChildComments";
import { VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { memo } from "react";

export const CommentTree = memo(
  (props: {
    node: CommentNode;
    highlightRoot?: boolean;
    voteConfig: VoteConfig;
  }) => {
    return (
      <div
        className={classNames("border-neutral-700 group mt-4", {
          "border-l": !!props.node.parent,
          "pt-4 border-t": !props.node.parent,
        })}
      >
        <Comment
          commentView={props.node.commentView}
          parentId={props.node.parent?.commentView.comment.id}
          highlight={props.highlightRoot}
          voteConfig={props.voteConfig}
          markdown={props.node.markdown}
        >
          {props.node.children.map((node) => (
            <CommentTree
              key={node.commentView.comment.id}
              node={node}
              voteConfig={props.voteConfig}
            />
          ))}
          <LazyChildComments node={props.node} voteConfig={props.voteConfig} />
        </Comment>
      </div>
    );
  },
  (prevProps, newProps) =>
    prevProps.node.commentView.comment.id ===
    newProps.node.commentView.comment.id,
);

CommentTree.displayName = "CommentTree";
