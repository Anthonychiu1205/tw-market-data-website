#!/usr/bin/env node
// I18N missing-EN-page report (I18N-FIX-01 item 3).
//
// Long-form content that is authored zh-only renders the §2.5 "English coming soon" fallback on /en
// instead of a real English translation. This report inventories those pages so the gap is visible
// (and CI-trackable) rather than silent — a machine-readable list of what still needs human EN
// copywriting. Regex-based (no TS/JSX import) so it runs anywhere with plain node.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

// Blog: every post in blog-posts.tsx is zh-only long-form → /en/blog/<slug> shows the fallback.
function blogSlugs() {
  const src = read("src/content/blog-posts.tsx");
  return [...src.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
}

// Docs: the [...slug] body comes from docs-pages.ts (zh-only prose). "complete"-tier /docs/* pages
// render the fallback on /en.
function docsHrefs() {
  const src = read("src/content/docs-pages.ts");
  // Pair each href with its nearest preceding tier so we only count shipped ("complete") pages.
  const entries = [...src.matchAll(/tier:\s*"(\w+)"[\s\S]{0,400}?href:\s*"(\/docs\/[^"]+)"|href:\s*"(\/docs\/[^"]+)"[\s\S]{0,400}?tier:\s*"(\w+)"/g)];
  const hrefs = new Set();
  for (const m of entries) {
    const href = m[2] || m[3];
    const tier = m[1] || m[4];
    if (href && tier === "complete" && !href.includes("/coming-soon/")) hrefs.add(href);
  }
  return [...hrefs];
}

const blog = blogSlugs();
const docs = docsHrefs();

const report = {
  generatedFor: "I18N-01 §2.5 fallback coverage (/en)",
  sections: {
    blog: { count: blog.length, pages: blog.map((s) => `/en/blog/${s}`) },
    docs: { count: docs.length, pages: docs.map((h) => `/en${h}`) },
  },
  total: blog.length + docs.length,
};

console.log(JSON.stringify(report, null, 2));

// CI assertion: blog MUST be represented (the acceptance item explicitly requires blog coverage).
if (blog.length === 0) {
  console.error("\n[i18n-missing-en] FAIL: expected blog posts in the missing-EN report, found 0.");
  process.exit(1);
}
console.error(`\n[i18n-missing-en] OK: ${report.total} zh-only pages render the §2.5 fallback on /en (blog: ${blog.length}, docs: ${docs.length}).`);
