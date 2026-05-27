import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const SOURCE_MANIFEST = "/Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/dataset_website_sync_manifest.json";

const REQUIRED_ROUTES = [
  "/docs/api/dataset-factory",
  "/docs/api/dataset-factory/institutional-flow",
  "/docs/api/dataset-factory/technical-indicators",
  "/docs/api/dataset-factory/valuation-data",
  "/docs/api/dataset-factory/income-statement",
  "/docs/api/dataset-factory/balance-sheet",
  "/docs/api/dataset-factory/cash-flow",
];

const REQUIRED_DATASET_IDS = [
  "balance_sheet",
  "cash_flow",
  "income_statement",
  "institutional_flow",
  "technical_indicators",
  "valuation_data",
];

const FORBIDDEN_TERMS = [
  "production ready",
  "complete coverage",
  "guaranteed freshness",
  "buy/sell",
  "buy signal",
  "sell signal",
  "target price",
  "recommendation",
];

const failures = [];

function requireFile(path) {
  if (!existsSync(path)) {
    failures.push(`missing file: ${path}`);
    return "";
  }
  return readFileSync(path, "utf8");
}

function requireContains(content, needle, contextLabel) {
  if (!content.includes(needle)) {
    failures.push(`${contextLabel} missing: ${needle}`);
  }
}

function extractSection(content, header) {
  const start = content.indexOf(header);
  if (start < 0) return "";
  const tail = content.slice(start + header.length);
  const nextHeaderMatch = tail.match(/\n##\s|\n###\s/);
  if (!nextHeaderMatch || nextHeaderMatch.index === undefined) return tail;
  return tail.slice(0, nextHeaderMatch.index);
}

function ensureForbiddenAbsent(section, label) {
  const normalized = section.toLowerCase();
  for (const term of FORBIDDEN_TERMS) {
    if (normalized.includes(term)) {
      failures.push(`${label} contains forbidden term: ${term}`);
    }
  }
}

const docsPagesPath = resolve(ROOT, "src/content/docs-pages.ts");
const docsSidebarPath = resolve(ROOT, "src/content/docs-sidebar.ts");
const llmsPath = resolve(ROOT, "public/llms.txt");
const llmsFullPath = resolve(ROOT, "public/llms-full.txt");

const docsPages = requireFile(docsPagesPath);
const docsSidebar = requireFile(docsSidebarPath);
const llms = requireFile(llmsPath);
const llmsFull = requireFile(llmsFullPath);

for (const route of REQUIRED_ROUTES) {
  requireContains(docsPages, route, "docs-pages route");
  requireContains(docsSidebar, route, "docs-sidebar route");
}

for (const datasetId of REQUIRED_DATASET_IDS) {
  requireContains(llms, datasetId, "llms dataset id");
  requireContains(llmsFull, datasetId, "llms-full dataset id");
}

const llmsPreviewSection = extractSection(llms, "## Dataset Factory Preview Docs");
if (!llmsPreviewSection.trim()) {
  failures.push("llms preview section missing");
} else {
  requireContains(llmsPreviewSection, "production_ready=false", "llms preview section");
  requireContains(llmsPreviewSection, "data_gaps", "llms preview section");
  ensureForbiddenAbsent(llmsPreviewSection, "llms preview section");
}

const llmsFullPreviewSection = extractSection(llmsFull, "### Dataset Factory (Preview / Private Beta Docs)");
if (!llmsFullPreviewSection.trim()) {
  failures.push("llms-full preview section missing");
} else {
  requireContains(llmsFullPreviewSection, "production_ready=false", "llms-full preview section");
  requireContains(llmsFullPreviewSection, "not_investment_advice", "llms-full preview section");
  requireContains(llmsFullPreviewSection, "data_gaps", "llms-full preview section");
  ensureForbiddenAbsent(llmsFullPreviewSection, "llms-full preview section");
}

const datasetTopicBlocks = [
  "dataset_factory_balance_sheet",
  "dataset_factory_cash_flow",
  "dataset_factory_income_statement",
  "dataset_factory_institutional_flow",
  "dataset_factory_technical_indicators",
  "dataset_factory_valuation_data",
];

for (const topicId of datasetTopicBlocks) {
  const idx = docsPages.indexOf(`topic.topicId === \"${topicId}\"`);
  if (idx < 0) {
    failures.push(`docs-pages topic block missing: ${topicId}`);
    continue;
  }
  const snippet = docsPages.slice(idx, idx + 2200);
  requireContains(snippet, "production_ready：false", `topic block ${topicId}`);
  requireContains(snippet, "not_investment_advice：true", `topic block ${topicId}`);
  requireContains(snippet, "data_gaps", `topic block ${topicId}`);
  ensureForbiddenAbsent(snippet, `topic block ${topicId}`);
}

const secretsLikePattern = /(database_url\s*=|mops_news_production_database_url\s*=|sk-[A-Za-z0-9]{20,})/i;
for (const [label, content] of [
  ["docs-pages", docsPages],
  ["docs-sidebar", docsSidebar],
  ["llms", llms],
  ["llms-full", llmsFull],
]) {
  if (secretsLikePattern.test(content)) {
    failures.push(`${label} contains secrets-like pattern`);
  }
}

if (existsSync(SOURCE_MANIFEST)) {
  try {
    const manifest = JSON.parse(readFileSync(SOURCE_MANIFEST, "utf8"));
    const manifestRoutes = new Set((manifest.dataset_docs ?? []).map((item) => item.website_target_route));
    for (const route of REQUIRED_ROUTES.slice(1)) {
      if (!manifestRoutes.has(route)) {
        failures.push(`source manifest missing route mapping: ${route}`);
      }
    }
    const overviewRoute = manifest.overview_doc?.website_target_route;
    if (overviewRoute !== REQUIRED_ROUTES[0]) {
      failures.push(`source manifest overview route mismatch: ${overviewRoute ?? "missing"}`);
    }
  } catch {
    failures.push("source manifest parse failed");
  }
}

if (failures.length > 0) {
  console.error("check:dataset-factory-docs failed");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("check:dataset-factory-docs passed");
