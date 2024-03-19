import { CommentView } from "lemmy-js-client";
import { VoteActions } from "@/app/_ui/VoteActions";
import { UserLink } from "@/app/u/UserLink";
import { Markdown } from "@/app/_ui/Markdown";
import { FormattedTimestamp } from "@/app/_ui/FormattedTimestamp";

export const Comment = (props: {
  commentView: CommentView;
  isCollapsed: boolean;
  setCollapsed(input: boolean): void;
}) => {
  return (
    <div className="mt-2 mr-2 flex items-start">
      {props.isCollapsed ? <div className="w-9" /> : <VoteActions />}
      <div>
        <div className={"text-xs flex items-center flex-wrap"}>
          <div className="flex items-center">
            <div
              className="hover:text-slate-400 hover:cursor-pointer mr-2 text-nowrap"
              onClick={() => props.setCollapsed(!props.isCollapsed)}
            >
              [ {props.isCollapsed ? "+" : "-"} ]
            </div>
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
        {!props.isCollapsed && (
          <div className="max-w-[840px] overflow-x-scroll">
            <Markdown content={props.commentView.comment.content} />
            <div className="text-xs font-semibold cursor-pointer">
              permalink embed save report reply
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
