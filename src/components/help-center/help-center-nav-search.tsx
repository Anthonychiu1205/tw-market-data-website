"use client";

import Link from "next/link";
import { AlertTriangle, Bot, ChevronDown, ChevronRight, Database, LifeBuoy, Rocket, Search, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";

import type { HelpArticle } from "@/src/content/help-center-articles";
import { helpCenterCategories } from "@/src/content/help-center-articles";

type HelpCategory = (typeof helpCenterCategories)[number];

type GroupedCategory = {
  category: HelpCategory;
  articles: HelpArticle[];
};

const categoryIcons: Record<HelpCategory["id"], ComponentType<{ className?: string }>> = {
  "quick-start": Rocket,
  security: ShieldCheck,
  troubleshooting: AlertTriangle,
  "data-usage": Database,
  "tools-ai": Bot,
  contact: LifeBuoy,
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function buildGroups(articles: HelpArticle[], categories: HelpCategory[]) {
  return categories.map((category) => ({
    category,
    articles: articles.filter((article) => article.category === category.title),
  }));
}

type IndexPanelsProps = {
  articles: HelpArticle[];
  categories: HelpCategory[];
};

export function HelpCenterIndexPanels({ articles, categories }: IndexPanelsProps) {
  const [query, setQuery] = useState("");
  const initialExpanded = useMemo(
    () =>
      categories.reduce<Record<string, boolean>>((acc, category, index) => {
        acc[category.id] = index < 2;
        return acc;
      }, {}),
    [categories],
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded);

  const groups = useMemo(() => {
    const normalized = normalize(query);
    const grouped = buildGroups(articles, categories).map((group) => {
      if (!normalized) return group;
      return {
        ...group,
        articles: group.articles.filter((article) =>
          `${article.title} ${article.description} ${article.category}`.toLowerCase().includes(normalized),
        ),
      };
    });
    return grouped.filter((group) => group.articles.length > 0);
  }, [articles, categories, query]);

  const toggle = (categoryId: string) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900">文章</h2>
        <label className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋問題或關鍵字"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-300"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white">
        {groups.map(({ category, articles: groupedArticles }) => {
          const Icon = categoryIcons[category.id];
          const isExpanded = Boolean(expanded[category.id]) || query.length > 0;
          return (
            <section key={category.id} className="border-b border-slate-200 last:border-b-0">
              <button
                type="button"
                onClick={() => toggle(category.id)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                aria-expanded={isExpanded}
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                  <Icon className="h-4 w-4 text-slate-500" />
                  {category.title}
                </span>
                {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </button>
              {isExpanded ? (
                <div className="space-y-1 border-t border-slate-200 px-3 py-2.5">
                  {groupedArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/help-center/${article.slug}`}
                      className="block rounded px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      <p className="font-medium text-slate-700">{article.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{article.description}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </section>
  );
}

type ArticleNavProps = {
  articles: HelpArticle[];
  categories: HelpCategory[];
  currentSlug: string;
};

export function HelpCenterArticleNav({ articles, categories, currentSlug }: ArticleNavProps) {
  const [query, setQuery] = useState("");

  const activeCategoryId = useMemo(() => {
    const activeArticle = articles.find((article) => article.slug === currentSlug);
    return categories.find((category) => category.title === activeArticle?.category)?.id ?? categories[0]?.id;
  }, [articles, categories, currentSlug]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    categories.reduce<Record<string, boolean>>((acc, category) => {
      acc[category.id] = category.id === activeCategoryId;
      return acc;
    }, {}),
  );

  const groups: GroupedCategory[] = useMemo(() => {
    const normalized = normalize(query);
    return buildGroups(articles, categories)
      .map((group) => {
        if (!normalized) return group;
        return {
          ...group,
          articles: group.articles.filter((article) =>
            `${article.title} ${article.description} ${article.category}`.toLowerCase().includes(normalized),
          ),
        };
      })
      .filter((group) => group.articles.length > 0);
  }, [articles, categories, query]);

  const toggle = (categoryId: string) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const isSearching = query.trim().length > 0;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <h2 className="text-sm font-semibold text-slate-900">分類與文章</h2>
      <label className="relative mt-3 block">
        <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜尋問題或關鍵字"
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-300"
        />
      </label>
      <div className="mt-3 rounded-xl border border-slate-200 bg-white">
        {groups.map(({ category, articles: groupedArticles }) => {
          const Icon = categoryIcons[category.id];
          const isExpanded = Boolean(expanded[category.id]) || category.id === activeCategoryId || isSearching;
          return (
            <section key={category.id} className="border-b border-slate-200 last:border-b-0">
              <button
                type="button"
                onClick={() => toggle(category.id)}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                  isExpanded ? "bg-slate-50/70" : ""
                }`}
                aria-expanded={isExpanded}
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                  <Icon className="h-4 w-4 text-slate-500" />
                  {category.title}
                </span>
                {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </button>
              {isExpanded ? (
                <ul className="space-y-1 border-t border-slate-200 px-3 py-2.5">
                  {groupedArticles.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/help-center/${entry.slug}`}
                        className={`block rounded pl-5 pr-2 py-1.5 text-sm transition-colors ${
                          entry.slug === currentSlug
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {entry.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>
    </aside>
  );
}
