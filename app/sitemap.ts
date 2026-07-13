import type { MetadataRoute } from "next";

import { siteConfig } from "@/src/config/site";
import { EN_HOMEPAGE_READY } from "@/src/config/i18n";
import { getAllBlogPosts } from "@/src/content/blog-posts";
import { getPublishedAnswerPages } from "@/src/content/answer-pages";
import { docsPages } from "@/src/content/docs-pages";

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function toEntry(
  url: string,
  changeFrequency: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteConfig.url}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/datasets", changeFrequency: "weekly", priority: 0.9 },
    { path: "/datasets/twse-daily-price", changeFrequency: "weekly", priority: 0.85 },
    { path: "/datasets/monthly-revenue", changeFrequency: "weekly", priority: 0.85 },
    { path: "/datasets/income-statement", changeFrequency: "weekly", priority: 0.85 },
    { path: "/datasets/balance-sheet", changeFrequency: "weekly", priority: 0.85 },
    { path: "/datasets/institutional-flow", changeFrequency: "weekly", priority: 0.85 },
    { path: "/datasets/securities-lending", changeFrequency: "weekly", priority: 0.85 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
    { path: "/compare/twmarketdata-vs-finmind-vs-tej", changeFrequency: "monthly", priority: 0.8 },
    { path: "/connect", changeFrequency: "weekly", priority: 0.85 },
    { path: "/connect/key-safety", changeFrequency: "monthly", priority: 0.5 },
    { path: "/connect/which-tier", changeFrequency: "monthly", priority: 0.5 },
    { path: "/docs", changeFrequency: "weekly", priority: 0.9 },
    { path: "/blog", changeFrequency: "monthly", priority: 0.8 },
    { path: "/api", changeFrequency: "weekly", priority: 0.85 },
    { path: "/login", changeFrequency: "monthly", priority: 0.4 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
    { path: "/docs/data-provenance", changeFrequency: "weekly", priority: 0.75 },
    { path: "/docs/market-coverage", changeFrequency: "weekly", priority: 0.75 },
    { path: "/docs/tools-mcp", changeFrequency: "weekly", priority: 0.75 },
    { path: "/docs/openapi-spec", changeFrequency: "weekly", priority: 0.75 },
    { path: "/openapi.json", changeFrequency: "weekly", priority: 0.7 },
    { path: "/llms.txt", changeFrequency: "monthly", priority: 0.55 },
    { path: "/llms-full.txt", changeFrequency: "monthly", priority: 0.5 },
  ];

  const docsRoutes = docsPages
    .filter((page) => page.tier === "complete")
    .filter((page) => page.href.startsWith("/docs/"))
    .filter((page) => !page.href.includes("/coming-soon/"))
    .map((page) => page.href);

  const blogRoutes = getAllBlogPosts().map((post) => `/blog/${post.slug}`);

  // Only list pages that are actually indexable: the English homepage once content-complete, and
  // answer-shaped pages once published (drafts are noindex, so they must not appear in the sitemap).
  const enRoutes = EN_HOMEPAGE_READY ? ["/en"] : [];
  const publishedAnswerPages = getPublishedAnswerPages();
  const answerRoutes =
    publishedAnswerPages.length > 0
      ? ["/answers", ...publishedAnswerPages.map((page) => `/answers/${page.slug}`)]
      : [];

  const uniqueRoutes = new Set<string>([
    ...staticRoutes.map((route) => route.path),
    ...docsRoutes,
    ...blogRoutes,
    ...enRoutes,
    ...answerRoutes,
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const route of uniqueRoutes) {
    if (route.startsWith("/blog/")) {
      entries.push(toEntry(route, "monthly", 0.7));
      continue;
    }

    const staticRoute = staticRoutes.find((item) => item.path === route);
    if (staticRoute) {
      entries.push(toEntry(route, staticRoute.changeFrequency, staticRoute.priority));
      continue;
    }

    if (route.startsWith("/docs/")) {
      entries.push(toEntry(route, "weekly", 0.72));
      continue;
    }

    entries.push(toEntry(route, "monthly", 0.6));
  }

  return entries;
}
