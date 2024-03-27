"use client";

import {
  buildCommentTreesAction,
  CommentNode,
} from "@/app/comment/commentActions";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { CommentTree } from "@/app/comment/CommentTree";
import { MouseEvent, useState } from "react";
import { VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { MyUserInfo } from "lemmy-js-client";

export const LazyChildComments = (props: {
  node: CommentNode;
  voteConfig: VoteConfig;
  loggedInUser?: MyUserInfo;
}) => {
  const [loadedComments, setLoadedComments] = useState<CommentNode[] | null>(
    null,
  );

  if (
    props.node.children.length > 0 ||
    props.node.commentView.counts.child_count === 0
  ) {
    return null;
  }

  const onLoadMore = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    const commentTrees = await buildCommentTreesAction(
      {
        parent_id: props.node.commentView.comment.id,
        max_depth: 8,
        sort: "Hot",
        type_: "All",
        saved_only: false,
      },
      new Set(),
    );

    setLoadedComments(commentTrees.rootNodes[0].children);
  };

  if (loadedComments === null) {
    return (
      <a
        href={`/comment/${props.node.commentView.comment.id}`} // If JS is disabled, we can just navigate to the comment page
        className="text-primary-400 hover:text-primary-300 ml-10 mt-2 flex cursor-pointer
          items-center text-xs"
        onClick={onLoadMore}
      >
        Show more comments <ArrowRightIcon className="ml-2 h-4" />
      </a>
    );
  }

  return loadedComments.map((node) => (
    <CommentTree
      key={node.commentView.comment.id}
      node={node}
      voteConfig={props.voteConfig}
      loggedInUser={props.loggedInUser}
    />
  ));
};
