"use server";

import { apiClient } from "@/app/apiClient";
import Image from "next/image";
import Link from "next/link";
import { isLoggedIn } from "@/app/login/auth";

export const Navbar = async () => {
  const { site_view: siteView } = await apiClient.getSite();

  return (
    <nav className="bg-neutral-900 shadow-lg text-neutral-300 p-2 pr-12 flex items-center">
      <Link href={"/"} className="flex items-center mr-2">
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
      <Link
        href={"/communities"}
        className="ml-8 mr-auto hover:text-neutral-200"
      >
        Communities
      </Link>
      <UserMenu />
    </nav>
  );
};

const UserMenu = async () => {
  if (await isLoggedIn()) {
    // const unreadCount = await apiClient.getUnreadCount();
    const { my_user: myUser } = await apiClient.getSite();

    if (myUser) {
      return (
        <Link href={"/settings"}>{myUser.local_user_view.person.name}</Link>
      );
    }
  }

  return <Link href={"/login"}>Log in</Link>;
};
