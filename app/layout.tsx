import type { Metadata } from "next";
import MainNav from "./components/MainNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "KickData",
  description: "วิเคราะห์บอล แฮนดิแคป สูงต่ำ ผลบอล",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <MainNav />
        {children}
      </body>
    </html>
  );
}
