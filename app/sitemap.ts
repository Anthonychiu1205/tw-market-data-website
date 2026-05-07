import type { MetadataRoute } from "next";

import { siteConfig } from "@/src/config/site";
import { getAllBlogPosts } from "@/src/content/blog-posts";
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
    { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
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
  ];

  const docsRoutes = docsPages
    .filter((page) => page.tier === "complete")
    .filter((page) => page.href.startsWith("/docs/"))
    .filter((page) => !page.href.includes("/coming-soon/"))
    .map((page) => page.href);

  const blogRoutes = getAllBlogPosts().map((post) => `/blog/${post.slug}`);

  const uniqueRoutes = new Set<string>([
    ...staticRoutes.map((route) => route.path),
    ...docsRoutes,
    ...blogRoutes,
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
