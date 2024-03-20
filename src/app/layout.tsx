import type { Metadata, Viewport } from "next";
import { apiClient } from "@/app/apiClient";

// These styles apply to every route in the application
import "./globals.css";
import { Navbar } from "@/app/Navbar";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { StyledLink } from "@/app/(ui)/StyledLink";

export async function generateMetadata(): Promise<Metadata> {
  const site = await apiClient.getSite();

  return {
    title: site.site_view.site.name,
    description: site.site_view.site.description,
  };
}

// noinspection JSUnusedGlobalSymbols
export const viewport: Viewport = {
  themeColor: "#171717",
};

type Props = {
  children: ReactNode;
};
export default function RootLayout(props: Props) {
  return (
    <html lang="en" className="h-full w-full overscroll-x-none">
      <body className="w-full bg-[#1f1f1f] overflow-x-hidden relative flex flex-col h-full">
        <Navbar />
        <NextTopLoader
          color="#94a3b8"
          showSpinner={false}
          shadow={"0 0 10px #94a3b8,0 0 5px #94a3b8"}
        />
        <main className="w-full  text-slate-300 overflow-x-clip">
          {props.children}
        </main>
        <footer className="h-11 mt-auto p-2 text-slate-300 flex items-center content-center justify-center w-full gap-4">
          <StyledLink
            className="text-neutral-400"
            href="https://github.com/sunaurus/lemmy-ui-next"
          >
            github:lemmy-ui-next
          </StyledLink>

          <StyledLink
            className="text-neutral-400"
            href="https://join-lemmy.org"
          >
            join-lemmy.org
          </StyledLink>
        </footer>
      </body>
    </html>
  );
}
