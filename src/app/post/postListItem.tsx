import {
  ChatBubbleBottomCenterTextIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { Post, PostView } from "lemmy-js-client";
import { formatDistanceToNowStrict } from "date-fns";
import { formatCompactNumber } from "@/utils/formatCompactNumber";
import Image from "next/image";
import Link from "next/link";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/16/solid";
import { CommunityLink } from "@/app/c/CommunityLink";
import { UserLink } from "@/app/u/UserLink";
import { VoteActions } from "@/app/_ui/VoteActions";

type Props = {
  postView: PostView;
  hideCommunityName?: boolean;
};

export const PostListItem = (props: Props) => {
  return (
    <article className="mx-auto flex gap-y-2 rounded p-2 text-neutral-300 items-center">
      <VoteActions score={props.postView.counts.score} />
      <Thumbnail post={props.postView.post} />
      <div>
        <Title post={props.postView.post} />
        <PostDetails
          postView={props.postView}
          hideCommunityName={props.hideCommunityName}
        />
        <PostActions postView={props.postView} />
      </div>
    </article>
  );
};

type TitleProps = { post: Post };

const Title = (props: TitleProps) => {
  return (
    <header>
      <h1>
        <Link
          href={props.post.url ?? `/post/${props.post.id}`}
          className="hover:text-neutral-100 visited:text-neutral-400 text-xl font-bold"
        >
          {props.post.name}
        </Link>
      </h1>
    </header>
  );
};

const PostDetails = (props: Props) => {
  const postTime = formatDistanceToNowStrict(
    new Date(props.postView.post.published),
    {
      addSuffix: true,
    },
  );

  return (
    <div className="text-gray-100 text-sm flex flex-wrap gap-1">
      posted {postTime} by <UserLink person={props.postView.creator} />
      {props.hideCommunityName ? (
        ""
      ) : (
        <>
          in <CommunityLink community={props.postView.community} />
        </>
      )}
    </div>
  );
};

const PostActions = (props: Props) => {
  const commentCount = props.postView.counts.comments;
  return (
    <div className="text-xs mt-1">
      <Link
        href={`/post/${props.postView.post.id}`}
        className="flex text-neutral-400 hover:text-slate-300 items-center"
      >
        <ChatBubbleLeftRightIcon className="h-4 mr-1" />
        {formatCompactNumber.format(commentCount)}
      </Link>
    </div>
  );
};

type ThumbnailProps = {
  post: Post;
};

const Thumbnail = (props: ThumbnailProps) => {
  return (
    <Link href={props.post.url ?? `/post/${props.post.id}`}>
      <div className="rounded bg-neutral-600 h-[70px] w-[70px] min-h-[70px] min-w-[70px] relative mr-3 flex items-center justify-center">
        {props.post.thumbnail_url ? (
          <Image
            className="rounded object-cover"
            src={props.post.thumbnail_url}
            alt="Thumbnail"
            fill
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
