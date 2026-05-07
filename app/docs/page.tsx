import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAbsoluteUrl, siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "文件",
  description: "TW Market Data 文件入口，包含 Quick Start、API Model、資料血緣與市場覆蓋範圍。",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "文件入口 | TW Market Data",
    description: "台股資料 API 文件入口，提供快速上手與完整 endpoint 文件。",
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
