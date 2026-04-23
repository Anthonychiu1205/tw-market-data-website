import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/ui/container";
import { blogPosts } from "@/src/content/blog";

export const metadata: Metadata = {
  title: "觀點文章",
  description: "台股資料方法、導入教學與產業觀察文章。",
};

export default function BlogPage() {
  return (
    <Container className="space-y-8 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Blog</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">觀點文章</h1>
        <p className="max-w-3xl text-base text-slate-600">聚焦台股資料方法、API 導入流程與產品實務，供自然搜尋與內容閱讀使用。</p>
      </section>

      <section className="space-y-4">
        {blogPosts.map((post) => (
          <article key={post.slug} className="border-b border-slate-200 pb-4">
            <p className="text-xs text-slate-500">
              {post.category} · {post.publishedAt} · {post.readingMinutes} 分鐘
            </p>
            <Link href={`/blog/${post.slug}`} className="mt-1 inline-flex text-xl font-semibold tracking-tight text-slate-900 hover:text-slate-700">
              {post.title}
            </Link>
            <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
          </article>
        ))}
      </section>
    </Container>
  );
}
