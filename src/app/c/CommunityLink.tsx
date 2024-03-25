import { Image } from "@/app/(ui)/Image";
import { Community } from "lemmy-js-client";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { AgeIcon } from "@/app/(ui)/AgeIcon";

type Props = {
  community: Community;
};
export const CommunityLink = (props: Props) => {
  const communityName = formatCommunityName(props.community);
  return (
    <StyledLink
      className="flex gap-1 items-center"
      href={`/c/${communityName}`}
    >
      <AgeIcon type={"community"} published={props.community.published} />
      <div className="w-[20px] h-[20px] relative">
        <Image
          src={props.community.icon ?? "/lemmy-icon-96x96.webp"}
          alt={`Community icon`}
          priority={true}
          fill={true}
          sizes={"20px"}
          className="rounded object-cover"
        />
      </div>
      {communityName}
    </StyledLink>
  );
};
