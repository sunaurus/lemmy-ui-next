"use client";

import { useState } from "react";
import {
  buildCommentTrees,
  CommentNode,
} from "@/app/comment/buildCommentTrees";
import { Comment } from "@/app/comment/Comment";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { loadChildCommentsAction } from "@/app/comment/loadChildCommentsAction";

export const CommentTree = (props: { node: CommentNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={
        "mt-4" +
        " " +
        (props.node.parent
          ? "ml-4 border-l border-l-neutral-700"
          : "pt-4 border-t border-t-neutral-700")
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
