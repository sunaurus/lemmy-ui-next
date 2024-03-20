import "server-only"; // All Lemmy API calls must be done on the server
import { LemmyHttp } from "lemmy-js-client";
import { getJwtFromAuthCookie } from "@/app/login/auth";
import { headers } from "next/headers";

const baseUrl = process.env.LEMMY_BACKEND;

if (!baseUrl) {
  console.warn("Ensure LEMMY_BACKEND environment variable is set!");
}

const fetchWithNextConfig = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const additionalHeaders: Record<string, string> = {};
  const jwt = await getJwtFromAuthCookie();

  if (jwt) {
    additionalHeaders["authorization"] = `Bearer ${jwt}`;
  }

  const incomingHeaders = headers();

  const forwardedFor = incomingHeaders.get("x-forwarded-for");
  if (forwardedFor) {
    additionalHeaders["x-forwarded-for"] = forwardedFor;
  }
  const realIp = incomingHeaders.get("x-real-ip");

  if (realIp) {
    additionalHeaders["x-real-ip"] = realIp;
  }

  return fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      ...additionalHeaders,
    },
    next: {
      // Cache API responses for 15 seconds for logged out users
      revalidate: jwt !== null ? 0 : 15,
    },
  });
};

export const apiClient = new LemmyHttp(baseUrl ?? "", {
  fetchFunction: fetchWithNextConfig,
});
