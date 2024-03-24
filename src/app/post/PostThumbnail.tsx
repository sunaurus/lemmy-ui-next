"use client";

import { isImage } from "@/app/(utils)/isImage";
import classNames from "classnames";
import Image from "next/image";
import {
  ArrowsPointingOutIcon,
  ChatBubbleBottomCenterTextIcon,
  LinkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/16/solid";
import { MyUserInfo, Post } from "lemmy-js-client";
import { hasExpandableMedia } from "@/app/post/hasExpandableMedia";
import { Dispatch, SetStateAction, useState } from "react";
import { getPostThumbnailSrc } from "@/app/post/getPostThumbnailSrc";

type ThumbnailProps = {
  post: Post;
  className: string;
  loggedInUser: MyUserInfo | undefined;
  setInlineExpanded: Dispatch<SetStateAction<boolean>>;
};

export const PostThumbnail = (props: ThumbnailProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isImageError, setIsImageERror] = useState(false);

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
          <Image
            className={classNames("rounded object-cover", {
              "blur-sm":
                props.post.nsfw &&
                (props.loggedInUser?.local_user_view.local_user.blur_nsfw ??
                  true),
              invisible: isImageLoading || isImageError,
            })}
            alt="Thumbnail"
            fill={true}
            src={src}
            placeholder="empty"
            sizes={"70px"}
            onLoad={() => {
              setIsImageLoading(false);
            }}
            onError={() => {
              setIsImageERror(true);
            }}
          />
          <PhotoIcon className="h-8 text-neutral-900" />
        </>
      ) : props.post.url ? (
        <LinkIcon className="h-8 text-neutral-900" />
      ) : (
        <ChatBubbleBottomCenterTextIcon className="h-8 text-neutral-900" />
      )}
      {hasExpandableMedia(props.post) && (
        <a
          className="cursor-pointer z-1 h-full w-full flex items-end justify-end hover:brightness-125 absolute"
          href={src ?? props.post.embed_video_url}
          onClick={(e) => {
            e.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
            props.setInlineExpanded((prev) => !prev);
          }}
        >
          {isImage(props.post.url) ? (
            <ArrowsPointingOutIcon className="h-7 bg-neutral-800 rounded" />
          ) : (
            <PlayIcon className="h-7 bg-neutral-800 rounded" />
          )}
        </a>
      )}
    </div>
  );
};
