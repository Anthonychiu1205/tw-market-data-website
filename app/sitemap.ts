import type { MetadataRoute } from "next";

import { siteConfig } from "@/src/config/site";
import { blogPosts } from "@/src/content/blog";

const routes = [
  "",
  "/product",
  "/datasets",
  "/api",
  "/pricing",
  "/docs",
  "/blog",
  "/about",
  "/contact",
  "/login",
  "/dashboard",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);
  const allRoutes = [...routes, ...blogRoutes];

  return allRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
