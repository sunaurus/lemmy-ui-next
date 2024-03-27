"use client";

import { CommentView, MyUserInfo } from "lemmy-js-client";
import { VoteButtons } from "@/app/(ui)/vote/VoteButtons";
import { UserLink } from "@/app/u/UserLink";
import { FormattedTimestamp } from "@/app/(ui)/FormattedTimestamp";
import React, { useState } from "react";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { TrashIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import classNames from "classnames";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { EditIndicator } from "@/app/(ui)/EditIndicator";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { Markdown, MarkdownProps } from "@/app/(ui)/markdown/Markdown";
import { CommentEditor } from "@/app/comment/CommentEditor";
import {
  CommentNode,
  deleteCommentAction,
  restoreCommentAction,
} from "@/app/comment/commentActions";
import { LazyChildComments } from "@/app/comment/LazyChildComments";
import { CommentTree } from "@/app/comment/CommentTree";

export const Comment = (props: {
  commentView: CommentView;
  loggedInUser?: MyUserInfo;
  parentId?: number;
  highlight?: boolean;
  className?: string;
  addPostLink?: boolean;
  voteConfig: VoteConfig;
  markdown: MarkdownProps;
  /**
   * Only needed when rendering comment trees, no need to pass for flat comment lists
   */
  node?: CommentNode;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(props.commentView.comment.deleted);
  const [addedReplies, setAddedReplies] = useState<CommentNode[]>([]);

  const markdownProps =
    editedContent !== null ? { content: editedContent } : props.markdown;
  let body = <Markdown {...markdownProps} />;

  if (deleted || props.commentView.comment.removed) {
    body = (
      <div className="m-1 flex items-center gap-1 text-xs font-semibold italic text-neutral-400">
        <TrashIcon className={"h-3"} />
        <span className="mt-0.5">
          {props.commentView.comment.removed
            ? "Removed by mod"
            : "Deleted by creator"}
        </span>
      </div>
    );
  }

  if (isEditing) {
    body = (
      <CommentEditor
        className={"w-full"}
        commentId={props.commentView.comment.id}
        initialContent={editedContent ?? props.commentView.comment.content}
        onCancel={() => setIsEditing(false)}
        onSubmit={(newContent: string) => {
          setIsEditing(false);
          setEditedContent(newContent);
        }}
      />
    );
  }

  // props.parentId is only provided if it's visible on the current page
  // If it's undefined, the comment might still have a parent, but as it's not on the page,
  // we can't scroll to it, we can only link to it
  const parentIdFromPath = getParentIdFromPath(props.commentView.comment.path);

  const isOwnComment =
    props.commentView.comment.creator_id ===
    props.loggedInUser?.local_user_view.person.id;

  return (
    <div
      id={`comment-${props.commentView.comment.id}`}
      className={classNames("mr-2 flex items-start", props.className)}
    >
      <input
        type="checkbox"
        id={`comment-hide-${props.commentView.comment.id}`}
        className="peer sr-only absolute"
        defaultChecked={false}
      />
      <VoteButtons
        voteConfig={props.voteConfig}
        commentView={props.commentView}
        className="peer-checked:collapse peer-checked:max-h-0"
      />
      <div className="group relative min-w-0">
        <div className={"flex min-w-0 flex-wrap items-center gap-2 text-xs"}>
          <div className="flex min-w-0 items-center">
            <label
              htmlFor={`comment-hide-${props.commentView.comment.id}`}
              className="hover:text-primary-400 mr-2 text-nowrap hover:cursor-pointer"
            >
              [ <span className={"hidden peer-checked:group-[]:inline"}>+</span>
              <span className={"peer-checked:group-[]:hidden"}>-</span> ]
            </label>
            {props.commentView.comment.distinguished && (
              <ShieldExclamationIcon
                className="mr-1 h-5 text-amber-500"
                title={"Mod comment"}
              />
            )}
            <UserLink
              person={props.commentView.creator}
              showAdminBadge={props.commentView.creator_is_admin}
              showModBadge={props.commentView.creator_is_moderator}
              showOpBadge={
                props.commentView.post.creator_id ===
                props.commentView.comment.creator_id
              }
              showBotBadge={props.commentView.creator.bot_account}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {props.voteConfig.scoresVisible && (
              <div className="">
                {props.commentView.counts.score}{" "}
                {props.commentView.counts.score === 1 ? "point" : "points"}
              </div>
            )}
            <FormattedTimestamp
              timeString={props.commentView.comment.published}
              className=""
            />
            <EditIndicator editTime={props.commentView.comment.updated} />
            {props.addPostLink && (
              <div className="flex flex-wrap items-center gap-1">
                in{" "}
                <StyledLink href={`/c/${props.commentView.community.id}`}>
                  {formatCommunityName(props.commentView.community)}
                </StyledLink>
                •
                <StyledLink href={`/post/${props.commentView.post.id}`}>
                  {props.commentView.post.name}
                </StyledLink>
              </div>
            )}
          </div>
        </div>
        <div className="max-w-[840px] overflow-x-hidden peer-checked:group-[]:hidden">
          <div
            className={classNames(" px-1", {
              "bg-neutral-700": props.highlight && !isEditing,
            })}
          >
            {body}
          </div>
          <div className="mt-2 flex gap-1 text-xs font-semibold">
            <StyledLink
              className="text-neutral-300"
              href={`/comment/${props.commentView.comment.id}`}
            >
              permalink
            </StyledLink>
            <div className="cursor-pointer hover:brightness-125">save</div>
            <div className="cursor-pointer hover:brightness-125">report</div>
            {props.parentId && (
              <a
                className="text-neutral-300 hover:brightness-125"
                href={`#comment-${props.parentId}`}
              >
                parent
              </a>
            )}
            {!props.parentId && parentIdFromPath !== "0" && (
              <Link
                href={`/comment/${parentIdFromPath}`}
                className="text-neutral-300 hover:brightness-125"
              >
                parent
              </Link>
            )}
            <div
              className="cursor-pointer hover:brightness-125"
              onClick={() => setIsReplying(true)}
            >
              reply
            </div>
            {isOwnComment && (
              <div
                className="cursor-pointer hover:brightness-125"
                onClick={() => setIsEditing(true)}
              >
                edit
              </div>
            )}
            {isOwnComment && (
              <form
                action={async () => {
                  const action = deleted
                    ? restoreCommentAction.bind(
                        null,
                        props.commentView.comment.id,
                      )
                    : deleteCommentAction.bind(
                        null,
                        props.commentView.comment.id,
                      );
                  await action();
                  setDeleted((prev) => !prev);
                }}
              >
                <button
                  className="cursor-pointer hover:brightness-125"
                  type="submit"
                >
                  {deleted ? "restore" : "delete"}
                </button>
              </form>
            )}
          </div>
        </div>
        {isReplying && (
          <CommentEditor
            postId={props.commentView.post.id}
            parentId={props.commentView.comment.id}
            onCancel={() => setIsReplying(false)}
            onSubmit={(newComment: CommentView) => {
              setIsReplying(false);
              setAddedReplies((prev) => [
                {
                  parent: {
                    parent: null,
                    children: [],
                    commentView: props.commentView,
                    markdown: props.markdown,
                  },
                  children: [],
                  commentView: newComment,
                  markdown: { content: newComment.comment.content },
                },
                ...prev,
              ]);
            }}
          />
        )}
        {addedReplies.map((node) => (
          <div
            key={node.commentView.comment.id}
            className="peer-checked:group-[]:hidden"
          >
            <CommentTree
              key={node.commentView.comment.id}
              node={node}
              voteConfig={props.voteConfig}
              loggedInUser={props.loggedInUser}
            />
          </div>
        ))}
        {props.node && (
          <div className="peer-checked:group-[]:hidden">
            {props.node.children.map((node) => (
              <CommentTree
                key={node.commentView.comment.id}
                node={node}
                voteConfig={props.voteConfig}
                loggedInUser={props.loggedInUser}
              />
            ))}
            <LazyChildComments
              loggedInUser={props.loggedInUser}
              node={props.node}
              voteConfig={props.voteConfig}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const getParentIdFromPath = (path: string): string => {
  const chain = path.split(".");
  return chain[chain.length - 2];
};
