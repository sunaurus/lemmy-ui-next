"use server";

import { apiClient } from "@/app/apiClient";
import Image from "next/image";
import Link from "next/link";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { AvatarMini } from "@/app/(ui)/AvatarMini";
import classNames from "classnames";
import { NavbarCollapsibleLinks } from "@/app/NavbarCollapsibleLinks";
import {
  BellAlertIcon,
  FlagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { ClipboardIcon } from "@heroicons/react/20/solid";

export const Navbar = async () => {
  const { site_view: siteView, my_user: loggedInUser } =
    await apiClient.getSite();

  const navbarClassName =
    "bg-neutral-900 shadow-lg text-neutral-300 py-2 px-4 pr-4 flex items-center gap-2 h-11";

  return (
    <>
      <nav className={navbarClassName}>
        <Link href={"/"} className="flex items-center mr-auto lg:mr-6">
          {siteView.site.icon && (
            <Image
              src={siteView.site.icon}
              alt={`${siteView.site.name} logo`}
              width={32}
              height={32}
              className="mr-1"
            />
          )}
          <h1 className="text-lg font-semibold hover:text-neutral-200">
            {siteView.site.name}
          </h1>
        </Link>
        <span className="hidden lg:flex items-center gap-2">
          <NavbarCollapsibleLinks
            siteView={siteView}
            loggedInUser={loggedInUser}
          />
        </span>
        <span className="flex items-center gap-2 ml-auto">
          <StyledLink className="text-neutral-300" href={"/search"}>
            <MagnifyingGlassIcon className="h-4" />
          </StyledLink>
          <StyledLink className="text-neutral-300" href={"/inbox"}>
            <BellAlertIcon className="h-4" />
          </StyledLink>
          {loggedInUser?.local_user_view.local_user.admin && (
            <StyledLink className="text-neutral-300" href={"/reports"}>
              <FlagIcon className="h-4" />
            </StyledLink>
          )}
          {loggedInUser?.local_user_view.local_user.admin &&
            siteView.local_site.registration_mode === "RequireApplication" && (
              <StyledLink
                className="text-neutral-300"
                href={"/registration_applications"}
              >
                <ClipboardIcon className="h-4" />
              </StyledLink>
            )}
          {loggedInUser ? (
            <StyledLink
              className="text-neutral-200 flex items-center gap-1"
              href={"/settings"}
            >
              <AvatarMini
                avatarSrc={loggedInUser.local_user_view.person.avatar}
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
