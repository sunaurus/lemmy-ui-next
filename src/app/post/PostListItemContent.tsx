"use client";

import {
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { MyUserInfo, Post, PostView } from "lemmy-js-client";
import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";
import Image from "next/image";
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
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
  loggedInUser?: MyUserInfo;
};

export const PostListItemContent = (props: Props) => {
  const [inlineExpanded, setInlineExpanded] = useState(
    props.loggedInUser?.local_user_view.local_user.auto_expand ?? false,
  );

  return (
    <div key={props.postView.post.id} className="my-3">
      <div className="mr-auto flex py-1 gap-1.5 pl-0 lg:py-2 items-start">
        <div className="flex items-center">
          <VoteButtons postView={props.postView} />
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

      <InlineExpandedMedia
        postView={props.postView}
        isExpanded={inlineExpanded}
      />
    </div>
  );
};

const InlineExpandedMedia = (props: {
  postView: PostView;
  isExpanded: boolean;
}) => {
  if (!hasExpandableMedia(props.postView.post)) {
    return null;
  }

  if (!props.isExpanded) {
    return null;
  }

  const url = props.postView.post.url;

  let proxied = false;
  let content = null;

  if (isImage(url)) {
    if (new URL(url).host !== "i.imgur.com") {
      // Only mark non-imgur images as proxied
      // We can't proxy imgur images due to aggressive rate limits on imgur
      proxied = true;
    }

    content = (
      <>
        {!proxied && (
          <div className="text-[9px] text-neutral-400 mb-1">
            Unable to proxy imgur (remote server sees your IP address when
            expanding)
          </div>
        )}
        <Image
          src={url}
          alt={"Post image"}
          placeholder={`data:image/svg+xml;base64,${toBase64(ImageLoading(32, 32))}`}
          width={880}
          height={880}
          unoptimized={!proxied}
          sizes={"(max-width: 880px) 100vw, 880px"}
        />
      </>
    );
  } else if (isVideo(url) || isVideo(props.postView.post.embed_video_url)) {
    content = (
      <>
        <div className="text-[9px] text-neutral-400 mb-1">
          Unable to proxy videos (remote server sees your IP address when
          expanding)
        </div>
        <video controls className="w-full max-w-[880px] aspect-video">
          <source
            src={url ?? props.postView.post.embed_video_url}
            type="video/mp4"
          />
        </video>
      </>
    );
  } else if (!isVideo(props.postView.post.embed_video_url)) {
    content = (
      <>
        <div className="text-[9px] text-neutral-400 mb-1">
          Unable to proxy videos (remote server sees your IP address when
          expanding)
        </div>
        <iframe
          allowFullScreen
          src={props.postView.post.embed_video_url}
          title={props.postView.post.embed_title}
          className="w-full max-w-[880px] aspect-video"
        ></iframe>
      </>
    );
  }
  return <div className="my-3 mx-2 lg:mx-4">{content}</div>;
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

const PostDetails = (props: Props) => {
  return (
    <div className="text-gray-100 text-xs flex flex-wrap gap-1">
      <div className="flex items-center gap-1">
        posted <FormattedTimestamp timeString={props.postView.post.published} />{" "}
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

const PostActions = (props: Props) => {
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

const ImageLoading = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
