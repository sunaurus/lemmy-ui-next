import Link from "next/link";
import Image from "next/image";
import { Community } from "lemmy-js-client";
import { formatCommunityName } from "@/app/c/formatCommunityName";

type Props = {
  community: Community;
};
export const CommunityLink = (props: Props) => {
  const communityName = formatCommunityName(props.community);
  return (
    <Link
      className="text-slate-400 hover:text-slate-300 flex gap-1 items-center"
      href={`/c/${communityName}`}
    >
      <Image
        src={props.community.icon ?? "/lemmy-icon-96x96.webp"}
        alt={`Community icon`}
        height={20}
        width={20}
        className="rounded object-cover"
      />
      {communityName}
    </Link>
  );
};
