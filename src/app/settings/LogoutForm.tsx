"use client";

import { logoutAction } from "@/app/login/auth";

export const LogoutForm = () => {
  return (
    <form action={logoutAction}>
      <button type="submit">Log out</button>
    </form>
  );
};
