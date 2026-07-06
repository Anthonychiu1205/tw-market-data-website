import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAbsoluteUrl, siteConfig } from "@/src/config/site";

// Static, revalidated hourly — no request-time backend call.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "文件",
  description: "TW Market Data 文件入口，包含 Quick Start、API Model、資料血緣與市場覆蓋範圍。",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "文件入口 | TW Market Data",
    description: "台股資料 API 文件入口，提供快速上手與依資料集揭露的 coverage / limitation 說明。",
    url: "/docs",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
  twitter: {
    card: "summary_large_image",
    title: "文件入口 | TW Market Data",
    description: "台股資料 API 文件入口與開發者指南。",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

export default function DocsPage() {
  redirect("/docs/introduction");
}
