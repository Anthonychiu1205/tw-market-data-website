import type { MetadataRoute } from "next";

import { siteConfig } from "@/src/config/site";

// Non-public areas kept out of every crawler's index (auth-gated app, raw API, login wall).
// Routes are now locale-prefixed (/en/dashboard, /zh-TW/dashboard), so each protected/auth area is
// disallowed in both its bare (root-redirect) and /*/-prefixed forms. /api stays unprefixed.
const PROTECTED_AREAS = ["dashboard", "billing", "usage", "settings", "account"];
const AUTH_PAGES = ["login", "register", "verify-email", "forgot-password", "reset-password"];
const DISALLOW_PATHS = [
  "/api/",
  "/api/*",
  ...PROTECTED_AREAS.flatMap((area) => [`/${area}`, `/${area}/`, `/*/${area}`, `/*/${area}/`]),
  ...AUTH_PAGES.flatMap((page) => [`/${page}`, `/*/${page}`]),
];

// AI / answer-engine crawlers we explicitly welcome. Naming them (rather than relying only on
// the "*" rule) makes the allowlist auditable and, more importantly, keeps them allowed even if
// a future "*" rule is tightened. Split by function per each vendor's published UA list:
//   OpenAI  — GPTBot (training), OAI-SearchBot (search index), ChatGPT-User (live browse)
//   Anthropic — ClaudeBot (training), Claude-User (live browse)
//   Google  — Google-Extended (Gemini training opt-in token; not a real fetching UA)
//   Perplexity — PerplexityBot (index), Perplexity-User (live browse)
//   Common Crawl — CCBot (shared upstream corpus for most open models)
//   Microsoft — Bingbot (underlies part of ChatGPT search)
// This only grants access to already-public content; it injects no instructions to the models
// (C-6: no prompt-injection / cloaking — the allowlist just says "you may read the public site").
const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW_PATHS,
      },
      {
        userAgent: AI_CRAWLER_USER_AGENTS,
        allow: "/",
        disallow: DISALLOW_PATHS,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
