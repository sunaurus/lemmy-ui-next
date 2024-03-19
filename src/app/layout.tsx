import type { Metadata, Viewport } from "next";
import { apiClient } from "@/app/apiClient";

// These styles apply to every route in the application
import "./globals.css";
import { Navbar } from "@/app/Navbar";

export async function generateMetadata(): Promise<Metadata> {
  const site = await apiClient.getSite();

  return {
    title: site.site_view.site.name,
    description: site.site_view.site.description,
  };
}

export const viewport: Viewport = {
  themeColor: "#171717",
};

type Props = {
  children: React.ReactNode;
};
export default function RootLayout(props: Props) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="bg-[#1f1f1f] overflow-x-hidden">
        <Navbar />
        <main className="w-full min-h-[calc(100vh_-_48px)] text-[#e4e4e4] overflow-x-hidden">
          {props.children}
        </main>
      </body>
    </html>
  );
}
