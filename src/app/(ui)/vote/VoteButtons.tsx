"use client";

import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";
import classNames from "classnames";
import { CommentView, PostView } from "lemmy-js-client";
import { voteCommentAction, votePostAction } from "@/app/(ui)/vote/voteActions";

type BaseProps = {
  className?: string;
};

type CommentProps = BaseProps & { commentView: CommentView };
type PostProps = BaseProps & { postView: PostView };

type Props = CommentProps | PostProps;
export const VoteButtons = (props: Props) => {
  const totalScore = isComment(props) ? undefined : props.postView.counts.score; // We only show score between vote buttons for posts, not comments
  const userScore = isComment(props)
    ? props.commentView.my_vote
    : props.postView.my_vote;

  const upvoteResultScore = (userScore ?? 0) <= 0 ? 1 : 0;
  console.log("A", { upvoteResultScore, userScore });
  const downvoteResultScore = (userScore ?? 0) >= 0 ? -1 : 0;

  return (
    <div
      className={classNames(
        "text-xs flex-col w-8 items-center justify-center content-center",
        props.className,
      )}
    >
      <form
        action={
          isComment(props)
            ? voteCommentAction.bind(
                null,
                props.commentView.post.id,
                props.commentView.comment.id,
                upvoteResultScore,
              )
            : votePostAction.bind(
                null,
                props.postView.post.id,
                upvoteResultScore,
              )
        }
      >
        <button type="submit">
          <ArrowUpIcon
            className={classNames(
              "h-5 w-8 hover:brightness-125 cursor-pointer",
              {
                "text-neutral-300 hover:text-indigo-400": userScore !== 1,
                "text-indigo-400": userScore === 1,
              },
            )}
          />
        </button>
      </form>
      {totalScore !== undefined && (
        <div className="text-center w-8 font-semibold">
          {formatCompactNumber.format(totalScore)}
        </div>
      )}
      <form
        action={
          isComment(props)
            ? voteCommentAction.bind(
                null,
                props.commentView.post.id,
                props.commentView.comment.id,
                downvoteResultScore,
              )
            : votePostAction.bind(
                null,
                props.postView.post.id,
                downvoteResultScore,
              )
        }
      >
        <button type="submit">
          <ArrowDownIcon
            className={classNames(
              "h-5 w-8 hover:brightness-125 cursor-pointer",
              {
                "text-neutral-300 hover:text-rose-400": userScore !== -1,
                "text-rose-400": userScore === -1,
              },
            )}
          />
        </button>
      </form>
    </div>
  );
};

const isComment = (props: Props): props is CommentProps => {
  return (props as CommentProps).commentView !== undefined;
};
