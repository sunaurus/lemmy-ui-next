import Image from "next/image";
import { Person } from "lemmy-js-client";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";
import { StyledLink } from "@/app/_ui/StyledLink";

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
      <div className="relative h-[20px] w-[20px]">
        <Image
          src={props.person.avatar ?? "/lemmy-icon-96x96.webp"}
          alt={`Author's avatar`}
          className="rounded object-cover"
          fill={true}
          sizes="20px"
        />
      </div>
      {creatorName}
    </StyledLink>
  );
};
