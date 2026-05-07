import Link from "next/link";

import { cn } from "@/src/lib/cn";
import type { BlogPost } from "@/src/content/blog-posts";

type BlogCardProps = {
  post: BlogPost;
  variant?: "default" | "featured";
  className?: string;
};

export function BlogCard({ post, variant = "default", className }: BlogCardProps) {
  if (variant === "featured") {
    return (
      <article className={cn("rounded-xl border border-slate-200 bg-white px-5 py-6 sm:px-7", className)}>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
          <Link href={`/blog/${post.slug}`} className="hover:underline hover:underline-offset-4">
            {post.seoTitle}
          </Link>
        </h3>
        <p className="mt-3 text-base leading-8 text-slate-600">{post.description}</p>
      </article>
    );
  }

  return (
    <article className={cn("py-6", className)}>
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">
        <Link href={`/blog/${post.slug}`} className="hover:underline hover:underline-offset-4">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{post.description}</p>
    </article>
  );
}
