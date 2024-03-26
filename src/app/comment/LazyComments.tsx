"use client";

import {
  buildCommentTreesAction,
  CommentNode,
} from "@/app/comment/commentActions";
import { CommentTree } from "@/app/comment/CommentTree";
import { useCallback, useEffect, useState } from "react";
import { VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { GetComments } from "lemmy-js-client/dist/types/GetComments";
import { useIntersectionObserver } from "usehooks-ts";

export const LazyComments = (props: {
  form: GetComments;
  voteConfig: VoteConfig;
  initialSeenThreads: Set<string>;
}) => {
  const [loadedComments, setLoadedComments] = useState<CommentNode[]>([]);
  const [seenThreads, setSeenThreads] = useState(props.initialSeenThreads);
  const [isLoading, setIsLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.5 });

  const onLoadMore = useCallback(async () => {
    setIsLoading(true);
    const commentTrees = await buildCommentTreesAction(props.form, seenThreads);

    if (commentTrees.rootNodes.length > 0) {
      setLoadedComments((prev) => [...prev, ...commentTrees.rootNodes]);
      setSeenThreads(commentTrees.seenThreads);
    } else {
      setEndReached(true);
    }
    setIsLoading(false);
  }, [props.form, seenThreads, setSeenThreads, setLoadedComments]);

  useEffect(() => {
    if (isIntersecting && !isLoading && !endReached) {
      // noinspection JSIgnoredPromiseFromCall
      onLoadMore();
    }
  }, [isIntersecting, onLoadMore, isLoading, endReached]);

  return (
    <>
      {loadedComments.map((node) => (
        <CommentTree
          key={node.commentView.comment.id}
          node={node}
          voteConfig={props.voteConfig}
        />
      ))}
      <div
        ref={ref}
        className={"text-neutral-400 mt-20 w-full flex justify-center"}
      >
        <div>{endReached && "You've reached the end of the page!"}</div>
      </div>
    </>
  );
};
