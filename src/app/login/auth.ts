"use server";

import { cookies } from "next/headers";
import process from "process";
import { apiClient } from "@/app/apiClient";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAME = "session";

export const loginAction = async (
  redirectUrl: string | undefined,
  data: FormData,
) => {
  const username = data.get("username")?.toString();
  const password = data.get("password")?.toString();
  const twofactor = data.get("twofactor")?.toString();

  if (!username || !password) {
    throw new Error("Missing username or password");
  }

  const loginResponse = await apiClient.login({
    username_or_email: username,
    password: password,
    totp_2fa_token: twofactor,
  });

  if (!loginResponse.jwt) {
    throw new Error("Authentication failed");
  }

  setAuthCookie(loginResponse.jwt);

  redirect(redirectUrl ?? "/");
};

export const logoutAction = async () => {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect("/login");
};

export const loginPageWithRedirectAction = async (redirectUrl: string) => {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
};

export type AuthData = {
  jwt: string;
  userId: string;
};

export const isLoggedIn = async (): Promise<boolean> => {
  return cookies().has(AUTH_COOKIE_NAME);
};

const setAuthCookie = (token: string) => {
  const oneMonthMillis = 30 * 24 * 60 * 60 * 1000;

  cookies().set({
    name: AUTH_COOKIE_NAME,
    value: token,
    expires: Date.now() + oneMonthMillis,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
};
export const getJwtFromAuthCookie = async (): Promise<string | null> => {
  return cookies().get(AUTH_COOKIE_NAME)?.value ?? null;
};
