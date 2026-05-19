"use client";

import { useMemo, useState } from "react";

import { BlogCard } from "@/src/components/blog/blog-card";
import { Container } from "@/src/components/ui/container";
import { BLOG_CATEGORIES, type BlogCategory, type BlogPost } from "@/src/content/blog-posts";

type BlogIndexProps = {
  posts: BlogPost[];
};

export function BlogIndex({ posts }: BlogIndexProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "全部">("全部");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const categoryMatch = selectedCategory === "全部" || post.category === selectedCategory;
      const queryMatch =
        !normalizedQuery ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return categoryMatch && queryMatch;
    });
  }, [posts, query, selectedCategory]);

  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">觀點文章</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            台股資料 API、資料工程、量化研究與 AI agent workflow 的產品筆記。
          </p>
        </header>

        <div className="mt-7 space-y-4">
          <label htmlFor="blog-search" className="sr-only">
            搜尋文章
          </label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋文章"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />

          <div className="flex flex-wrap gap-2.5">
            {BLOG_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900",
                  ].join(" ")}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm leading-7 text-slate-600">找不到符合條件的文章，請調整分類或關鍵字。</p>
          </section>
        )}

        <div className="h-8" aria-hidden="true" />
      </div>
    </Container>
  );
}
