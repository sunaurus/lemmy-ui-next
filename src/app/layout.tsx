import type { Metadata } from "next";
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

type Props = {
  children: React.ReactNode;
};
export default function RootLayout(props: Props) {
  return (
    <html lang="en">
      <body className="bg-[#1f1f1f] overflow-x-hidden">
        <Navbar />
        <main className="w-full min-h-[calc(100vh_-_48px)] p-4 text-[#e4e4e4]">
          {props.children}
        </main>
      </body>
    </html>
  );
}
