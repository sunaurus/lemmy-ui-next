import { CommentView } from "lemmy-js-client";
import { formatDistanceToNowStrict } from "date-fns";
import { VoteActions } from "@/app/_ui/VoteActions";
import { UserLink } from "@/app/u/UserLink";
import { Markdown } from "@/app/_ui/Markdown";

export const Comment = (props: {
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
    <div className="mt-2 mr-2 flex items-start">
      {props.isCollapsed ? <div className="w-10" /> : <VoteActions />}
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
            <div className="ml-2">{commentTime}</div>
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
