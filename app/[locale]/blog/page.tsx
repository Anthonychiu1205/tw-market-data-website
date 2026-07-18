import type { Metadata } from "next";

import { BlogIndex } from "@/src/components/blog/blog-index";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { getAllBlogPosts } from "@/src/content/blog-posts";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

// Static, revalidated hourly — blog content comes from the repo, no backend call.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as import("@/src/i18n/locales").AppLocale;
  const isEn = l === "en";
  const title = isEn ? "Insights" : "觀點文章";
  const description = isEn
    ? "Product notes on the Taiwan stock market data API, data engineering, quantitative research, and AI agent workflows."
    : "台股資料 API、資料工程、量化研究與 AI agent workflow 的產品筆記。";
  const ogTitle = isEn ? "Insights | TW Market Data" : "觀點文章 | TW Market Data";
  const ogImage = getAbsoluteUrl(siteConfig.ogImagePath);
  return {
    title,
    description,
    alternates: buildAlternates(l, "/blog"),
    openGraph: {
      title: ogTitle,
      description,
      url: "/blog",
      type: "website",
      locale: OG_LOCALE[l],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
  };
}

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogIndex posts={posts} />;
}
