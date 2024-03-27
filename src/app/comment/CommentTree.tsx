import { CommentNode } from "@/app/comment/commentActions";
import { Comment } from "@/app/comment/Comment";
import classNames from "classnames";
import { VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { memo } from "react";
import { MyUserInfo } from "lemmy-js-client";

export const CommentTree = memo(
  (props: {
    node: CommentNode;
    highlightRoot?: boolean;
    voteConfig: VoteConfig;
    loggedInUser?: MyUserInfo;
  }) => {
    return (
      <div
        className={classNames("group mt-4 border-neutral-700", {
          "border-l": !!props.node.parent,
          "border-t pt-4": !props.node.parent,
        })}
      >
        <Comment
          loggedInUser={props.loggedInUser}
          commentView={props.node.commentView}
          parentId={props.node.parent?.commentView.comment.id}
          highlight={props.highlightRoot}
          voteConfig={props.voteConfig}
          markdown={props.node.markdown}
          node={props.node}
        />
      </div>
    );
  },
  (prevProps, newProps) =>
    prevProps.node.commentView.comment.id ===
    newProps.node.commentView.comment.id,
);

CommentTree.displayName = "CommentTree";
