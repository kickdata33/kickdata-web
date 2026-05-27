import type { Metadata } from "next";

import "./globals.css";

import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "KickData",
  description: "Premium football analytics membership powered by mock data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute left-[8%] top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute bottom-10 right-[6%] h-80 w-80 rounded-full bg-emerald-300/8 blur-3xl" />
          </div>
          <SiteHeader />
          <main className="relative">{children}</main>
        </div>
      </body>
    </html>
  );
}
