import { Person } from "lemmy-js-client";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { AvatarMini } from "@/app/(ui)/AvatarMini";

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
      <AvatarMini avatarSrc={props.person.avatar} />
      {creatorName}
    </StyledLink>
  );
};
