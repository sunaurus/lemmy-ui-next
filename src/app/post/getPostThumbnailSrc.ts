import { Post } from "lemmy-js-client";
import { isImage } from "@/app/(utils)/isImage";

export const getPostThumbnailSrc = (post: Post) => {
  let src = post.thumbnail_url ?? (isImage(post.url) ? post.url : undefined);

  if (src?.includes("/pictrs/")) {
    // If image is hosted on pictrs, request it with a smaller resolution
    const srcUrl = new URL(src);
    srcUrl.searchParams.delete("thumbnail");
    srcUrl.searchParams.append("thumbnail", "280");
    src = srcUrl.toString();
  }
  return src;
};
