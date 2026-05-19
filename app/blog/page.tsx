import type { Metadata } from "next";

import { BlogIndex } from "@/src/components/blog/blog-index";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { getAllBlogPosts } from "@/src/content/blog-posts";

export const metadata: Metadata = {
  title: "觀點文章",
  description: "台股資料 API、資料工程、量化研究與 AI agent workflow 的產品筆記。",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "觀點文章 | TW Market Data",
    description: "台股資料 API、資料工程、量化研究與 AI agent workflow 的產品筆記。",
    url: "/blog",
    type: "website",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
  twitter: {
    card: "summary_large_image",
    title: "觀點文章 | TW Market Data",
    description: "台股資料 API、資料工程、量化研究與 AI agent workflow 的產品筆記。",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogIndex posts={posts} />;
}
