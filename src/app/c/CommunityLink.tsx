import { Community } from "lemmy-js-client";
import { formatCommunityName } from "@/app/c/formatCommunityName";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { AgeIcon } from "@/app/(ui)/AgeIcon";
import { Avatar } from "@/app/(ui)/Avatar";
import { memo } from "react";

type Props = {
  community: Community;
};
export const CommunityLink = memo(
  (props: Props) => {
    const communityName = formatCommunityName(props.community);
    return (
      <StyledLink
        className="flex items-center gap-1"
        href={`/c/${communityName}`}
      >
        <AgeIcon type={"community"} published={props.community.published} />
        <Avatar size={"mini"} avatarSrc={props.community.icon} />
        {communityName}
      </StyledLink>
    );
  },
  (prevProps, newProps) => prevProps.community.id === newProps.community.id,
);

CommunityLink.displayName = "CommunityLink";
