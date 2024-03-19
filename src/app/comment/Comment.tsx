import { CommentView } from "lemmy-js-client";
import { VoteActions } from "@/app/_ui/VoteActions";
import { UserLink } from "@/app/u/UserLink";
import { Markdown } from "@/app/_ui/Markdown";
import { FormattedTimestamp } from "@/app/_ui/FormattedTimestamp";
import React, { ReactNode } from "react";
import { StyledLink } from "@/app/_ui/StyledLink";

export const Comment = (props: {
  commentView: CommentView;
  children: ReactNode[]; // Child comments
}) => {
  return (
    <div className="mr-2 flex items-start">
      <input
        type="checkbox"
        id={`comment-hide-${props.commentView.comment.id}`}
        className="absolute peer sr-only"
        defaultChecked={false}
      />
      <VoteActions className="peer-checked:collapse peer-checked:max-h-0" />
      <div className="relative group">
        <div className={"text-xs flex items-center flex-wrap"}>
          <div className="flex items-center">
            <label
              htmlFor={`comment-hide-${props.commentView.comment.id}`}
              className="hover:text-slate-400 hover:cursor-pointer mr-2 text-nowrap"
            >
              [ <span className={`hidden peer-checked:group-[]:inline`}>+</span>
              <span className={`peer-checked:group-[]:hidden`}>-</span> ]
            </label>
            <UserLink person={props.commentView.creator} />
          </div>
          <div className="flex items-center">
            <div className="ml-2">{props.commentView.counts.score} points</div>
            <FormattedTimestamp
              timeString={props.commentView.comment.published}
              className="ml-2"
            />
          </div>
        </div>
        <div className="peer-checked:group-[]:hidden max-w-[840px] overflow-x-clip">
          <Markdown content={props.commentView.comment.content} />
          <div className="text-xs font-semibold mt-2 flex gap-1">
            <StyledLink
              className="text-neutral-300"
              href={`/comment/${props.commentView.comment.id}`}
            >
              permalink
            </StyledLink>
            <div>embed</div>
            <div>save</div>
            <div>report</div>
            <div>reply</div>
          </div>
        </div>
        <div className="peer-checked:group-[]:hidden">{props.children}</div>
      </div>
    </div>
  );
};
