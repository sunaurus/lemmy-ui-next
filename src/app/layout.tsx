import type { Metadata, Viewport } from "next";
import { apiClient } from "@/app/apiClient";

// These styles apply to every route in the application
import "./globals.css";
import { Navbar } from "@/app/Navbar";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { StyledLink } from "@/app/(ui)/StyledLink";

export const generateMetadata = async (): Promise<Metadata> => {
  const site = await apiClient.getSite();

  let images: string[] = [];

  if (site.site_view.site.icon) {
    images = [site.site_view.site.icon, ...images];
  }

  if (site.site_view.site.banner) {
    images = [site.site_view.site.banner];
  }

  return {
    title: site.site_view.site.name,
    description: site.site_view.site.description,
    keywords: [
      site.site_view.site.name,
      "lemmy",
      "vote",
      "comment",
      "post",
      "threadiverse",
      "fediverse",
    ],
    openGraph: {
      title: site.site_view.site.name,
      description: site.site_view.site.description,
      siteName: site.site_view.site.name,
      images: [images[0]],
    },
    icons: {
      icon: [
        {
          url: site.site_view.site.icon ?? "/lemmy-icon-96x96.webp",
        },
      ],
      apple: [
        {
          url: site.site_view.site.icon ?? "/lemmy-icon-96x96.webp",
        },
      ],
    },
  };
};

// noinspection JSUnusedGlobalSymbols
export const viewport: Viewport = {
  themeColor: "#171717",
};

type Props = {
  children: ReactNode;
};
export default function RootLayout(props: Props) {
  return (
    <html
      lang="en"
      className="h-full w-full overscroll-x-none overflow-x-hidden bg-neutral-900"
    >
      <body className="w-full bg-[#1f1f1f] text-neutral-300 overflow-x-hidden relative flex flex-col h-full">
        <NextTopLoader
          color="#94a3b8"
          showSpinner={false}
          shadow={"0 0 10px #94a3b8,0 0 5px #94a3b8"}
        />
        <Navbar />

        <main className="w-full overflow-x-clip">{props.children}</main>
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
