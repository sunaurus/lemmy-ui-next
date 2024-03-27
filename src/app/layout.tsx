import type { Metadata, Viewport } from "next";
import { apiClient } from "@/app/apiClient";

// These styles apply to every route in the application
import "./globals.css";
import { Navbar } from "@/app/Navbar";
import { ReactNode } from "react";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { TopLoader } from "@/app/(ui)/TopLoader";
import { ThemePicker } from "@/app/ThemePicker";

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
      className="min-h-screen overflow-x-clip overscroll-x-none bg-neutral-900"
    >
      <body
        className="relative flex min-h-screen w-full flex-col overflow-x-clip bg-[#1f1f1f]
          text-neutral-300"
      >
        <TopLoader />
        <Navbar />

        <main className="mb-auto w-full">{props.children}</main>
        <Footer />
      </body>
    </html>
  );
}

const Footer = async () => {
  const site = await apiClient.getSite();

  return (
    <footer
      className="mb-1 mt-40 flex w-full flex-col content-center items-center justify-center gap-1
        text-xs text-neutral-400"
    >
      <ThemePicker />
      <div className="flex w-full flex-wrap content-center items-center justify-center gap-x-4 gap-y-1">
        <StyledLink className="text-neutral-400" href="/modlog">
          modlog
        </StyledLink>
        <StyledLink className="text-neutral-400" href="/legal">
          legal
        </StyledLink>
        <StyledLink className="text-neutral-400" href="/instances">
          instances
        </StyledLink>
        <StyledLink
          className="text-neutral-400"
          href="https://github.com/sunaurus/lemmy-ui-next"
        >
          github:sunaurus/lemmy-ui-next
        </StyledLink>
        <StyledLink className="text-neutral-400" href="https://join-lemmy.org">
          join-lemmy.org
        </StyledLink>
      </div>
      <div className="flex w-full flex-wrap content-center items-center justify-center gap-x-4 gap-y-1">
        <span>lemmy-ui-next v0.0.1</span>
        <span>lemmy v{site.version}</span>
      </div>
    </footer>
  );
};
