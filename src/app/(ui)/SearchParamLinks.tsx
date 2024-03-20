"use client";

import { StyledLink } from "@/app/(ui)/StyledLink";
import classNames from "classnames";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  label: string;
  searchParamKey: string;
  options: string[];
  currentActiveValue?: string;
  className?: string;
};

export const SearchParamLinks = (props: Props) => {
  return (
    <div
      className={classNames(
        "flex items-center gap-1 lg:gap-2 flex-wrap text-xs lg:text-sm",
        props.className,
      )}
    >
      <div>{props.label}:</div>
      {props.options.map((target) => {
        return (
          <SearchParamLink
            key={target}
            searchParamKey={props.searchParamKey}
            currentActiveValue={props.currentActiveValue}
            targetValue={target}
          />
        );
      })}
    </div>
  );
};

const SearchParamLink = (props: {
  currentActiveValue?: string;
  targetValue: string;
  searchParamKey: string;
}) => {
  const path = usePathname();
  const searchParams = useSearchParams();

  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.set(props.searchParamKey, props.targetValue);
  newSearchParams.delete("page"); // When changing sort, filters, etc, it makes sense to reset to the first page

  return (
    <StyledLink
      href={`${path}?${newSearchParams.toString()}`}
      className={classNames({
        "font-bold text-neutral-300":
          props.currentActiveValue === props.targetValue,
      })}
    >
      {props.targetValue}
    </StyledLink>
  );
};
