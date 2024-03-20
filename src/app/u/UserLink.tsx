import { Person } from "lemmy-js-client";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { Avatar } from "@/app/(ui)/Avatar";

type Props = {
  person: Person;
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
    </StyledLink>
  );
};
