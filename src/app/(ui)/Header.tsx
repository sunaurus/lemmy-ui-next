import Image from "next/image";
import { getRemoteImageProps } from "@/app/(utils)/getRemoteImageProps";
import { CommunityView, PersonView } from "lemmy-js-client";
import classNames from "classnames";
import { Avatar } from "@/app/(ui)/Avatar";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { CakeDayIcon } from "@/app/u/CakeDayIcon";
import { FormattedTimestamp } from "@/app/(ui)/FormattedTimestamp";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";
import { UsernameBadge } from "@/app/u/UsernameBadge";

export const Header = async (props: { view: CommunityView | PersonView }) => {
  const bannerSrc = isPerson(props.view)
    ? props.view.person.banner
    : props.view.community.banner;

  return (
    <header className="mx-1 lg:mx-4 relative min-h-[110px]">
      {bannerSrc && <Banner src={bannerSrc} />}

      <Summary view={props.view} addBackground={!!bannerSrc} />
    </header>
  );
};

export const Banner = async (props: { src: string }) => {
  const remoteImageProps = await getRemoteImageProps(props.src, 1000);

  return (
    <Image
      className={" rounded"}
      alt={"Community banner"}
      {...remoteImageProps}
    />
  );
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
    ? formatPersonUsername(props.view.person)
    : `!${formatCommunityName(props.view.community)}`;

  return (
    <div
      className={classNames("flex items-end gap-2 sm:absolute max-w-full", {
        "sm:bottom-0 sm:bg-neutral-900 sm:rounded-bl sm:rounded-tr p-2 sm:bg-opacity-90 ":
          props.addBackground,
      })}
    >
      <Avatar avatarSrc={avatarSrc} size="regular" />

      <div className="mx-2 max-w-full">
        <h1 className="text-2xl flex items-center gap-1 max-w-full break-words">
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
        <div className="text-sm flex items-center gap-1 text-neutral-400">
          <CakeDayIcon
            tooltip={isPerson(props.view) ? undefined : "Community cakeday!"}
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
      </div>
    </div>
  );
};

const isPerson = (input: PersonView | CommunityView): input is PersonView => {
  return (input as PersonView).person !== undefined;
};
