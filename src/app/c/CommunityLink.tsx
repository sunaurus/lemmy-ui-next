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
      <div className="w-[20px] h-[20px] relative">
        <Image
          src={props.community.icon ?? "/lemmy-icon-96x96.webp"}
          alt={`Community icon`}
          fill={true}
          sizes={"20px"}
          className="rounded object-cover"
        />
      </div>
      {communityName}
    </Link>
  );
};
