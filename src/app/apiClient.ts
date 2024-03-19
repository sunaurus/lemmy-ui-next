import { LemmyHttp } from "lemmy-js-client";
import { getAuthData } from "@/app/login/auth";
import "server-only"; // All API calls must be done on the server

const baseUrl = process.env.LEMMY_BACKEND;

if (!baseUrl) {
  console.warn("Ensure LEMMY_BACKEND environment variable is set!");
}

const fetchWithNextConfig = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const additionalHeaders: Record<string, string> = {};
  const authData = await getAuthData();

  if (authData) {
    additionalHeaders["Authorization"] = `Bearer ${authData.jwt}`;
  }

  return fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      ...additionalHeaders,
    },
    next: {
      // Cache API responses for 60 seconds for logged out users
      revalidate: 60,
    },
  });
};

export const apiClient = new LemmyHttp(baseUrl ?? "", {
  fetchFunction: fetchWithNextConfig,
});
