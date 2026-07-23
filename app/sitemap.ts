import type { MetadataRoute } from "next";

import { siteConfig } from "@/src/config/site";
import { getAllBlogPosts } from "@/src/content/blog-posts";
import { getPublishedAnswerPages } from "@/src/content/answer-pages";
import { docsPages } from "@/src/content/docs-pages";
import { datasetSeoEntries } from "@/src/content/datasets";
import { factsTopics } from "@/src/content/facts";
import { DOCS_DATASET_CATALOG } from "@/src/content/docs/dataset-catalog";
import { articleSlugs } from "@/src/content/docs/article-pages";
import { localizedPath } from "@/src/i18n/seo";
import { LOCALES } from "@/src/i18n/locales";

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

// Machine / non-page routes that live OUTSIDE the [locale] segment — never locale-prefixed.
function isMachineRoute(path: string): boolean {
  return /\.(json|txt|xml)$/.test(path) || path === "/api";
}

const HREFLANG_KEY: Record<string, string> = { en: "en", "zh-TW": "zh-Hant" };

// One sitemap row per locale for a page, each carrying the full hreflang cluster (zh-Hant + en +
// x-default=en) so Google sees the bilingual pair. Machine routes emit a single unprefixed row.
function pageEntries(path: string, changeFrequency: ChangeFrequency, priority: number): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {
    "x-default": `${siteConfig.url}${localizedPath("en", path)}`,
  };
  for (const locale of LOCALES) {
    languages[HREFLANG_KEY[locale]] = `${siteConfig.url}${localizedPath(locale, path)}`;
  }
  return LOCALES.map((locale) => ({
    url: `${siteConfig.url}${localizedPath(locale, path)}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

function urlEntry(url: string, changeFrequency: ChangeFrequency, priority: number): MetadataRoute.Sitemap[number] {
  return { url: `${siteConfig.url}${url}`, lastModified: new Date(), changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/datasets", changeFrequency: "weekly", priority: 0.9 },
    // Every /datasets/<slug> SEO page and every /docs/api/<domain>/<slug> reference page is enumerated
    // below from the SAME SSOT the pages render from (datasetSeoEntries + DOCS_DATASET_CATALOG), so a
    // new dataset can never be missing from the sitemap (the old hardcoded 6-slug list dropped the rest).
    { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
    { path: "/compare/twmarketdata-vs-finmind-vs-tej", changeFrequency: "monthly", priority: 0.8 },
    { path: "/connect", changeFrequency: "weekly", priority: 0.85 },
    { path: "/connect/key-safety", changeFrequency: "monthly", priority: 0.5 },
    { path: "/connect/which-tier", changeFrequency: "monthly", priority: 0.5 },
    { path: "/docs", changeFrequency: "weekly", priority: 0.9 },
    { path: "/errata", changeFrequency: "weekly", priority: 0.5 },
    { path: "/facts", changeFrequency: "weekly", priority: 0.7 },
    { path: "/blog", changeFrequency: "monthly", priority: 0.8 },
    { path: "/login", changeFrequency: "monthly", priority: 0.4 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
    { path: "/docs/data-provenance", changeFrequency: "weekly", priority: 0.75 },
    { path: "/docs/market-coverage", changeFrequency: "weekly", priority: 0.75 },
    { path: "/docs/tools-and-mcp", changeFrequency: "weekly", priority: 0.75 },
    { path: "/docs/openapi-spec", changeFrequency: "weekly", priority: 0.75 },
    // Machine routes (kept unprefixed by isMachineRoute):
    { path: "/openapi.json", changeFrequency: "weekly", priority: 0.7 },
    { path: "/llms.txt", changeFrequency: "monthly", priority: 0.55 },
    { path: "/llms-full.txt", changeFrequency: "monthly", priority: 0.5 },
  ];

  const docsRoutes = docsPages
    .filter((page) => page.tier === "complete")
    .filter((page) => page.href.startsWith("/docs/"))
    .filter((page) => !page.href.includes("/coming-soon/"))
    .map((page) => page.href);

  // SSOT-driven dataset + docs pages (never hardcoded, so nothing can silently drop out):
  // every /datasets/<slug> SEO page, every /docs/api/<domain>/<slug> reference page (61 in the
  // catalog), and every v5 article/guide/ai-agents page.
  const datasetSeoRoutes = datasetSeoEntries.map((d) => `/datasets/${d.slug}`);
  const datasetDocsRoutes = DOCS_DATASET_CATALOG.map((d) => `/docs/api/${d.domain}/${d.slug}`);
  const articleRoutes = articleSlugs().map((parts) => `/docs/${parts.join("/")}`);

  const blogRoutes = getAllBlogPosts().map((post) => `/blog/${post.slug}`);

  // Published /facts/<slug> statistics pages (SSOT: facts.ts `published` flag), so a Facts page enters
  // the sitemap the moment it goes live — never before (audit-first: unpublished topics are not routes).
  const factsRoutes = factsTopics.filter((t) => t.published).map((t) => `/facts/${t.slug}`);

  // Answer pages are authored per-locale (distinct slugs); each exists in one locale only, so emit
  // each at its own locale prefix (no cross-locale hreflang pair).
  const localeAnswerRows: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    const pages = getPublishedAnswerPages(locale);
    if (pages.length === 0) continue;
    for (const path of ["/answers", ...pages.map((page) => `/answers/${page.slug}`)]) {
      localeAnswerRows.push(urlEntry(localizedPath(locale, path), "monthly", 0.6));
    }
  }

  const seen = new Set<string>();
  const pagePaths: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [];
  const machineRows: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    if (isMachineRoute(route.path)) {
      machineRows.push(urlEntry(route.path, route.changeFrequency, route.priority));
    } else if (!seen.has(route.path)) {
      seen.add(route.path);
      pagePaths.push(route);
    }
  }
  for (const path of docsRoutes) {
    if (!seen.has(path)) {
      seen.add(path);
      pagePaths.push({ path, changeFrequency: "weekly", priority: 0.72 });
    }
  }
  for (const path of datasetSeoRoutes) {
    if (!seen.has(path)) {
      seen.add(path);
      pagePaths.push({ path, changeFrequency: "weekly", priority: 0.85 });
    }
  }
  for (const path of datasetDocsRoutes) {
    if (!seen.has(path)) {
      seen.add(path);
      pagePaths.push({ path, changeFrequency: "weekly", priority: 0.78 });
    }
  }
  for (const path of articleRoutes) {
    if (!seen.has(path)) {
      seen.add(path);
      pagePaths.push({ path, changeFrequency: "weekly", priority: 0.7 });
    }
  }
  for (const path of blogRoutes) {
    if (!seen.has(path)) {
      seen.add(path);
      pagePaths.push({ path, changeFrequency: "monthly", priority: 0.7 });
    }
  }
  for (const path of factsRoutes) {
    if (!seen.has(path)) {
      seen.add(path);
      pagePaths.push({ path, changeFrequency: "weekly", priority: 0.7 });
    }
  }

  return [
    ...pagePaths.flatMap((r) => pageEntries(r.path, r.changeFrequency, r.priority)),
    ...localeAnswerRows,
    ...machineRows,
  ];
}
