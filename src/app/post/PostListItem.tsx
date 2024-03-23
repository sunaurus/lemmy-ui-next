import { PostView } from "lemmy-js-client";
import { apiClient } from "@/app/apiClient";
import { PostListItemContent } from "@/app/post/PostListItemContent";
import { getRemoteImageProps } from "@/app/(utils)/getRemoteImageProps";
import { getPostThumbnailSrc } from "@/app/post/getPostThumbnailSrc";
import { isImage } from "@/app/(utils)/isImage";

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
  autoExpandMedia?: boolean;
};

export const PostListItem = async (props: Props) => {
  const { my_user: loggedInUser } = await apiClient.getSite();

  const postThumbnailSrc = getPostThumbnailSrc(props.postView.post);
  const remoteImageProps = {
    thumbnail: postThumbnailSrc
      ? await getRemoteImageProps(postThumbnailSrc, 70, true)
      : undefined,
    expanded: isImage(props.postView.post.url)
      ? await getRemoteImageProps(props.postView.post.url)
      : undefined,
  };

  return (
    <>
      <PostListItemContent
        key={props.postView.post.id}
        loggedInUser={loggedInUser}
        remoteImageProps={remoteImageProps}
        {...props}
      />
    </>
  );
};
