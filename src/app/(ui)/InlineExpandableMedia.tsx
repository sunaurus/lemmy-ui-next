"use client";

import { RemoteImageProps } from "@/app/(utils)/getRemoteImageProps";
import React, { useState } from "react";
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
  remoteImageProps?: RemoteImageProps;
  localSiteDomain: string;
  className?: string;
}) => {
  const remoteImageProps = props.remoteImageProps;

  const [temporaryAllowUnproxied, setTemporaryAllowUnproxied] = useState(false);
  const [alwaysAllowUnproxied, setAlwaysAllowUnproxied] = useLocalStorage(
    "alwaysAllowUnproxied",
    false,
  );

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

  return (
    <div className={props.className}>
      {!canProxy && !allowUnproxied ? (
        <UnproxiedWarning
          host={host}
          onReloadClick={() => setTemporaryAllowUnproxied(true)}
          onAlwaysAllowClick={() => setAlwaysAllowUnproxied(true)}
        />
      ) : (
        <>
          <ProxyStatus
            host={host}
            canProxy={canProxy}
            isHostedLocally={isHostedLocally}
          />
          <Media embed={props.embed} remoteImageProps={remoteImageProps} />
        </>
      )}
    </div>
  );
};

const Media = (props: {
  embed: Embed;
  remoteImageProps?: RemoteImageProps;
}) => {
  if (isIframe(props.embed)) {
    return (
      <IframeMedia url={props.embed.iframeUrl} title={props.embed.title} />
    );
  } else if (isVideo(props.embed.url)) {
    return <VideoMedia url={props.embed.url} />;
  } else {
    // If it's not a video or an iframe, then it can only be an image
    return (
      <ImageMedia
        alt={props.embed.alt}
        remoteImageProps={props.remoteImageProps}
      />
    );
  }
};

const IframeMedia = (props: { url: string; title?: string }) => {
  return (
    <iframe
      allowFullScreen
      src={props.url}
      title={props.title}
      className="w-full aspect-video"
      sandbox="allow-scripts allow-same-origin"
      allow="autoplay 'none'"
    ></iframe>
  );
};

const VideoMedia = (props: { url: string }) => {
  return (
    <video controls className="w-full">
      <source src={props.url} type="video/mp4" />
    </video>
  );
};

const ImageMedia = (props: {
  alt?: string;
  remoteImageProps?: RemoteImageProps;
}) => {
  const [isImageError, setIsImageError] = useState(false);
  if (!props.remoteImageProps) {
    return null;
  }

  if (isImageError) {
    return <ImageLoadError />;
  } else {
    return (
      <Image
        className="m-0"
        alt={props.alt ?? "Embedded image"}
        onError={() => setIsImageError(true)}
        {...props.remoteImageProps}
      />
    );
  }
};

const ImageLoadError = () => {
  return (
    <div className="text-xs text-rose-400 mb-1 ml-6">Failed to load image</div>
  );
};

const UnproxiedWarning = (props: {
  host: string;
  onReloadClick(): void;
  onAlwaysAllowClick(): void;
}) => {
  return (
    <div className="mt-1">
      <div className="text-xs text-rose-400 mb-1">
        Unable to proxy content from {props.host}, click below to try and load
        it directly (remote server will see your IP!)
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          className="rounded bg-neutral-600 p-2 text-xs hover:bg-neutral-500 flex items-center gap-1"
          onClick={props.onReloadClick}
        >
          <ArrowPathIcon className="h-4" /> Reload without proxy
        </button>
        <button
          className="rounded bg-neutral-600 p-2 text-xs hover:bg-neutral-500 flex items-center gap-1"
          onClick={props.onAlwaysAllowClick}
        >
          <ExclamationTriangleIcon className="h-4" /> Always automatically
          reload without proxy
        </button>
      </div>
    </div>
  );
};

const ProxyStatus = (props: {
  isHostedLocally: boolean;
  canProxy: boolean;
  host: string;
}) => {
  return (
    !props.isHostedLocally && (
      <div className="text-[9px] text-neutral-400 flex items-center flex-wrap gap-1">
        {props.canProxy ? (
          <>
            <CheckIcon className={"h-[9px]"} /> Your IP is hidden from{" "}
            {props.host}
          </>
        ) : (
          <>
            <ExclamationTriangleIcon className={"h-[9px]"} /> Your IP is visible
            to {props.host}
          </>
        )}
      </div>
    )
  );
};

const isIframe = (embed: Embed): embed is IframeEmbed => {
  return (embed as IframeEmbed).iframeUrl !== undefined;
};
