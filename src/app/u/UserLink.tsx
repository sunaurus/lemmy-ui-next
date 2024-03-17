import Link from "next/link";
import Image from "next/image";
import { Person } from "lemmy-js-client";
import { formatPersonUsername } from "@/app/u/formatPersonUsername";

type Props = {
  person: Person;
};

export const UserLink = (props: Props) => {
  const creatorName = formatPersonUsername(props.person);
  return (
    <Link
      className="text-slate-400 hover:text-slate-300 flex gap-1 items-center"
      href={`/u/${props.person.name}@${new URL(props.person.actor_id).host}`}
    >
      <Image
        src={props.person.avatar ?? "/lemmy-icon-96x96.webp"}
        alt={`Author's avatar`}
        height={20}
        width={20}
        className="rounded object-cover max-h-[20px] max-w-[20px]"
      />
      {creatorName}
    </Link>
  );
};
