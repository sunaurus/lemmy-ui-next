import { Person } from "lemmy-js-client";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { Avatar } from "@/app/(ui)/Avatar";
import classNames from "classnames";

type Props = {
  person: Person;
  showAdminBadge?: boolean;
  showModBadge?: boolean;
  showOpBadge?: boolean;
};

export const UserLink = (props: Props) => {
  const creatorFormattedName = formatPersonUsername(props.person);
  const creatorUsername = `${props.person.name}@${new URL(props.person.actor_id).host}`;
  return (
    <StyledLink
      className="flex gap-1 items-center"
      href={`/u/${creatorUsername}`}
    >
      <Avatar avatarSrc={props.person.avatar} size={"mini"} />
      <span title={creatorUsername}>{creatorFormattedName}</span>
      {props.showAdminBadge && (
        <UserLinkBadge
          title={"Instance admin"}
          content={"A"}
          className={"border-rose-500 text-rose-500"}
        />
      )}
      {!props.showAdminBadge && props.showModBadge && (
        <UserLinkBadge
          title={"Community moderator"}
          content={"M"}
          className={"border-emerald-500 text-emerald-500"}
        />
      )}
      {props.showOpBadge && (
        <UserLinkBadge
          title={"Original poster"}
          content={"OP"}
          className={"border-indigo-400 text-indigo-400"}
        />
      )}
    </StyledLink>
  );
};

const UserLinkBadge = (props: {
  title: string;
  content: string;
  className: string;
}) => {
  return (
    <span
      title={props.title}
      className={classNames(
        "font-mono rounded border text-[10px]/snug px-1 text-center font-bold",
        props.className,
      )}
    >
      {props.content}
    </span>
  );
};
