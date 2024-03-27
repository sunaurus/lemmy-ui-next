"use client";

import { StyledLink } from "@/app/(ui)/StyledLink";
import { usePathname, useSearchParams } from "next/navigation";
import classNames from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

export const Pagination = (props: {
  prevPage?: string | number;
  nextPage?: string | number;
  className?: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let nextPageLink = null;

  if (props.nextPage) {
    const nextPageParams = new URLSearchParams(searchParams.toString());
    nextPageParams.set("page", String(props.nextPage));
    nextPageLink = (
      <StyledLink
        href={`${pathname}?${nextPageParams.toString()}`}
        className={classNames(
          "flex items-center gap-1 text-xs",
          props.className,
        )}
      >
        Next page <ChevronRightIcon className="h-4" />
      </StyledLink>
    );
  }

  let prevPageLink = null;

  if (props.prevPage) {
    const prevPageParams = new URLSearchParams(searchParams.toString());
    prevPageParams.set("page", String(props.prevPage));
    prevPageLink = (
      <StyledLink
        href={`${pathname}?${prevPageParams.toString()}`}
        className={classNames(
          "flex items-center gap-1 text-xs",
          props.className,
        )}
      >
        <ChevronLeftIcon className="h-4" />
        Previous page
      </StyledLink>
    );
  }

  return (
    <div className={"mt-4 flex w-full justify-center gap-6"}>
      {prevPageLink}
      {nextPageLink}
    </div>
  );
};
