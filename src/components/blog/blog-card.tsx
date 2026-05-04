import Link from "next/link";

import { cn } from "@/src/lib/cn";
import type { BlogIndexItem } from "@/src/lib/blog-adapter";

type BlogCardProps = {
  post: BlogIndexItem;
  variant?: "default" | "featured";
  className?: string;
};

function getMetaText(post: BlogIndexItem) {
  return `${post.publishedAt} · ${post.category} · ${post.readingTime}`;
}

export function BlogCard({ post, variant = "default", className }: BlogCardProps) {
  if (variant === "featured") {
    return (
      <article className={cn("rounded-xl border border-slate-200 bg-white px-5 py-6 sm:px-7", className)}>
        <p className="text-sm text-slate-500">{getMetaText(post)}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          <Link href={`/blog/${post.slug}`} className="hover:underline hover:underline-offset-4">
            {post.seoTitle}
          </Link>
        </h3>
        <p className="mt-3 text-base leading-8 text-slate-600">{post.description}</p>
        <p className="mt-4 text-sm text-slate-500">{post.author}</p>
      </article>
    );
  }

  return (
    <article className={cn("py-6", className)}>
      <p className="text-sm text-slate-500">{getMetaText(post)}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
        <Link href={`/blog/${post.slug}`} className="hover:underline hover:underline-offset-4">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{post.description}</p>
      <p className="mt-4 text-sm text-slate-500">{post.author}</p>
    </article>
  );
}
