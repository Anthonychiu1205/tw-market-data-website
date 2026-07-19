"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { BlogCard } from "@/src/components/blog/blog-card";
import { Container } from "@/src/components/ui/container";
import { BLOG_CATEGORIES, getLocalizedBlogPost, type BlogCategory, type BlogPost } from "@/src/content/blog-posts";

type BlogIndexProps = {
  posts: BlogPost[];
};

// Category values stay zh (they are matched against post.category); only the DISPLAY label is
// localized via this key map → blog.categories.* messages.
const CATEGORY_KEY: Record<string, string> = {
  全部: "all",
  產品更新: "productUpdates",
  資料工程: "dataEngineering",
  "API 教學": "apiTutorials",
  量化研究: "quantResearch",
  "AI Agent": "aiAgent",
  產品化: "productization",
};

export function BlogIndex({ posts }: BlogIndexProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "全部">("全部");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const view = getLocalizedBlogPost(post, locale);
      const categoryMatch = selectedCategory === "全部" || post.category === selectedCategory;
      const queryMatch =
        !normalizedQuery ||
        view.title.toLowerCase().includes(normalizedQuery) ||
        view.excerpt.toLowerCase().includes(normalizedQuery) ||
        (view.tags ?? []).some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return categoryMatch && queryMatch;
    });
  }, [posts, query, selectedCategory, locale]);

  // §2.5 notice only when at least one listed post has no English translation yet.
  const showEnglishNotice =
    locale === "en" && filteredPosts.some((post) => !getLocalizedBlogPost(post, locale).hasEnglish);

  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{t("title")}</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            {t("subtitle")}
          </p>
          {showEnglishNotice ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              {t("englishNotice")}
            </p>
          ) : null}
        </header>

        <div className="mt-7 space-y-4">
          <label htmlFor="blog-search" className="sr-only">
            {t("searchLabel")}
          </label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchLabel")}
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
                  {t(`categories.${CATEGORY_KEY[category]}`)}
                </button>
              );
            })}
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm leading-7 text-slate-600">{t("emptyState")}</p>
          </section>
        )}

        <div className="h-8" aria-hidden="true" />
      </div>
    </Container>
  );
}
