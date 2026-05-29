"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  faqPageMeta,
  getFaqTopicCount,
  helpCategories,
  helpCenterEntryCards,
  helpCenterFooterCtas,
  helpCenterPageMeta,
  helpCenterQuickLinks,
  helpCenterStatusItems,
  helpEmptyStateMessage,
  helpFaqSectionTitle,
  helpSearchHint,
  helpSearchPlaceholder,
  helpStatusBadgeLabel,
  helpTopicSectionTitle,
  searchHelpTopics,
} from "@/src/content/help-center";

type HelpCenterShellProps = {
  mode: "help" | "faq";
};

function normalize(text: string) {
  return text.trim().toLowerCase();
}

export function HelpCenterShell({ mode }: HelpCenterShellProps) {
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [activeSectionId, setActiveSectionId] = useState(helpCenterQuickLinks[0]?.href.replace("#", "") ?? "");
  const normalizedQuery = normalize(query);
  const isSearching = normalizedQuery.length > 0;

  const filteredCategories = useMemo(() => {
    const baseCategories =
      selectedCategoryId === "all" ? helpCategories : helpCategories.filter((category) => category.id === selectedCategoryId);

    if (!isSearching) {
      return baseCategories;
    }

    return baseCategories
      .map((category) => ({
        ...category,
        topics: category.topics.filter((topic) => {
          const haystack = `${topic.question}\n${topic.answer}\n${topic.tags?.join(" ") ?? ""}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        }),
      }))
      .filter((category) => category.topics.length > 0);
  }, [isSearching, normalizedQuery, selectedCategoryId]);

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return searchHelpTopics(normalizedQuery);
  }, [isSearching, normalizedQuery]);

  const pageMeta = mode === "help" ? helpCenterPageMeta : faqPageMeta;

  const visibleSectionIds = useMemo(() => new Set(filteredCategories.map((category) => category.id)), [filteredCategories]);
  const activeDisplaySectionId = useMemo(() => {
    if (filteredCategories.length === 0) return "";
    if (visibleSectionIds.has(activeSectionId)) return activeSectionId;
    return filteredCategories[0].id;
  }, [activeSectionId, filteredCategories, visibleSectionIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (filteredCategories.length === 0) return;

    const sectionIds = filteredCategories.map((category) => category.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length === 0) return;
        const nextId = visible[0].target.getAttribute("id");
        if (!nextId) return;
        setActiveSectionId(nextId);
      },
      {
        root: null,
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.3, 0.6],
      },
    );

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [filteredCategories]);

  return (
    <div className="bg-slate-50">
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-8">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {helpStatusBadgeLabel}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{pageMeta.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{pageMeta.subtitle}</p>

          <label className="mt-6 block">
            <span className="sr-only">搜尋常見問題</span>
            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 text-slate-500 shadow-sm transition focus-within:border-slate-500">
              <Search className="h-4 w-4" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-full w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder={helpSearchPlaceholder}
                autoComplete="off"
              />
            </div>
          </label>
          <p className="mt-2 text-xs text-slate-500">{helpSearchHint}</p>

          {mode === "help" ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {helpCenterEntryCards.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
                >
                  <card.icon className="h-4 w-4 text-slate-600" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">{card.title}</p>
                  <p className="mt-1 text-xs leading-6 text-slate-600">{card.description}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">{helpFaqSectionTitle}</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategoryId("all")}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  selectedCategoryId === "all"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900"
                }`}
              >
                全部分類
              </button>
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    selectedCategoryId === category.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {helpCenterQuickLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                    onClick={() => setActiveSectionId(item.href.replace("#", ""))}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition ${
                  activeDisplaySectionId === item.href.replace("#", "")
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900"
                } ${visibleSectionIds.has(item.href.replace("#", "")) ? "" : "opacity-40"}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <section className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">{helpTopicSectionTitle}</h2>
            <p className="text-xs text-slate-500">
              {isSearching
                ? `找到 ${searchResults.length.toLocaleString()} 筆結果`
                : `共 ${getFaqTopicCount().toLocaleString()} 個問題`}
            </p>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-600">
              {helpEmptyStateMessage}
            </div>
          ) : (
            filteredCategories.map((category) => (
              <article key={category.id} id={category.id} className="rounded-3xl border border-slate-200 bg-white px-5 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <category.icon className="h-4 w-4 text-slate-600" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{category.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{category.description}</p>
                  </div>
                </div>

                <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200/80 bg-slate-50/40">
                  {category.topics.map((topic) => (
                    <details key={topic.id} className="group px-4 py-3" open={isSearching}>
                      <summary className="cursor-pointer list-none text-sm font-medium text-slate-900 marker:content-none">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-slate-400 transition group-open:rotate-90">▸</span>
                          {topic.question}
                        </span>
                      </summary>
                      <p className="pl-6 pt-2 text-sm leading-7 text-slate-600">{topic.answer}</p>
                    </details>
                  ))}
                </div>
              </article>
            ))
          )}
        </section>

        <section className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:grid-cols-3 sm:px-6">
          {helpCenterStatusItems.map((item) => (
            <p key={item} className="text-xs leading-6 text-slate-600">
              {item}
            </p>
          ))}
        </section>

        <section className="mt-6 flex flex-wrap gap-2">
          {helpCenterFooterCtas.map((cta) => (
            <Link
              key={cta.label}
              href={cta.href}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              {cta.label}
            </Link>
          ))}
        </section>
      </section>
    </div>
  );
}
