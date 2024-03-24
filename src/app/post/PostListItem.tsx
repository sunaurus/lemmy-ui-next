import { PostView } from "lemmy-js-client";
import { apiClient } from "@/app/apiClient";
import { PostListItemContent } from "@/app/post/PostListItemContent";
import { getRemoteImageProps } from "@/app/(utils)/getRemoteImageProps";
import { isImage } from "@/app/(utils)/isImage";

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
  autoExpandMedia?: boolean;
};

export const PostListItem = async (props: Props) => {
  const { my_user: loggedInUser } = await apiClient.getSite();

  // noinspection ES6MissingAwait
  const remoteImageProps = isImage(props.postView.post.url)
    ? getRemoteImageProps(props.postView.post.url, 880)
    : undefined;
  return (
    <PostListItemContent
      key={props.postView.post.id}
      loggedInUser={loggedInUser}
      remoteImageProps={remoteImageProps}
      {...props}
    />
  );
};
