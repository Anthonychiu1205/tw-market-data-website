import type { Metadata } from "next";

import { BlogIndex } from "@/src/components/blog/blog-index";
import { getBlogIndexPayload } from "@/src/lib/blog-adapter";

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering notes for Taiwan market data, quant workflows, and AI financial agents.",
  alternates: {
    canonical: "/blog",
  },
};

type BlogPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = (await searchParams) ?? {};
  const payload = getBlogIndexPayload(params.category);

  return <BlogIndex posts={payload.posts} allPosts={payload.allPosts} topics={payload.topics} activeTopic={payload.activeTopic} />;
}
