import {
  ChatBubbleBottomCenterTextIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { Post, PostView } from "lemmy-js-client";
import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";
import Image from "next/image";
import Link from "next/link";
import {
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
} from "@heroicons/react/16/solid";
import { CommunityLink } from "@/app/c/CommunityLink";
import { UserLink } from "@/app/u/UserLink";
import { VoteButtons } from "@/app/(ui)/vote/VoteButtons";
import { FormattedTimestamp } from "@/app/(ui)/FormattedTimestamp";
import { StyledLink } from "@/app/(ui)/StyledLink";

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
};

export const PostListItem = (props: Props) => {
  return (
    <div className="mx-auto flex gap-y-2 rounded py-1 pl-0 lg:py-2 text-neutral-300 items-start">
      <div className="flex items-center">
        <VoteButtons postView={props.postView} />
        <Thumbnail post={props.postView.post} />
      </div>
      <div>
        <Title post={props.postView.post} />
        <PostDetails
          postView={props.postView}
          hideCommunityName={props.hideCommunityName}
        />
        <PostActions postView={props.postView} />
      </div>
    </div>
  );
};

type TitleProps = { post: Post };

const Title = (props: TitleProps) => {
  return (
    <header>
      <h1>
        <StyledLink
          href={props.post.url ?? `/post/${props.post.id}`}
          className="text-neutral-300 visited:text-neutral-400 lg:text-xl font-bold"
        >
          {props.post.name}
        </StyledLink>
      </h1>
    </header>
  );
};

const PostDetails = (props: Props) => {
  return (
    <div className="text-gray-100 text-xs lg:text-sm flex flex-wrap gap-1">
      <div className="flex items-center gap-1">
        posted <FormattedTimestamp timeString={props.postView.post.published} />{" "}
      </div>
      <div className="flex items-center gap-1">
        by <UserLink person={props.postView.creator} />
      </div>
      {props.hideCommunityName ? (
        ""
      ) : (
        <div className="flex items-center gap-1">
          in <CommunityLink community={props.postView.community} />
        </div>
      )}
    </div>
  );
};

const PostActions = (props: Props) => {
  const commentCount = props.postView.counts.comments;
  return (
    <div className="text-xs mt-1 flex items-center gap-4">
      <StyledLink
        href={`/post/${props.postView.post.id}`}
        className="flex text-neutral-300 visited:text-neutral-400 items-center"
      >
        <ChatBubbleLeftRightIcon className="h-4 mr-1" />
        {formatCompactNumber.format(commentCount)}
      </StyledLink>
      <StyledLink
        href={props.postView.post.ap_id}
        className="flex text-neutral-300 visited:text-neutral-400 items-center"
      >
        <GlobeAltIcon className="h-4" />
      </StyledLink>
      <StyledLink
        href={"#"}
        className="flex text-neutral-300 visited:text-neutral-400 items-center"
      >
        <BookmarkIcon className="h-4" />
      </StyledLink>
    </div>
  );
};

type ThumbnailProps = {
  post: Post;
};

const Thumbnail = (props: ThumbnailProps) => {
  return (
    <Link href={props.post.url ?? `/post/${props.post.id}`}>
      <div className="rounded ml-1 bg-neutral-600 h-[70px] w-[70px] min-h-[70px] min-w-[70px] relative mr-3 flex items-center justify-center">
        {props.post.thumbnail_url ? (
          <Image
            className="rounded object-cover"
            src={props.post.thumbnail_url}
            alt="Thumbnail"
            fill={true}
            sizes="70px"
          />
        ) : props.post.url ? (
          <LinkIcon className="h-8 text-neutral-900" />
        ) : (
          <ChatBubbleBottomCenterTextIcon className="h-8 text-neutral-900" />
        )}
      </div>
    </Link>
  );
};
