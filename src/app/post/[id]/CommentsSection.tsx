"use client";

import { VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { MyUserInfo } from "lemmy-js-client";
import { CommentEditor } from "@/app/comment/CommentEditor";
import { CommentTree } from "@/app/comment/CommentTree";
import { ROOT_NODES_BATCH_SIZE } from "@/app/comment/constants";
import { LazyComments } from "@/app/comment/LazyComments";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { CommentNode, CommentTrees } from "@/app/comment/commentActions";
import { GetComments } from "lemmy-js-client/dist/types/GetComments";

export const CommentsSection = (props: {
  postId: number;
  commentThreadParentId?: number;
  highlightCommentId?: number;
  voteConfig: VoteConfig;
  loggedInUser?: MyUserInfo;
  initialCommentTrees: CommentTrees;
  commentRequestForm: GetComments;
}) => {
  const [addedReplies, setAddedReplies] = useState<CommentNode[]>([]);

  const commentCount =
    addedReplies.length + props.initialCommentTrees.rootNodes.length;

  return (
    <>
      {props.commentThreadParentId ? (
        <SingleThreadInfo postId={props.postId} />
      ) : (
        <CommentEditor
          postId={props.postId}
          className="mx-2 max-w-[880px] lg:mx-4"
        />
      )}
      {commentCount === 0 && <NoComments />}
      {props.initialCommentTrees.rootNodes.map((node) => (
        <CommentTree
          key={node.commentView.comment.id}
          loggedInUser={props.loggedInUser}
          node={node}
          highlightRoot={
            props.highlightCommentId === node.commentView.comment.id
          }
          voteConfig={props.voteConfig}
        />
      ))}
      {props.initialCommentTrees.rootNodes.length >= ROOT_NODES_BATCH_SIZE && (
        <LazyComments
          loggedInUser={props.loggedInUser}
          form={props.commentRequestForm}
          voteConfig={props.voteConfig}
          initialSeenThreads={props.initialCommentTrees.seenThreads}
        />
      )}
    </>
  );
};

const SingleThreadInfo = (props: { postId: number }) => {
  return (
    <div className="mt-6 border-t border-neutral-700 p-4 pb-0">
      <div>You are viewing a single thread.</div>
      <StyledLink href={`/post/${props.postId}`} className="flex items-center">
        View all comments <ArrowRightIcon className="h-4" />
      </StyledLink>
    </div>
  );
};

const NoComments = () => {
  return (
    <div className="mt-4 border-t border-neutral-700 pl-2 pt-4 text-neutral-400">
      No comments yet!
    </div>
  );
};
