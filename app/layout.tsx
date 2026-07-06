import type { Metadata } from "next";

import { AuthSessionProvider } from "@/src/components/providers/auth-session-provider";
import { SiteShell } from "@/src/components/layout/site-shell";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";

import "./globals.css";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TW Market Data",
  url: siteConfig.url,
  logo: getAbsoluteUrl(siteConfig.ogImagePath),
  email: siteConfig.supportEmail,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TW Market Data",
  url: siteConfig.url,
  description: "台股資料 API，為系統、量化研究與 AI agent workflow 而設計",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "TW Market Data Platform | 台股資料基礎設施",
    template: "%s | TW Market Data Platform",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TW Market Data Platform",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "TW Market Data Platform",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: getAbsoluteUrl(siteConfig.ogImagePath),
        width: 1200,
        height: 630,
        alt: "TW Market Data",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TW Market Data Platform",
    description: siteConfig.description,
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
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
    <html lang="zh-Hant">
      <body className="min-h-screen font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <AuthSessionProvider>
          <SiteShell>{children}</SiteShell>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
