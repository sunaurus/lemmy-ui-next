"use client";

import {
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { MyUserInfo, Post, PostView, SiteView } from "lemmy-js-client";
import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";
import { CommunityLink } from "@/app/c/CommunityLink";
import { UserLink } from "@/app/u/UserLink";
import { VoteButtons } from "@/app/(ui)/vote/VoteButtons";
import { FormattedTimestamp } from "@/app/(ui)/FormattedTimestamp";
import { StyledLink } from "@/app/(ui)/StyledLink";
import classNames from "classnames";
import { isImage } from "@/app/(utils)/isImage";
import { isVideo } from "@/app/(utils)/isVideo";
import { PostThumbnail } from "@/app/post/PostThumbnail";
import { hasExpandableMedia } from "@/app/post/hasExpandableMedia";
import React, { Dispatch, memo, SetStateAction, useEffect } from "react";
import { RemoteImageProps } from "@/app/(utils)/getRemoteImageProps";
import { EditIndicator } from "@/app/(ui)/EditIndicator";
import { VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { useSessionStorage } from "usehooks-ts";
import { InlineExpandedMedia } from "@/app/(ui)/InlineExpandedMedia";

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
  loggedInUser?: MyUserInfo;
  remoteImageProps?: Promise<RemoteImageProps>;
  voteConfig: VoteConfig;
  siteView: SiteView;
};

export const PostListItemContent = memo(
  (props: Props) => {
    const [inlineExpanded, setInlineExpanded] = useSessionStorage(
      `ie-${props.postView.post.id}`,
      props.loggedInUser?.local_user_view.local_user.auto_expand ?? false,
    );

    const [remoteImageProps, setRemoteImageProps] = useSessionStorage<
      RemoteImageProps | undefined
    >(`rip-${props.postView.post.id}`, undefined);

    useEffect(() => {
      props.remoteImageProps?.then((res) => setRemoteImageProps(res));
    }, [props.remoteImageProps, setRemoteImageProps]);

    return (
      <div key={props.postView.post.id} className="my-1">
        <div className="mr-auto flex items-start gap-1.5 py-1 pl-0 lg:py-2">
          <div className="flex items-center">
            <VoteButtons
              voteConfig={props.voteConfig}
              postView={props.postView}
              className={"mt-2 sm:mt-0"}
            />
            <PostThumbnail
              post={props.postView.post}
              className={"hidden sm:flex"}
              loggedInUser={props.loggedInUser}
              setInlineExpanded={setInlineExpanded}
            />
          </div>
          <div className="w-full">
            <Title
              post={props.postView.post}
              loggedInUser={props.loggedInUser}
              setInlineExpanded={setInlineExpanded}
            />

            <PostDetails
              postView={props.postView}
              hideCommunityName={props.hideCommunityName}
            />
            <PostActions postView={props.postView} />
          </div>
        </div>
        {hasExpandableMedia(props.postView.post) && inlineExpanded && (
          <InlineExpandedMedia
            className={"mx-2 my-3 max-w-[880px] lg:mx-4"}
            embed={
              isImage(props.postView.post.url) ||
              isVideo(props.postView.post.url)
                ? { url: props.postView.post.url }
                : isVideo(props.postView.post.embed_video_url)
                  ? { url: props.postView.post.embed_video_url }
                  : {
                      iframeUrl: props.postView.post.embed_video_url!,
                      title: props.postView.post.embed_title,
                    }
            }
            remoteImageProps={remoteImageProps}
            localSiteDomain={props.siteView.site.name}
          />
        )}
      </div>
    );
  },
  (prevProps, newProps) =>
    prevProps.postView.post.id === newProps.postView.post.id &&
    prevProps.postView.counts.comments === newProps.postView.counts.comments &&
    prevProps.postView.counts.score === newProps.postView.counts.score,
);

PostListItemContent.displayName = "PostListItemContent";

type TitleProps = {
  post: Post;
  loggedInUser?: MyUserInfo;
  setInlineExpanded: Dispatch<SetStateAction<boolean>>;
};

const Title = (props: TitleProps) => {
  return (
    <header>
      <PostThumbnail
        post={props.post}
        className={"float-right mr-2 mt-1 flex sm:hidden"}
        loggedInUser={props.loggedInUser}
        setInlineExpanded={props.setInlineExpanded}
      />
      <h1 className="">
        <StyledLink
          href={props.post.url ?? `/post/${props.post.id}`}
          className={classNames(
            "text-xl font-bold text-neutral-300 visited:text-neutral-400",
            { "text-primary-400": props.post.featured_community },
          )}
        >
          {props.post.featured_community && (
            <BellAlertIcon
              className={"text-primary-400 mb-0.5 mr-1 inline h-4"}
              title={"Pined in community"}
            />
          )}
          {props.post.featured_local && (
            <BellAlertIcon
              className={"mb-0.5 mr-1 inline h-4 text-neutral-200"}
              title={"Pinned in instance"}
            />
          )}
          {props.post.name}
          {props.post.url && (
            <span className="ml-2 text-xs font-normal text-neutral-400">
              ({new URL(props.post.url).host})
            </span>
          )}

          {props.post.locked && (
            <LockClosedIcon
              title="Post locked"
              className={"mb-1 ml-1 inline h-4 text-rose-500"}
            />
          )}
          {(props.post.deleted || props.post.removed) && (
            <TrashIcon
              title={`Post ${props.post.removed ? "removed by mod" : "deleted by creator"}`}
              className={"mb-1 ml-1 inline h-4 text-rose-500"}
            />
          )}
        </StyledLink>
      </h1>
    </header>
  );
};

const PostDetails = (props: {
  postView: PostView;
  hideCommunityName?: boolean;
}) => {
  return (
    <div className="flex flex-wrap gap-1 text-xs text-gray-100">
      <div className="flex items-center gap-1">
        posted <FormattedTimestamp timeString={props.postView.post.published} />{" "}
        <EditIndicator editTime={props.postView.post.updated} />
      </div>
      <div className="flex items-center gap-1">
        by
        <UserLink
          person={props.postView.creator}
          showAdminBadge={props.postView.creator_is_admin}
          showModBadge={props.postView.creator_is_moderator}
          showBotBadge={props.postView.creator.bot_account}
        />
      </div>
      {props.hideCommunityName ? (
        ""
      ) : (
        <div className="flex items-center gap-1">
          in <CommunityLink community={props.postView.community} />
        </div>
      )}
    </div>
  );
};

const PostActions = (props: { postView: PostView }) => {
  const commentCount = props.postView.counts.comments;
  return (
    <div className="mt-1 flex items-center gap-2 text-[12px]/snug font-semibold">
      {props.postView.post.nsfw && (
        <span
          className={
            "inline rounded border border-rose-500 px-1 text-[12px]/snug text-rose-500"
          }
        >
          NSFW
        </span>
      )}
      <StyledLink
        href={`/post/${props.postView.post.id}`}
        className="flex items-center text-neutral-300"
      >
        <ChatBubbleLeftRightIcon className="mr-1 h-4" title="View comments" />
        {formatCompactNumber(commentCount)} comments
      </StyledLink>
      <StyledLink
        href={props.postView.post.ap_id}
        className="flex items-center text-neutral-300"
      >
        share
      </StyledLink>
      <StyledLink href={"#"} className="flex items-center text-neutral-300">
        save
      </StyledLink>
      <StyledLink href={"#"} className="flex items-center text-neutral-300">
        hide
      </StyledLink>
      <StyledLink href={"#"} className="flex items-center text-neutral-300">
        report
      </StyledLink>
    </div>
  );
};
