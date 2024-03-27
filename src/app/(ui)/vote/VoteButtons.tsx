"use client";

import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";
import classNames from "classnames";
import { CommentView, PostView } from "lemmy-js-client";
import { voteCommentAction, votePostAction } from "@/app/(ui)/vote/voteActions";
import { VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { memo, useOptimistic } from "react";

type BaseProps = {
  className?: string;
  voteConfig: VoteConfig;
};

type CommentProps = BaseProps & { commentView: CommentView };
type PostProps = BaseProps & { postView: PostView };

type Props = CommentProps | PostProps;
export const VoteButtons = memo(
  (props: Props) => {
    const totalScore = getScore(props);
    const userScore = isComment(props)
      ? props.commentView.my_vote
      : props.postView.my_vote;

    const [{ optimisticUserScore, optimisticScore }, setOptimisticUserScore] =
      useOptimistic(
        { optimisticUserScore: userScore, optimisticScore: totalScore },
        (prevState, newUserScore: number) => {
          let newScore = prevState.optimisticScore;
          if (newScore) {
            newScore =
              newScore - (prevState.optimisticUserScore ?? 0) + newUserScore;
          }

          return {
            optimisticUserScore: newUserScore,
            optimisticScore: newScore,
          };
        },
      );

    const upvoteResultScore = (optimisticUserScore ?? 0) <= 0 ? 1 : 0;
    const downvoteResultScore = (optimisticUserScore ?? 0) >= 0 ? -1 : 0;

    return (
      <div
        className={classNames(
          "w-8 flex-col content-center items-center justify-center text-xs",
          props.className,
        )}
      >
        <form
          action={async () => {
            setOptimisticUserScore(upvoteResultScore);

            const action = isComment(props)
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
                );
            await action();
          }}
        >
          <button type="submit">
            <ArrowUpIcon
              className={classNames(
                "h-5 w-8 cursor-pointer hover:brightness-125",
                {
                  "text-neutral-300 hover:text-indigo-400":
                    optimisticUserScore !== 1,
                  "text-indigo-400": optimisticUserScore === 1,
                },
              )}
            />
          </button>
        </form>
        {optimisticScore !== undefined && props.voteConfig.scoresVisible && (
          <div className="mb-0.5 w-8 text-center font-semibold">
            {formatCompactNumber(optimisticScore)}
          </div>
        )}
        {props.voteConfig.downvotesEnabled && (
          <form
            action={async () => {
              setOptimisticUserScore(downvoteResultScore);
              const action = isComment(props)
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
                  );
              await action();
            }}
          >
            <button type="submit">
              <ArrowDownIcon
                className={classNames(
                  "h-5 w-8 cursor-pointer hover:brightness-125",
                  {
                    "text-neutral-300 hover:text-rose-400":
                      optimisticUserScore !== -1,
                    "text-rose-400": optimisticUserScore === -1,
                  },
                )}
              />
            </button>
          </form>
        )}
      </div>
    );
  },
  (prevProps, newProps) =>
    prevProps.voteConfig.scoresVisible === newProps.voteConfig.scoresVisible &&
    prevProps.voteConfig.downvotesEnabled ===
      newProps.voteConfig.downvotesEnabled &&
    getScore(prevProps) === getScore(newProps),
);

VoteButtons.displayName = "VoteButtons";

const isComment = (props: Props): props is CommentProps => {
  return (props as CommentProps).commentView !== undefined;
};

const getScore = (props: Props): number | undefined =>
  isComment(props) ? undefined : props.postView.counts.score; // We only show score between vote buttons for posts, not comments
