import { DOCS_DATASET_CATALOG } from "@/src/content/docs/dataset-catalog";
import { VERIFIED_DATASET_PARAMS } from "@/src/content/docs/verified-request-examples";
import { datasetSeoEntries } from "@/src/content/datasets";

// Hardcoded production origin (mirrors llms-full.txt) so the agent index carries real URLs regardless
// of the build-time NEXT_PUBLIC_SITE_URL (which is localhost in local builds).
const ORIGIN = "https://twmarketdata.com";

// /llms.txt is now GENERATED from the storefront's own SSOT (the dataset catalog + the verified-params
// fixture), at build time — the same single-source model as /llms-full.txt. It is no longer a static
// file synced from the backend: the website owns its public agent index, so it can never drift from what
// the site actually sells (61 datasets, real slugs, real grades, real URLs). A dataset that is verified
// against a live key (present in VERIFIED_DATASET_PARAMS) is marked production_ready=true.

const KEYED_VERIFIED = new Set(Object.keys(VERIFIED_DATASET_PARAMS));
const SEO_PAGE_SLUGS = new Set(datasetSeoEntries.map((d) => d.slug));

// Prefer the /datasets/<slug> SEO page where it exists; otherwise the /docs reference page (which
// exists for every catalog slug) — so no link in the index is a 404.
function datasetUrl(slug: string, domain: string): string {
  return SEO_PAGE_SLUGS.has(slug)
    ? `${ORIGIN}/en/datasets/${slug}`
    : `${ORIGIN}/en/docs/api/${domain}/${slug}`;
}

// /llms.txt follows the llmstxt.org spec: an H1 title, a blockquote summary, optional prose, then
// `##` sections whose bullets are `[title](url): notes` links. Generated from the catalog SSOT so it
// can never drift from what the site sells.
export function buildLlmsText(): string {
  const lines: string[] = [];
  lines.push("# TW Market Data");
  lines.push("");
  lines.push(
    "> Machine-readable index of Taiwan (TWSE / TPEx / TAIFEX / MOPS) market datasets for AI agents — official-sourced, coverage-honest and point-in-time safe. Not investment advice.",
  );
  lines.push("");
  lines.push(
    `Rules: no buy / sell / target-price recommendation; data gaps and unknowns are preserved, never invented. Grades are verified | derived | reference | building; production_ready=true means the dataset is verified serving against a live key. This index is generated from the storefront catalog (${DOCS_DATASET_CATALOG.length} datasets), so it always matches what the site sells.`,
  );
  lines.push("");
  lines.push("## API");
  lines.push("");
  lines.push(`- [OpenAPI spec (JSON)](${ORIGIN}/openapi.json): all dataset endpoints`);
  lines.push(`- [OpenAPI spec (YAML)](${ORIGIN}/openapi.yaml): same spec, YAML`);
  lines.push(`- [Documentation](${ORIGIN}/docs): guides and per-dataset reference`);
  lines.push(`- [Full docs bundle](${ORIGIN}/llms-full.txt): every guide + endpoint page in one file`);
  lines.push("");
  lines.push("## Datasets");
  lines.push("");
  for (const d of DOCS_DATASET_CATALOG) {
    const pr = KEYED_VERIFIED.has(d.slug) ? "true" : "false";
    lines.push(
      `- [${d.en}](${datasetUrl(d.slug, d.domain)}): id=${d.slug}; grade=${d.grade}; production_ready=${pr}; route=/v2/datasets/${d.slug}`,
    );
  }
  lines.push("");
  return lines.join("\n") + "\n";
}
