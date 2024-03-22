import {
  ArrowsPointingOutIcon,
  ChatBubbleBottomCenterTextIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

import {
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { Post, PostView } from "lemmy-js-client";
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

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
  autoExpandMedia?: boolean;
};

export const PostListItem = (props: Props) => {
  return (
    <div key={props.postView.post.id} className="my-3">
      <div className="mr-auto flex py-1 gap-1.5 pl-0 lg:py-2 items-start">
        <div className="flex items-center">
          <VoteButtons postView={props.postView} />
          <Thumbnail post={props.postView.post} className={"hidden sm:flex"} />
        </div>
        <div className="w-full">
          <Title post={props.postView.post} />

          <PostDetails
            postView={props.postView}
            hideCommunityName={props.hideCommunityName}
          />
          <PostActions postView={props.postView} />
        </div>
      </div>

      <InlineExpandedMedia
        postView={props.postView}
        autoExpandMedia={props.autoExpandMedia}
      />
    </div>
  );
};

const InlineExpandedMedia = (props: Props) => {
  if (!hasExpandableMedia(props.postView.post)) {
    return null;
  }

  const url = props.postView.post.url;

  return (
    <>
      <input
        type="checkbox"
        className="peer sr-only"
        id={`toggle-${props.postView.post.id}`}
        defaultChecked={props.autoExpandMedia}
      />
      <div className="hidden peer-checked:block my-3 mx-2 lg:mx-4">
        {isImage(url) && (
          <Image
            src={url}
            alt={"Post image"}
            placeholder={`data:image/svg+xml;base64,${toBase64(ImageLoading(32, 32))}`}
            width={880}
            height={880}
            sizes={"(max-width: 880px) 100vw, 880px"}
          />
        )}
        {isVideo(url) && (
          <video controls className="w-full max-w-[880px] aspect-video">
            <source src={url} type="video/mp4" />
          </video>
        )}
        {props.postView.post.embed_video_url && (
          <iframe
            allowFullScreen
            src={props.postView.post.embed_video_url}
            title={props.postView.post.embed_title}
            className="w-full max-w-[880px] aspect-video"
          ></iframe>
        )}
      </div>
    </>
  );
};

const hasExpandableMedia = (post: Post) => {
  const url = post.url;
  return isImage(url) || isVideo(url) || post.embed_video_url;
};

type TitleProps = { post: Post };

const Title = (props: TitleProps) => {
  return (
    <header>
      <Thumbnail
        post={props.post}
        className={"flex sm:hidden float-right mt-1 mr-2"}
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

          {props.post.locked && (
            <LockClosedIcon
              title="Post locked"
              className={"h-4 inline ml-1 mb-1 text-rose-500"}
            />
          )}
          {props.post.deleted && (
            <TrashIcon
              title="Post deleted"
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

type ThumbnailProps = {
  post: Post;
  className: string;
};

const Thumbnail = (props: ThumbnailProps) => {
  return (
    <div
      className={classNames(
        "rounded ml-1 bg-neutral-600 h-[70px] w-[70px] min-h-[70px] min-w-[70px] relative flex items-center justify-center",
        props.className,
      )}
    >
      {props.post.thumbnail_url ? (
        <Image
          className="rounded object-cover"
          src={props.post.thumbnail_url}
          alt="Thumbnail"
          fill={true}
          sizes="70px"
        />
      ) : props.post.url ? (
        <LinkIcon className="h-8 text-neutral-900" />
      ) : (
        <ChatBubbleBottomCenterTextIcon className="h-8 text-neutral-900" />
      )}
      {hasExpandableMedia(props.post) && (
        <label
          htmlFor={`toggle-${props.post.id}`}
          className="cursor-pointer z-1 h-full w-full flex items-end justify-end hover:brightness-125 absolute"
        >
          {isImage(props.post.url) ? (
            <ArrowsPointingOutIcon className="h-7 bg-neutral-800 rounded" />
          ) : (
            <PlayIcon className="h-7 bg-neutral-800 rounded" />
          )}
        </label>
      )}
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
