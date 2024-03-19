import type { Metadata, Viewport } from "next";
import { apiClient } from "@/app/apiClient";

// These styles apply to every route in the application
import "./globals.css";
import { Navbar } from "@/app/Navbar";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";

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
    <html lang="en" className="w-full overflow-x-hidden overscroll-x-none">
      <body className="w-full bg-[#1f1f1f] overflow-x-hidden relative">
        <Navbar />
        <NextTopLoader
          color="#94a3b8"
          showSpinner={false}
          shadow={"0 0 10px #94a3b8,0 0 5px #94a3b8"}
        />
        <main className="w-screen min-h-[calc(100vh_-_48px)] text-[#e4e4e4] overflow-x-clip">
          {props.children}
        </main>
      </body>
    </html>
  );
}
