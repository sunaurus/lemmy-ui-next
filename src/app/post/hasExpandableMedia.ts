import { Post } from "lemmy-js-client";
import { isImage } from "@/app/(utils)/isImage";
import { isVideo } from "@/app/(utils)/isVideo";

export const hasExpandableMedia = (post: Post) => {
  const url = post.url;
  return isImage(url) || isVideo(url) || post.embed_video_url;
};
