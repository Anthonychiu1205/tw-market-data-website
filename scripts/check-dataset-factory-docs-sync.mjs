import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

const failures = [];

function requireFile(path) {
  if (!existsSync(path)) {
    failures.push(`missing file: ${path}`);
    return "";
  }
  return readFileSync(path, "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const docsPagesPath = resolve(ROOT, "src/content/docs-pages.ts");
const docsSidebarPath = resolve(ROOT, "src/content/docs-sidebar.ts");
const sitePath = resolve(ROOT, "src/content/site.ts");
const homeSourcePath = resolve(ROOT, "src/content/home-source-of-truth.ts");
// NOTE: llms.txt + llms-full.txt ownership moved to the website (app/llms.txt/route.ts +
// app/llms-full.txt/route.ts, generated from the storefront catalog SSOT at build time), so they are
// no longer pipeline-synced static files and are not checked here — the website is the single source.

const docsPages = requireFile(docsPagesPath);
const docsSidebar = requireFile(docsSidebarPath);
const siteContent = requireFile(sitePath);
const homeSourceContent = requireFile(homeSourcePath);

assert(docsPages.includes("/v2/datasets/valuation-core-daily"), "docs-pages missing valuation-core-daily route");
assert(!docsPages.includes("/v2/datasets/valuations"), "docs-pages still references stale /v2/datasets/valuations route");
assert(docsPages.includes("/v2/datasets/market-overview-snapshots"), "docs-pages missing market-overview-snapshots route");
assert(!docsPages.includes("/v2/datasets/price-enhanced/market-overview"), "docs-pages still references stale market-overview route");

for (const requiredPreview of [
  "day-trading-suspension",
  "disposition-securities-period",
  "market-overview-snapshots",
  "tax-business-registration",
  "company-risk-events",
  "capital-formation-events",
  "etf-holdings",
]) {
  assert(siteContent.includes(requiredPreview), `site.ts missing catalog entry: ${requiredPreview}`);
}

for (const forbiddenPublicDataset of [
  "/v2/datasets/theme-taxonomy",
  "/v2/datasets/index-classification",
  "/v2/datasets/features",
  "/v2/datasets/factor-data",
  "/v2/datasets/time-alignment",
  "/v2/datasets/screener",
]) {
  assert(!siteContent.includes(forbiddenPublicDataset), `site.ts still exposes support/internal dataset: ${forbiddenPublicDataset}`);
}

for (const warning of [
  "no_historical_completeness",
  "no_2022_2026_backfill",
]) {
  assert(siteContent.includes(warning), `site.ts missing current-snapshot warning: ${warning}`);
  assert(homeSourceContent.includes(warning), `home-source-of-truth missing current-snapshot warning: ${warning}`);
}

assert(!docsSidebar.includes("/docs/api/taxonomy/theme-taxonomy"), "docs-sidebar still exposes taxonomy page");
assert(!docsSidebar.includes("/docs/api/strategy-quant/features"), "docs-sidebar still exposes strategy-quant page");

const secretsLikePattern = /(database_url\s*=|mops_news_production_database_url\s*=|sk-[A-Za-z0-9]{20,})/i;
for (const [label, content] of [
  ["docs-pages", docsPages],
  ["docs-sidebar", docsSidebar],
  ["site", siteContent],
  ["home-source-of-truth", homeSourceContent],
]) {
  if (secretsLikePattern.test(content)) {
    failures.push(`${label} contains secrets-like pattern`);
  }
}

// llms.txt is no longer synced from the backend — it is generated from the website catalog SSOT
// (app/llms.txt/route.ts). The former "public/llms.txt === feature-engine llms.txt" assertion is
// intentionally removed; the single source is now the website.

if (failures.length > 0) {
  console.error("check:dataset-factory-docs failed");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("check:dataset-factory-docs passed");
