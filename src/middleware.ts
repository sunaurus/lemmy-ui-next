import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  // TODO: Remove these once there is a reliable workaround for next/image using inline styles (see @/app/(ui)/Image.tsx)
  const nextImageStyleHashes = `'unsafe-hashes' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk=' 'sha256-ZDrxqUOB4m/L0JWL/+gS52g1CRH0l/qwMhjTw5Z/Fsc=' 'sha256-hviaKDxYhtiZD+bQBHVEytAzlGZ4afiWmKzkG+0beN8=' 'sha256-n8J8gRN8i9TcT9YXl0FTO+YR7t53ht5jak0CbXJTtOY=' 'sha256-vKQ+CrZTjQhoA/wfOzKCljUqGdbT8Nrhx3SZw3JJKqw='`;
  const cspHeader = `
    default-src 'self';
    ${process.env.NODE_ENV !== "development" ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic';` : "script-src 'self' 'unsafe-inline' 'unsafe-eval';"} 
    style-src 'self' 'nonce-${nonce}' ${nextImageStyleHashes};
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src *;
    img-src * blob: data:;
    media-src *;
    ${process.env.NODE_ENV !== "development" ? "block-all-mixed-content; upgrade-insecure-requests;" : ""} 
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!next/api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
