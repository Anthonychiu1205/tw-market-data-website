import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_TC } from "next/font/google";

import { SiteShell } from "@/src/components/layout/site-shell";
import { siteConfig } from "@/src/config/site";

import "./globals.css";

const sans = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "TW Market Data Platform | 台股資料基礎設施",
    template: "%s | TW Market Data Platform",
  },
  description: siteConfig.description,
  openGraph: {
    title: "TW Market Data Platform",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "TW Market Data Platform",
    locale: "zh_TW",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
