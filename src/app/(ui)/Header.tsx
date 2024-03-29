import { Image } from "@/app/(ui)/Image";
import { getRemoteImageProps } from "@/app/(utils)/getRemoteImageProps";
import { CommunityView, PersonView } from "lemmy-js-client";
import classNames from "classnames";
import { Avatar } from "@/app/(ui)/Avatar";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { AgeIcon } from "@/app/(ui)/AgeIcon";
import { FormattedTimestamp } from "@/app/(ui)/FormattedTimestamp";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";
import { UsernameBadge } from "@/app/u/UsernameBadge";
import { formatCompactNumber } from "@/app/(utils)/formatCompactNumber";

export const Header = async (props: { view: CommunityView | PersonView }) => {
  const bannerSrc = isPerson(props.view)
    ? props.view.person.banner
    : props.view.community.banner;

  return (
    <header className="relative mx-1 min-h-[110px] lg:mx-4">
      {bannerSrc && (
        <Banner
          src={bannerSrc}
          alt={isPerson(props.view) ? "User's banner" : "Community banner"}
        />
      )}

      <Summary view={props.view} addBackground={!!bannerSrc} />
    </header>
  );
};

export const Banner = async (props: { src: string; alt: string }) => {
  const remoteImageProps = await getRemoteImageProps(props.src, 1000);

  return <Image className={" rounded"} alt={props.alt} {...remoteImageProps} />;
};

const Summary = (props: {
  view: CommunityView | PersonView;
  addBackground: boolean;
}) => {
  const avatarSrc = isPerson(props.view)
    ? props.view.person.avatar
    : props.view.community.icon;
  const displayName = isPerson(props.view)
    ? props.view.person.display_name ?? props.view.person.name
    : props.view.community.title ?? props.view.community.name;

  const canonicalName = isPerson(props.view)
    ? formatPersonUsername(props.view.person, true)
    : `!${formatCommunityName(props.view.community)}`;

  return (
    <div
      className={classNames("flex max-w-full items-end gap-2 sm:absolute", {
        [`py-2 sm:bottom-0 sm:rounded-bl sm:rounded-tr sm:bg-neutral-900 sm:bg-opacity-90
        sm:p-2`]: props.addBackground,
      })}
    >
      <Avatar avatarSrc={avatarSrc} size="regular" />

      <div className="mx-2 max-w-full">
        <h1 className="flex max-w-full items-center gap-1 break-words text-2xl">
          {displayName}
          {isPerson(props.view) && props.view.is_admin && (
            <UsernameBadge
              title={"Instance admin"}
              content={"A"}
              className={"mt-1.5 border-rose-500 text-rose-500"}
            />
          )}
          {isPerson(props.view) && props.view.person.bot_account && (
            <UsernameBadge
              title={"Bot account"}
              content={"B"}
              className={"mt-1.5 border-amber-500 text-amber-500"}
            />
          )}
        </h1>
        <div className="text-md max-w-full break-words">{canonicalName}</div>
        <div className="flex items-center gap-1 text-sm text-neutral-400">
          <AgeIcon
            type={isPerson(props.view) ? "person" : "community"}
            published={
              isPerson(props.view)
                ? props.view.person.published
                : props.view.community.published
            }
          />
          {isPerson(props.view) ? "Joined" : "Established"}
          <FormattedTimestamp
            timeString={
              isPerson(props.view)
                ? props.view.person.published
                : props.view.community.published
            }
          />
        </div>
        <div className="flex items-center gap-1 text-sm text-neutral-400">
          {isPerson(props.view) ? (
            <div>
              {formatCompactNumber(props.view.counts.post_count)} posts •{" "}
              {formatCompactNumber(props.view.counts.comment_count)} comments
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

const isPerson = (input: PersonView | CommunityView): input is PersonView => {
  return (input as PersonView).person !== undefined;
};
