"use client";

import { isImage } from "@/app/(utils)/isImage";
import classNames from "classnames";
import { Image } from "@/app/(ui)/Image";
import {
  ArrowsPointingOutIcon,
  ChatBubbleBottomCenterTextIcon,
  LinkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/16/solid";
import { MyUserInfo, Post } from "lemmy-js-client";
import { hasExpandableMedia } from "@/app/post/hasExpandableMedia";
import React, { Dispatch, memo, SetStateAction, useState } from "react";
import { getPostThumbnailSrc } from "@/app/post/getPostThumbnailSrc";

type ThumbnailProps = {
  post: Post;
  className: string;
  loggedInUser: MyUserInfo | undefined;
  setInlineExpanded: Dispatch<SetStateAction<boolean>>;
};

export const PostThumbnail = memo(
  (props: ThumbnailProps) => {
    let src = getPostThumbnailSrc(props.post);

    return (
      <div
        className={classNames(
          "rounded ml-1 bg-neutral-600 h-[70px] w-[70px] min-h-[70px] min-w-[70px] relative flex items-center justify-center overflow-hidden",
          props.className,
        )}
      >
        {src ? (
          <>
            <ThumbnailImage props={props} src={src} />
            {<PhotoIcon className="h-8 text-neutral-900" />}
          </>
        ) : props.post.url ? (
          <LinkIcon className="h-8 text-neutral-900" />
        ) : (
          <ChatBubbleBottomCenterTextIcon className="h-8 text-neutral-900" />
        )}
        {hasExpandableMedia(props.post) && (
          <ExpandOverlay
            url={src ?? props.post.embed_video_url!}
            onToggleExpanded={props.setInlineExpanded}
          />
        )}
      </div>
    );
  },
  (prevProps, newProps) => prevProps.post.id === newProps.post.id,
);

PostThumbnail.displayName = "PostThumbnail";

const ThumbnailImage = memo(
  (props: {
    props: ThumbnailProps;

    src: string;
  }) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isImageError, setIsImageError] = useState(false);

    return (
      <Image
        className={classNames("rounded object-cover", {
          "blur-sm":
            props.props.post.nsfw &&
            (props.props.loggedInUser?.local_user_view.local_user.blur_nsfw ??
              true),
          invisible: isImageLoading || isImageError,
        })}
        alt="Thumbnail"
        fill={true}
        src={props.src}
        placeholder="empty"
        sizes={"70px"}
        onLoad={() => setIsImageLoading(false)}
        onError={() => setIsImageError(true)}
      />
    );
  },
  (prevProps, newProps) => prevProps.src === newProps.src,
);

ThumbnailImage.displayName = "ThumbnailImage";

function ExpandOverlay(props: {
  url: string;
  onToggleExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <a
      className="cursor-pointer z-1 h-full w-full flex items-end justify-end hover:brightness-125 absolute"
      href={props.url} // If JS is disabled, this href will still let users navigate to the content
      onClick={(e) => {
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        props.onToggleExpanded((prev) => !prev);
      }}
    >
      {isImage(props.url) ? (
        <ArrowsPointingOutIcon className="h-7 bg-neutral-800 rounded" />
      ) : (
        // Videos get a different icon
        <PlayIcon className="h-7 bg-neutral-800 rounded" />
      )}
    </a>
  );
}
