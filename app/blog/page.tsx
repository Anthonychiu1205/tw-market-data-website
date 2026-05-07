import type { Metadata } from "next";

import { BlogIndex } from "@/src/components/blog/blog-index";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import { getAllBlogPosts } from "@/src/content/blog-posts";

export const metadata: Metadata = {
  title: "觀點文章",
  description: "台灣市場資料的研究觀點、導入流程與實作文章。",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "觀點文章 | TW Market Data",
    description: "台股資料 API、量化研究與 AI agent workflow 的實作觀點文章。",
    url: "/blog",
    type: "website",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
  twitter: {
    card: "summary_large_image",
    title: "觀點文章 | TW Market Data",
    description: "台股資料 API 與量化研究的實作觀點整理。",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

type BlogPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = (await searchParams) ?? {};
  const allPosts = getAllBlogPosts();
  const normalizedCategory = params.category?.toLowerCase().trim();
  const posts = normalizedCategory ? allPosts.filter((post) => post.topic.slug === normalizedCategory) : allPosts;

  return <BlogIndex posts={posts} />;
}
