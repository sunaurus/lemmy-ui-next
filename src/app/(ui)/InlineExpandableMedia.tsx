"use client";

import { RemoteImageProps } from "@/app/(utils)/getRemoteImageProps";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { isImage } from "@/app/(utils)/isImage";
import { Image } from "@/app/(ui)/Image";
import {
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/16/solid";
import { isVideo } from "@/app/(utils)/isVideo";

type IframeEmbed = { iframeUrl: string; title?: string };
type UrlEmbed = { url: string; alt?: string };
type Embed = IframeEmbed | UrlEmbed;
export const InlineExpandedMedia = (props: {
  embed: Embed;
  isExpanded: boolean;
  remoteImageProps?: Promise<RemoteImageProps>;
  localSiteDomain: string;
  className?: string;
}) => {
  const [remoteImageProps, setRemoteImageProps] =
    useState<RemoteImageProps | null>(null);

  const [isImageError, setIsImageError] = useState(false);

  const [temporaryAllowUnproxied, setTemporaryAllowUnproxied] = useState(false);
  const [alwaysAllowUnproxied, setAlwaysAllowUnproxied] = useLocalStorage(
    "alwaysAllowUnproxied",
    false,
  );

  useEffect(() => {
    props.remoteImageProps?.then((res) => setRemoteImageProps(res));
  }, [props.remoteImageProps]);

  if (!props.isExpanded) {
    return null;
  }

  const allowUnproxied = alwaysAllowUnproxied || temporaryAllowUnproxied;
  const canProxy =
    !isIframe(props.embed) &&
    isImage(props.embed.url) &&
    !remoteImageProps?.unoptimized;

  const host = isIframe(props.embed)
    ? new URL(props.embed.iframeUrl).host
    : new URL(props.embed.url).host;
  const isHostedLocally =
    !isIframe(props.embed) && props.localSiteDomain === host;

  let content = null;

  if (isIframe(props.embed)) {
    content = (
      <iframe
        allowFullScreen
        src={props.embed.iframeUrl}
        title={props.embed.title}
        className="w-full aspect-video"
        sandbox="allow-scripts allow-same-origin"
        allow="autoplay 'none'"
      ></iframe>
    );
  } else {
    if (isVideo(props.embed.url)) {
      content = (
        <video controls className="w-full">
          <source src={props.embed.url} type="video/mp4" />
        </video>
      );
    } else {
      if (!remoteImageProps) {
        return null;
      }

      if (isImageError) {
        content = (
          <div className="text-xs text-rose-400 mb-1 ml-6">
            Failed to load image
          </div>
        );
      } else {
        content = (
          <>
            <Image
              className="m-0"
              alt={props.embed.alt ?? "Embedded image"}
              onError={() => setIsImageError(true)}
              {...remoteImageProps}
            />
          </>
        );
      }
    }
  }

  return (
    <div className={props.className}>
      {!canProxy && !allowUnproxied ? (
        <div className="mt-1">
          <div className="text-xs text-rose-400 mb-1">
            Unable to proxy content from {host}, click below to try and load it
            directly (remote server will see your IP!)
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className="rounded bg-neutral-600 p-2 text-xs hover:bg-neutral-500 flex items-center gap-1"
              onClick={() => setTemporaryAllowUnproxied(true)}
            >
              <ArrowPathIcon className="h-4" /> Reload without proxy
            </button>
            <button
              className="rounded bg-neutral-600 p-2 text-xs hover:bg-neutral-500 flex items-center gap-1"
              onClick={() => setAlwaysAllowUnproxied(true)}
            >
              <ExclamationTriangleIcon className="h-4" /> Always automatically
              reload without proxy
            </button>
          </div>
        </div>
      ) : (
        <>
          {!isHostedLocally && (
            <div className="text-[9px] text-neutral-400 flex items-center flex-wrap gap-1">
              {canProxy ? (
                <>
                  <CheckIcon className={"h-[9px]"} /> Your IP is hidden from{" "}
                  {host}
                </>
              ) : (
                <>
                  <ExclamationTriangleIcon className={"h-[9px]"} /> Your IP is
                  visible to {host}
                </>
              )}
            </div>
          )}

          {content}
        </>
      )}
    </div>
  );
};

const isIframe = (embed: Embed): embed is IframeEmbed => {
  return (embed as IframeEmbed).iframeUrl !== undefined;
};
