import { SortType } from "lemmy-js-client";
import { StyledLink } from "@/app/(ui)/StyledLink";
import classNames from "classnames";

type Props = {
  enabledSortOptions: SortType[];
  currentSortType: SortType;
  basePath: string;
  searchParams: Record<string, string>;
};

export const SortTypeLinks = (props: Props) => {
  return (
    <div className="m-1 lg:ml-4 flex items-center gap-1 lg:gap-2 flex-wrap text-xs lg:text-sm">
      <div>Sort:</div>
      {props.enabledSortOptions.map((target) => {
        return (
          <SortTypeLink
            key={target}
            path={props.basePath}
            currentSortType={props.currentSortType}
            currentSearchParams={props.searchParams}
            targetSortType={target}
          />
        );
      })}
    </div>
  );
};

const SortTypeLink = (props: {
  path: string;
  currentSearchParams: Record<string, string>;
  currentSortType: SortType;
  targetSortType: SortType;
}) => {
  return (
    <StyledLink
      href={`${props.path}?${new URLSearchParams({
        ...props.currentSearchParams,
        sortType: props.targetSortType,
      }).toString()}`}
      className={classNames({
        "font-bold text-neutral-300":
          props.currentSortType === props.targetSortType,
      })}
    >
      {props.targetSortType}
    </StyledLink>
  );
};
