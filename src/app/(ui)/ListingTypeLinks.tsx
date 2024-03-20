import { ListingType, MyUserInfo } from "lemmy-js-client";
import { StyledLink } from "@/app/(ui)/StyledLink";
import classNames from "classnames";

type Props = {
  loggedInUser?: MyUserInfo;
  currentListingType: ListingType;
  basePath: string;
  searchParams: Record<string, string>;
};

export const ListingTypeLinks = (props: Props) => {
  let enabledListingOptions: ListingType[] = ["Local", "All"];

  if (props.loggedInUser) {
    enabledListingOptions = ["Subscribed", ...enabledListingOptions];
  }

  return (
    <div className="flex items-center gap-1 lg:gap-2 flex-wrap text-xs lg:text-sm">
      <div>Filter:</div>
      {enabledListingOptions.map((target) => {
        return (
          <ListingTypeLink
            key={target}
            path={props.basePath}
            currentListingType={props.currentListingType}
            currentSearchParams={props.searchParams}
            targetListingType={target}
          />
        );
      })}
    </div>
  );
};

const ListingTypeLink = (props: {
  path: string;
  currentSearchParams: Record<string, string>;
  currentListingType: ListingType;
  targetListingType: ListingType;
}) => {
  return (
    <StyledLink
      href={`${props.path}?${new URLSearchParams({
        ...props.currentSearchParams,
        listingType: props.targetListingType,
      }).toString()}`}
      className={classNames({
        "font-bold text-neutral-300":
          props.currentListingType === props.targetListingType,
      })}
    >
      {props.targetListingType}
    </StyledLink>
  );
};
