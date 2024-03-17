"use client";

import { CommentView } from "lemmy-js-client";
import { useState } from "react";
import {
  buildCommentTrees,
  CommentNode,
} from "@/app/post/[id]/buildCommentTrees";
import { UserLink } from "@/app/u/UserLink";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { Markdown } from "@/app/_ui/Markdown";
import { VoteActions } from "@/app/_ui/VoteActions";
import { formatDistanceToNowStrict } from "date-fns";
import { loadChildCommentsAction } from "@/app/post/[id]/loadChildCommentsAction";

export const CommentTree = (props: { node: CommentNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={
        props.node.parent
          ? "ml-4 border-l-neutral-700 border-l"
          : "mt-4 pt-4 border-t border-t-neutral-700"
      }
    >
      <Comment
        commentView={props.node.commentView}
        setCollapsed={setCollapsed}
        isCollapsed={collapsed}
      />
      <div className={collapsed ? "hidden" : ""}>
        {props.node.children.map((node) => (
          <CommentTree key={node.commentView.comment.id} node={node} />
        ))}
        <LoadMoreChildComments node={props.node} />
      </div>
    </div>
  );
};

const LoadMoreChildComments = (props: { node: CommentNode }) => {
  const [loadedComments, setLoadedComments] = useState<CommentNode[] | null>(
    null,
  );

  if (
    props.node.children.length > 0 ||
    props.node.commentView.counts.child_count === 0
  ) {
    return null;
  }

  const onLoadMore = async () => {
    const comments = await loadChildCommentsAction(
      props.node.commentView.comment.id,
    );

    setLoadedComments(buildCommentTrees(comments)[0].children);
  };

  if (loadedComments === null) {
    return (
      <div
        className="flex items-center text-slate-400 hover:text-slate-300 mt-2 ml-10 cursor-pointer text-xs"
        onClick={onLoadMore}
      >
        Load more comments <ArrowRightIcon className="ml-2 h-4" />
      </div>
    );
  }

  return loadedComments.map((node) => (
    <CommentTree key={node.commentView.comment.id} node={node} />
  ));
};

const Comment = (props: {
  commentView: CommentView;
  isCollapsed: boolean;
  setCollapsed(input: boolean): void;
}) => {
  const commentTime = formatDistanceToNowStrict(
    new Date(props.commentView.comment.published),
    {
      addSuffix: true,
    },
  );

  return (
    <div className="mt-2 flex items-start">
      {props.isCollapsed ? <div className="w-10" /> : <VoteActions />}
      <div>
        <div className={"text-xs flex items-center"}>
          <div
            className="hover:text-slate-400 hover:cursor-pointer mr-2"
            onClick={() => props.setCollapsed(!props.isCollapsed)}
          >
            [ {props.isCollapsed ? "+" : "-"} ]
          </div>
          <UserLink person={props.commentView.creator} />
          <div className="ml-2">
            {props.commentView.counts.score} points {commentTime}
          </div>
        </div>
        {!props.isCollapsed && (
          <>
            <Markdown content={props.commentView.comment.content} />
            <div className="text-xs font-semibold cursor-pointer">
              permalink embed save report reply
            </div>
          </>
        )}
      </div>
    </div>
  );
};
