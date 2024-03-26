import type { Metadata, Viewport } from "next";
import { apiClient } from "@/app/apiClient";

// These styles apply to every route in the application
import "./globals.css";
import { Navbar } from "@/app/Navbar";
import { ReactNode } from "react";
import { StyledLink } from "@/app/(ui)/StyledLink";
import { TopLoader } from "@/app/(ui)/TopLoader";

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
      className="min-h-screen overscroll-x-none bg-neutral-900 overflow-x-clip"
    >
      <body className="min-h-screen w-full bg-[#1f1f1f] text-neutral-300 overflow-x-clip relative flex flex-col">
        <TopLoader />
        <Navbar />

        <main className="w-full mb-auto">{props.children}</main>
        <Footer />
      </body>
    </html>
  );
}

const Footer = async () => {
  const site = await apiClient.getSite();

  return (
    <footer className="mt-40 mb-1 text-neutral-400 flex flex-col items-center content-center justify-center w-full gap-1 text-xs ">
      <div className="flex items-center content-center justify-center w-full gap-x-4 gap-y-1 flex-wrap">
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
      <div className="flex items-center content-center justify-center w-full gap-x-4 gap-y-1 flex-wrap">
        <span>lemmy-ui-next v0.0.1</span>
        <span>lemmy v{site.version}</span>
      </div>
    </footer>
  );
};
