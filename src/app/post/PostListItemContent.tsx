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
import React, { Dispatch, SetStateAction, useState } from "react";
import { RemoteImageProps } from "@/app/(utils)/getRemoteImageProps";
import { EditIndicator } from "@/app/(ui)/EditIndicator";
import { VoteConfig } from "@/app/(ui)/vote/getVoteConfig";
import { InlineExpandedMedia } from "@/app/(ui)/InlineExpandableMedia";

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
  loggedInUser?: MyUserInfo;
  remoteImageProps?: Promise<RemoteImageProps>;
  voteConfig: VoteConfig;
  siteView: SiteView;
};

export const PostListItemContent = (props: Props) => {
  const [inlineExpanded, setInlineExpanded] = useState(
    props.loggedInUser?.local_user_view.local_user.auto_expand ?? false,
  );

  return (
    <div key={props.postView.post.id} className="my-1">
      <div className="mr-auto flex py-1 gap-1.5 pl-0 lg:py-2 items-start">
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
      {hasExpandableMedia(props.postView.post) && (
        <InlineExpandedMedia
          className={"my-3 mx-2 lg:mx-4 max-w-[880px]"}
          embed={
            isImage(props.postView.post.url) || isVideo(props.postView.post.url)
              ? { url: props.postView.post.url }
              : {
                  iframeUrl: props.postView.post.embed_video_url!,
                  title: props.postView.post.embed_title,
                }
          }
          isExpanded={inlineExpanded}
          remoteImageProps={props.remoteImageProps}
          localSiteDomain={props.siteView.site.name}
        />
      )}
    </div>
  );
};

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
        className={"flex sm:hidden float-right mt-1 mr-2"}
        loggedInUser={props.loggedInUser}
        setInlineExpanded={props.setInlineExpanded}
      />
      <h1 className="">
        <StyledLink
          href={props.post.url ?? `/post/${props.post.id}`}
          className={classNames(
            "text-neutral-300 visited:text-neutral-400 text-xl font-bold",
            { "text-slate-400": props.post.featured_community },
          )}
        >
          {props.post.featured_community && (
            <BellAlertIcon
              className={"h-4 inline mr-1 mb-0.5 text-slate-400"}
              title={"Pined in community"}
            />
          )}
          {props.post.featured_local && (
            <BellAlertIcon
              className={"h-4 inline mr-1 mb-0.5 text-neutral-200"}
              title={"Pinned in instance"}
            />
          )}
          {props.post.name}
          {props.post.url && (
            <span className="text-xs text-neutral-400 font-normal ml-2">
              ({new URL(props.post.url).host})
            </span>
          )}

          {props.post.locked && (
            <LockClosedIcon
              title="Post locked"
              className={"h-4 inline ml-1 mb-1 text-rose-500"}
            />
          )}
          {(props.post.deleted || props.post.removed) && (
            <TrashIcon
              title={`Post ${props.post.removed ? "removed by mod" : "deleted by creator"}`}
              className={"h-4 inline ml-1 mb-1 text-rose-500"}
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
    <div className="text-gray-100 text-xs flex flex-wrap gap-1">
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
    <div className="text-[12px]/snug font-semibold mt-1 flex items-center gap-2">
      {props.postView.post.nsfw && (
        <span
          className={
            "inline text-[12px]/snug text-rose-500 border border-rose-500 rounded px-1"
          }
        >
          NSFW
        </span>
      )}
      <StyledLink
        href={`/post/${props.postView.post.id}`}
        className="flex text-neutral-300 items-center"
      >
        <ChatBubbleLeftRightIcon className="h-4 mr-1" title="View comments" />
        {formatCompactNumber(commentCount)} comments
      </StyledLink>
      <StyledLink
        href={props.postView.post.ap_id}
        className="flex text-neutral-300 items-center"
      >
        share
      </StyledLink>
      <StyledLink href={"#"} className="flex text-neutral-300 items-center">
        save
      </StyledLink>
      <StyledLink href={"#"} className="flex text-neutral-300 items-center">
        hide
      </StyledLink>
      <StyledLink href={"#"} className="flex text-neutral-300 items-center">
        report
      </StyledLink>
    </div>
  );
};
