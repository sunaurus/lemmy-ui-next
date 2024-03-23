import { CommentView } from "lemmy-js-client";
import { VoteButtons } from "@/app/(ui)/vote/VoteButtons";
import { UserLink } from "@/app/u/UserLink";
import { Markdown } from "@/app/(ui)/Markdown";
import { FormattedTimestamp } from "@/app/(ui)/FormattedTimestamp";
import React, { ReactNode } from "react";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { TrashIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import classNames from "classnames";

export const Comment = (props: {
  commentView: CommentView;
  children?: ReactNode[]; // Child comments
  parentId?: number;
  highlight?: boolean;
  className?: string;
}) => {
  let content = <Markdown content={props.commentView.comment.content} />;

  if (props.commentView.comment.deleted || props.commentView.comment.removed) {
    content = (
      <div className="font-semibold italic text-neutral-400 text-xs m-1 flex items-center gap-1">
        <TrashIcon className={"h-3"} />
        <span className="mt-0.5">
          {props.commentView.comment.removed
            ? "Removed by mod"
            : "Deleted by creator"}
        </span>
      </div>
    );
  }

  // props.parentId is only provided if it's visible on the current page
  // If it's undefined, the comment might still have a parent, but as it's not on the page,
  // we can't scroll to it, we can only link to it
  const parentIdFromPath = getParentIdFromPath(props.commentView.comment.path);

  return (
    <div
      id={`comment-${props.commentView.comment.id}`}
      className={classNames("mr-2 flex items-start", props.className)}
    >
      <input
        type="checkbox"
        id={`comment-hide-${props.commentView.comment.id}`}
        className="absolute peer sr-only"
        defaultChecked={false}
      />
      <VoteButtons
        commentView={props.commentView}
        className="peer-checked:collapse peer-checked:max-h-0"
      />
      <div className="relative group min-w-0">
        <div className={"text-xs flex items-center flex-wrap min-w-0"}>
          <div className="flex items-center min-w-0">
            <label
              htmlFor={`comment-hide-${props.commentView.comment.id}`}
              className="hover:text-slate-400 hover:cursor-pointer mr-2 text-nowrap"
            >
              [ <span className={`hidden peer-checked:group-[]:inline`}>+</span>
              <span className={`peer-checked:group-[]:hidden`}>-</span> ]
            </label>
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
          <div className="flex items-center">
            <div className="ml-2">{props.commentView.counts.score} points</div>
            <FormattedTimestamp
              timeString={props.commentView.comment.published}
              className="ml-2"
            />
          </div>
        </div>
        <div className="peer-checked:group-[]:hidden max-w-[840px] overflow-x-hidden">
          <div
            className={classNames(" px-1", {
              "bg-neutral-700": props.highlight,
            })}
          >
            {content}
          </div>
          <div className="text-xs font-semibold mt-2 flex gap-1">
            <StyledLink
              className="text-neutral-300"
              href={`/comment/${props.commentView.comment.id}`}
            >
              permalink
            </StyledLink>
            <div>save</div>
            <div>report</div>
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
            <div>reply</div>
          </div>
        </div>
        <div className="peer-checked:group-[]:hidden">{props.children}</div>
      </div>
    </div>
  );
};

const getParentIdFromPath = (path: string): string => {
  const chain = path.split(".");
  return chain[chain.length - 2];
};
