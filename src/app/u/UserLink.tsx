import { Person } from "lemmy-js-client";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { Avatar } from "@/app/(ui)/Avatar";
import { UsernameBadge } from "@/app/u/UsernameBadge";
import { CakeDayIcon } from "@/app/u/CakeDayIcon";

type Props = {
  person: Person;
  showAdminBadge?: boolean;
  showModBadge?: boolean;
  showOpBadge?: boolean;
  showBotBadge?: boolean;
};

export const UserLink = (props: Props) => {
  const creatorFormattedName = formatPersonUsername(props.person);
  const creatorUsername = `${props.person.name}@${new URL(props.person.actor_id).host}`;
  return (
    <StyledLink
      className="flex gap-1 items-center"
      href={`/u/${creatorUsername}`}
    >
      <CakeDayIcon person={props.person} />
      <Avatar avatarSrc={props.person.avatar} size={"mini"} />
      <span title={creatorUsername} className="min-w-0 break-words">
        {creatorFormattedName}
      </span>
      {props.showAdminBadge && (
        <UsernameBadge
          title={"Instance admin"}
          content={"A"}
          className={"border-rose-500 text-rose-500"}
        />
      )}
      {!props.showAdminBadge && props.showModBadge && (
        <UsernameBadge
          title={"Community moderator"}
          content={"M"}
          className={"border-emerald-500 text-emerald-500"}
        />
      )}
      {props.showOpBadge && (
        <UsernameBadge
          title={"Original poster"}
          content={"OP"}
          className={"border-indigo-400 text-indigo-400"}
        />
      )}
      {props.showBotBadge && (
        <UsernameBadge
          title={"Bot account"}
          content={"B"}
          className={"border-amber-500 text-amber-500"}
        />
      )}
    </StyledLink>
  );
};
