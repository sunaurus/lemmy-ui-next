"use client";

import { ListingType, MyUserInfo, SiteView, SortType } from "lemmy-js-client";
import { usePathname, useSearchParams } from "next/navigation";
import { StyledLink } from "@/app/(ui)/StyledLink";
import classNames from "classnames";
import { ReactNode } from "react";
import { getActiveSortAndListingType } from "@/app/post/getActiveSortAndListingType";

export const NavbarCollapsibleLinks = ({
  siteView,
  loggedInUser,
}: {
  siteView: SiteView;
  loggedInUser: MyUserInfo | undefined;
}) => {
  const path = usePathname();
  const searchParams = useSearchParams();

  const activeSortAndListingType = getActiveSortAndListingType(
    siteView,
    loggedInUser,
    {
      listingType:
        (searchParams.get("listingType") as ListingType) ?? undefined,
      sortType: (searchParams.get("sortType") as SortType) ?? undefined,
    },
  );

  return (
    <>
      {loggedInUser && (
        <NavbarLink
          href={"/?listingType=Subscribed"}
          active={
            path === "/" &&
            activeSortAndListingType.listingType === "Subscribed"
          }
        >
          Subscribed
        </NavbarLink>
      )}
      <NavbarLink
        href={"/?listingType=Local"}
        active={
          path === "/" && activeSortAndListingType.listingType === "Local"
        }
      >
        Local
      </NavbarLink>
      <NavbarLink
        href={"/?listingType=All"}
        active={path === "/" && activeSortAndListingType.listingType === "All"}
      >
        All
      </NavbarLink>
      {loggedInUser && loggedInUser.moderates.length > 0 && (
        <NavbarLink
          href={"/?listingType=ModeratorView"}
          active={
            path === "/" &&
            activeSortAndListingType.listingType === "ModeratorView"
          }
        >
          Mod
        </NavbarLink>
      )}
      <NavbarLink
        href={"/communities"}
        className="lg:ml-6 mr-8 ml-2"
        active={path === "/communities"}
      >
        Communities
      </NavbarLink>
    </>
  );
};

const NavbarLink = (props: {
  href: string;
  className?: string;
  active: boolean;
  children: ReactNode;
}) => {
  return (
    <StyledLink
      href={props.href}
      className={classNames(props.className, "text-neutral-300", {
        "font-bold text-neutral-200": props.active,
      })}
    >
      {props.children}
    </StyledLink>
  );
};
