"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import process from "process";
import { apiClient } from "@/app/apiClient";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAME = "auth";

export const loginAction = async (data: FormData) => {
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

  redirect("/");
};

export const logoutAction = () => {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect("/login");
};

export type AuthData = {
  jwt: string;
  userId: string;
};

export const isLoggedIn = async (): Promise<boolean> => {
  return cookies().has(AUTH_COOKIE_NAME);
};

const setAuthCookie = (token: string) => {
  const decoded = jwt.decode(token, { json: true });

  const localUserId = decoded?.sub;

  if (!localUserId) {
    throw new Error("Invalid JWT");
  }

  const authCookieValue: AuthData = {
    jwt: token,
    userId: localUserId,
  };

  cookies().set({
    name: AUTH_COOKIE_NAME,
    value: JSON.stringify(authCookieValue),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
  });
};
export const getAuthData = async (): Promise<AuthData | null> => {
  const cookieValue = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!cookieValue) {
    return null;
  }
  return JSON.parse(cookieValue);
};
