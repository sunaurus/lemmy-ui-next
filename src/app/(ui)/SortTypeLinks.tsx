"use client";

import { StyledLink } from "@/app/(ui)/StyledLink";
import classNames from "classnames";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  enabledSortOptions: string[];
  currentSortType: string;
  className?: string;
};

export const SortTypeLinks = (props: Props) => {
  return (
    <div
      className={classNames(
        "flex items-center gap-1 lg:gap-2 flex-wrap text-xs lg:text-sm",
        props.className,
      )}
    >
      <div>Sort:</div>
      {props.enabledSortOptions.map((target) => {
        return (
          <SortTypeLink
            key={target}
            currentSortType={props.currentSortType}
            targetSortType={target}
          />
        );
      })}
    </div>
  );
};

const SortTypeLink = (props: {
  currentSortType: string;
  targetSortType: string;
}) => {
  const path = usePathname();
  const searchParams = useSearchParams();

  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.set("sortType", props.targetSortType);

  return (
    <StyledLink
      href={`${path}?${newSearchParams.toString()}`}
      className={classNames({
        "font-bold text-neutral-300":
          props.currentSortType === props.targetSortType,
      })}
    >
      {props.targetSortType}
    </StyledLink>
  );
};
