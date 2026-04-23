import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonClass } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { blogPosts, getBlogPostBySlug } from "@/src/content/blog";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Container className="py-12">
      <article className="mx-auto max-w-3xl space-y-6">
        <Link href="/blog" className="text-sm text-slate-600 hover:text-slate-900">
          ← 返回觀點文章
        </Link>

        <header className="space-y-2 border-b border-slate-200 pb-5">
          <p className="text-xs text-slate-500">
            {post.category} · {post.publishedAt} · {post.readingMinutes} 分鐘
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{post.title}</h1>
          <p className="text-base text-slate-600">{post.excerpt}</p>
        </header>

        <section className="space-y-4">
          {post.body.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-slate-700">
              {paragraph}
            </p>
          ))}
        </section>

        <footer className="border-t border-slate-200 pt-5">
          <p className="text-sm text-slate-600">想進一步評估方案，可前往 pricing、docs 或聯繫團隊。</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/pricing" className={buttonClass("secondary")}>
              查看方案
            </Link>
            <Link href="/docs" className={buttonClass("secondary")}>
              查看文件
            </Link>
            <Link href="/contact" className={buttonClass("secondary")}>
              聯繫我們
            </Link>
          </div>
        </footer>
      </article>
    </Container>
  );
}
