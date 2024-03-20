import { Person } from "lemmy-js-client";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { Avatar } from "@/app/(ui)/Avatar";

type Props = {
  person: Person;
  showAdminBadge?: boolean;
  showModBadge?: boolean;
  showOpBadge?: boolean;
};

export const UserLink = (props: Props) => {
  const creatorName = formatPersonUsername(props.person);
  return (
    <StyledLink
      className="flex gap-1 items-center"
      href={`/u/${props.person.name}@${new URL(props.person.actor_id).host}`}
    >
      <Avatar avatarSrc={props.person.avatar} size={"mini"} />
      {creatorName}
      {props.showAdminBadge && (
        <span
          title="Instance admin"
          className={
            "rounded border-rose-500 border text-rose-500 text-xs/snug min-w-5 text-center font-bold"
          }
        >
          A
        </span>
      )}
      {!props.showAdminBadge && props.showModBadge && (
        <span
          title="Community moderator"
          className={
            "rounded border-emerald-500 border text-emerald-500 text-xs/snug min-w-5  text-center font-bold"
          }
        >
          M
        </span>
      )}
      {props.showOpBadge && (
        <span
          title="Original poster"
          className={
            "rounded border-slate-500 border text-indigo-400 text-xs/snug min-w-5 px-0.5 text-center font-bold"
          }
        >
          OP
        </span>
      )}
    </StyledLink>
  );
};
