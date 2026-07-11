import { PLATFORM_LIMITATIONS } from "@/src/components/docs/api-coverage-and-limits";
import { introductionLlmsMarkdown } from "@/src/components/docs/docs-landing-content";
import { authenticationLlmsMarkdown, quickStartLlmsMarkdown } from "@/src/content/docs-guide-content";
import { siteConfig } from "@/src/config/site";
import { datasetCoverageTable } from "@/src/content/coverage-facts";
import { datasetSeoEntries } from "@/src/content/datasets";
import { docsPages, type ApiReferenceContent, type DocsPageEntry } from "@/src/content/docs-pages";

// /llms-full.txt is generated from the docs SOURCE (docs-pages.ts + the guide components +
// datasetSeoEntries + coverage-facts) — never hand-maintained. It is COMPLETE: dataset catalog +
// every guide page + every API endpoint page (endpoint, params, response fields, coverage,
// limitations). Numbers come from the verified coverage SSOT; unknown fields render "coming".

const COMING = "coming";

function resolveApi(entry: DocsPageEntry): ApiReferenceContent | null {
  return entry.apiReference ?? entry.apiReferenceFactory?.() ?? null;
}

function coverageLine(slug: string): string {
  const c = datasetCoverageTable[slug];
  const delisted = c?.includesDelisted === true ? "✓" : c?.includesDelisted === false ? "—" : COMING;
  return `覆蓋：標的數 ${c?.instruments ?? COMING}；起始年 ${c?.startYear ?? COMING}；更新時點 ${c?.updateTiming ?? COMING}；含已下市 ${delisted}`;
}

// Full text for the three component-rendered guide pages (introduction/quick-start/authentication).
const COMPONENT_GUIDE_TEXT: Record<string, () => string> = {
  "/docs/introduction": introductionLlmsMarkdown,
  "/docs/quick-start": quickStartLlmsMarkdown,
  "/docs/authentication": authenticationLlmsMarkdown,
};

function renderGuidePage(entry: DocsPageEntry): string[] {
  const lines: string[] = [`### ${entry.title}`];
  if (entry.subtitle) lines.push(entry.subtitle);
  lines.push("");

  const custom = COMPONENT_GUIDE_TEXT[entry.href];
  if (custom) {
    lines.push(custom());
  } else {
    for (const section of entry.sections) {
      if (section.label) lines.push(`#### ${section.label}`);
      for (const paragraph of section.paragraphs ?? []) lines.push(paragraph);
      for (const bullet of section.bullets ?? []) lines.push(`- ${bullet}`);
    }
  }
  lines.push("");
  return lines;
}

function renderApiPage(entry: DocsPageEntry, api: ApiReferenceContent): string[] {
  const slug = entry.slug[entry.slug.length - 1];
  const lines: string[] = [`### ${api.method} ${api.endpoint} — ${entry.title}`];
  if (entry.subtitle) lines.push(entry.subtitle);
  for (const paragraph of api.overview ?? []) lines.push(paragraph);
  lines.push(coverageLine(slug));

  if (api.queryParameters?.length) {
    lines.push("Query parameters:");
    for (const q of api.queryParameters) {
      lines.push(`- ${q.name} (${q.type}${q.required ? ", required" : ""}) — ${q.description}`);
    }
  }
  if (api.responseFields?.length) {
    lines.push("Response fields:");
    for (const f of api.responseFields) lines.push(`- ${f.path} (${f.type}) — ${f.description}`);
  }
  lines.push("限制與注意：");
  for (const limit of PLATFORM_LIMITATIONS) lines.push(`- ${limit}`);
  for (const note of api.notes ?? []) lines.push(`備註：${note}`);
  lines.push("");
  return lines;
}

export function buildLlmsFullText(): string {
  const out: string[] = [
    `# ${siteConfig.name} — Full documentation (llms-full.txt)`,
    `> ${siteConfig.description}`,
    "> not_investment_advice=true；資料有缺如實標記、絕不以推測值補洞；TWSE-first，不宣稱 full-market。",
    "> 本檔由 docs 源自動生成（禁手維護）。中文為主，術語保留英文。",
    "",
    "## 資料集目錄 (Dataset catalog)",
    ...datasetSeoEntries.map((d) => `- ${d.name} (${d.slug}) — ${d.shortDescription} · docs: ${d.docsHref}`),
    "",
    "## 指南 (Guides)",
  ];

  // Guide pages = overview-category pages without an API reference (introduction/quick-start/
  // authentication/source-policy/data-provenance/api-model/tools-and-mcp/workflows...).
  const guidePages = docsPages.filter(
    (page) => page.tier === "complete" && page.category === "overview" && !resolveApi(page),
  );
  for (const page of guidePages) out.push(...renderGuidePage(page));

  out.push("## API 端點 (Endpoints)");
  const apiPages = docsPages.filter((page) => page.tier === "complete" && resolveApi(page));
  for (const page of apiPages) {
    const api = resolveApi(page);
    if (api) out.push(...renderApiPage(page, api));
  }

  return `${out.join("\n")}\n`;
}
