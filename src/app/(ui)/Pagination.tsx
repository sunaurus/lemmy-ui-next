"use client";

import { StyledLink } from "@/app/(ui)/StyledLink";
import { usePathname, useSearchParams } from "next/navigation";
import classNames from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

export const Pagination = (props: {
  prevPage?: string;
  nextPage?: string;
  className?: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let nextPageLink = null;

  if (props.nextPage) {
    const nextPageParams = new URLSearchParams(searchParams.toString());
    nextPageParams.set("page", props.nextPage);
    nextPageLink = (
      <StyledLink
        href={`${pathname}?${nextPageParams.toString()}`}
        className={classNames(
          "text-xs flex items-center gap-1",
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
    prevPageParams.set("page", props.prevPage);
    prevPageLink = (
      <StyledLink
        href={`${pathname}?${prevPageParams.toString()}`}
        className={classNames(
          "text-xs flex items-center gap-1",
          props.className,
        )}
      >
        <ChevronLeftIcon className="h-4" />
        Previous page
      </StyledLink>
    );
  }

  return (
    <div className={"w-full flex gap-6 justify-center mt-4"}>
      {prevPageLink}
      {nextPageLink}
    </div>
  );
};
