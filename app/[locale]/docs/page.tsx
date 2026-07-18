import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

// Static, revalidated hourly — no request-time backend call.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as import("@/src/i18n/locales").AppLocale;
  const isEn = l === "en";
  return {
    title: isEn ? "Docs" : "文件",
    description: isEn
      ? "TW Market Data documentation hub — Quick Start, API Model, data lineage, and market coverage."
      : "TW Market Data 文件入口，包含 Quick Start、API Model、資料血緣與市場覆蓋範圍。",
    alternates: buildAlternates(l, "/docs"),
    openGraph: {
      title: isEn ? "Documentation | TW Market Data" : "文件入口 | TW Market Data",
      description: isEn
        ? "Taiwan stock market data API documentation hub — quick start plus per-dataset coverage / limitation notes."
        : "台股資料 API 文件入口，提供快速上手與依資料集揭露的 coverage / limitation 說明。",
      url: "/docs",
      locale: OG_LOCALE[l],
      images: [getAbsoluteUrl(siteConfig.ogImagePath)],
    },
    twitter: {
      card: "summary_large_image",
      title: isEn ? "Documentation | TW Market Data" : "文件入口 | TW Market Data",
      description: isEn
        ? "Taiwan stock market data API documentation hub and developer guide."
        : "台股資料 API 文件入口與開發者指南。",
      images: [getAbsoluteUrl(siteConfig.ogImagePath)],
    },
  };
}

export default function DocsPage() {
  redirect("/docs/introduction");
}
