import Image from "next/image";
import Link from "next/link";

import { cn } from "@/src/lib/cn";
import { getLocalizedBlogPost, type BlogPost } from "@/src/content/blog-posts";

type BlogCardProps = {
  post: BlogPost;
  locale: string;
  className?: string;
};

export function BlogCard({ post, locale, className }: BlogCardProps) {
  const view = getLocalizedBlogPost(post, locale);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group block h-full cursor-pointer rounded-2xl bg-transparent p-3 transition-colors duration-150 hover:bg-slate-200/70",
        className,
      )}
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-transparent">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="flex min-h-[170px] flex-1 flex-col px-1 pb-1 pt-4">
          <h3 className="min-h-[3.1rem] text-lg font-semibold leading-snug text-slate-950">
            <span className="line-clamp-2">{view.title}</span>
          </h3>

          <p className="mt-3 line-clamp-2 min-h-[2.9rem] text-sm leading-6 text-slate-600">{view.excerpt}</p>

          <div className="mt-6 text-sm text-slate-500">
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}
