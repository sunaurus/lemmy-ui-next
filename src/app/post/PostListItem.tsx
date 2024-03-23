import { PostView } from "lemmy-js-client";
import { apiClient } from "@/app/apiClient";
import { PostListItemContent } from "@/app/post/PostListItemContent";

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
  autoExpandMedia?: boolean;
};

export const PostListItem = async (props: Props) => {
  const { my_user: loggedInUser } = await apiClient.getSite();

  return (
    <PostListItemContent
      key={props.postView.post.id}
      loggedInUser={loggedInUser}
      {...props}
    />
  );
};
