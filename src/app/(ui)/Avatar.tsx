"use client";

import { Image } from "@/app/(ui)/Image";
import classNames from "classnames";
import { memo, useState } from "react";

export const Avatar = memo(
  (props: { avatarSrc?: string; size: "mini" | "regular" }) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isImageError, setIsImageError] = useState(false);

    const showFallback = isImageError || isImageLoading || !props.avatarSrc;
    if (showFallback) {
    }

    return (
      <div
        className={classNames("relative", {
          "h-[20px] w-[20px]": props.size === "mini",
          "h-[100px] w-[100px]": props.size === "regular",
        })}
      >
        {props.avatarSrc && (
          <Image
            className={classNames("rounded object-cover", {
              invisible: isImageLoading || isImageError,
            })}
            alt="Avatar"
            fill={true}
            src={props.avatarSrc}
            placeholder={"empty"}
            sizes={props.size === "mini" ? "20px" : "100px"}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageError(true)}
          />
        )}
        {showFallback && (
          <Image
            className={classNames("rounded object-cover")}
            alt="Avatar"
            fill={true}
            priority={true}
            src={"/lemmy-icon-96x96.webp"}
            placeholder={"empty"}
            sizes={props.size === "mini" ? "20px" : "100px"}
          />
        )}
      </div>
    );
  },
  (prevProps, newProps) => prevProps.avatarSrc === newProps.avatarSrc,
);

Avatar.displayName = "Avatar";
