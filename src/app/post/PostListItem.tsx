import {
  ChatBubbleBottomCenterTextIcon,
  LinkIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Post, PostView } from "lemmy-js-client";
import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";
import Image from "next/image";
import Link from "next/link";
import {
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/16/solid";
import { CommunityLink } from "@/app/c/CommunityLink";
import { UserLink } from "@/app/u/UserLink";
import { VoteButtons } from "@/app/(ui)/vote/VoteButtons";
import { FormattedTimestamp } from "@/app/(ui)/FormattedTimestamp";
import { StyledLink } from "@/app/(ui)/StyledLink";
import classNames from "classnames";

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
};

export const PostListItem = (props: Props) => {
  return (
    <div className="mr-auto flex gap-y-2 rounded py-1 pl-0 lg:py-2 text-neutral-300 items-start">
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
          className={classNames(
            "text-neutral-300 visited:text-neutral-400 lg:text-xl font-bold",
            { "text-slate-400": props.post.featured_community },
          )}
        >
          {props.post.featured_community && (
            <BellAlertIcon
              className={"h-4 inline mr-1 mb-0.5 text-slate-400"}
              title={"Pined in community"}
            />
          )}
          {props.post.featured_local && (
            <BellAlertIcon
              className={"h-4 inline mr-1 mb-0.5 text-neutral-200"}
              title={"Pinned in instance"}
            />
          )}
          {props.post.name}
          {props.post.locked && (
            <LockClosedIcon className={"h-4 inline ml-1 mb-1 text-rose-500"} />
          )}
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
        by
        <UserLink
          person={props.postView.creator}
          showAdminBadge={props.postView.creator_is_admin}
          showModBadge={props.postView.creator_is_moderator}
        />
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
        <ChatBubbleLeftRightIcon className="h-4 mr-1" title="View comments" />
        {formatCompactNumber(commentCount)}
      </StyledLink>
      <StyledLink
        href={props.postView.post.ap_id}
        className="flex text-neutral-300 visited:text-neutral-400 items-center"
      >
        <GlobeAltIcon className="h-4" title="View on original instance" />
      </StyledLink>
      <StyledLink
        href={"#"}
        className="flex text-neutral-300 visited:text-neutral-400 items-center"
      >
        <StarIcon className="h-4" title="Save post" />
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
