"use server";

import { apiClient } from "@/app/apiClient";
import { Image } from "@/app/(ui)/Image";
import Link from "next/link";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { Avatar } from "@/app/(ui)/Avatar";
import classNames from "classnames";
import { NavbarCollapsibleLinks } from "@/app/NavbarCollapsibleLinks";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { LoggedInUserIcons } from "@/app/u/LoggedInUserIcons";
import { getUnreadCounts } from "@/app/settings/loggedInUserActions";

export const Navbar = async () => {
  const { site_view: siteView, my_user: loggedInUser } =
    await apiClient.getSite();

  const navbarClassName =
    "bg-neutral-900 shadow-lg text-neutral-300 py-2 px-4 pr-4 flex items-center gap-2 h-11";

  let unreadCounts = undefined;
  if (loggedInUser) {
    unreadCounts = await getUnreadCounts(
      loggedInUser.local_user_view.local_user.admin,
      loggedInUser.moderates.length > 0,
      siteView.local_site.registration_mode === "RequireApplication",
    );
  }

  return (
    <>
      <nav className={navbarClassName}>
        <Link href={"/"} className="mr-auto flex items-center lg:mr-6">
          {siteView.site.icon && (
            <Image
              src={siteView.site.icon}
              alt={`${siteView.site.name} logo`}
              width={32}
              height={32}
              priority={true}
              className="mr-1"
            />
          )}
          <h1 className="text-lg font-semibold hover:text-neutral-200">
            {siteView.site.name}
          </h1>
        </Link>
        <span className="hidden items-center gap-2 lg:flex">
          <NavbarCollapsibleLinks
            siteView={siteView}
            loggedInUser={loggedInUser}
          />
        </span>
        <span className="ml-auto flex items-center gap-2">
          <StyledLink className="text-neutral-300" href={"/search"}>
            <MagnifyingGlassIcon className="h-4" />
          </StyledLink>
          {loggedInUser && (
            <LoggedInUserIcons
              loggedInUser={loggedInUser}
              applicationsRequired={
                siteView.local_site.registration_mode === "RequireApplication"
              }
              initialCounts={unreadCounts}
            />
          )}
          {loggedInUser ? (
            <StyledLink
              className="flex items-center gap-1 text-neutral-200"
              href={"/settings"}
            >
              <Avatar
                avatarSrc={loggedInUser.local_user_view.person.avatar}
                size={"mini"}
              />
              {loggedInUser.local_user_view.person.name}
            </StyledLink>
          ) : (
            <StyledLink className="text-neutral-200" href={"/login"}>
              Log in
            </StyledLink>
          )}
        </span>
      </nav>
      <nav className={classNames(navbarClassName, "lg:hidden")}>
        <NavbarCollapsibleLinks
          siteView={siteView}
          loggedInUser={loggedInUser}
        />
      </nav>
    </>
  );
};
