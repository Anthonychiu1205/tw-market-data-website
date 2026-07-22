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

export function buildLlmsText(): string {
  const lines: string[] = [];
  lines.push("Dataset Factory (machine-readable index)");
  lines.push("not_investment_advice=true");
  lines.push("rule:no_buy_sell_target_price_recommendation");
  lines.push("rule:preserve_data_gaps_and_unknowns");
  lines.push("");
  lines.push(`openapi=${ORIGIN}/openapi.json`);
  lines.push(`openapi_yaml=${ORIGIN}/openapi.yaml`);
  lines.push(`docs=${ORIGIN}/docs`);
  lines.push(`llms_full=${ORIGIN}/llms-full.txt`);
  lines.push("");
  lines.push("# Generated at build time from the storefront catalog SSOT (grade + keyed-verified), so");
  lines.push("# this index can never drift from what the site sells. grade ∈ verified|derived|reference|");
  lines.push("# building. production_ready=true means the dataset is verified serving against a live key.");
  lines.push(`allowed_dataset_ids: ${DOCS_DATASET_CATALOG.length}`);
  for (const d of DOCS_DATASET_CATALOG) {
    lines.push(`- ${d.slug}`);
  }
  lines.push("");
  lines.push("datasets:");
  for (const d of DOCS_DATASET_CATALOG) {
    const pr = KEYED_VERIFIED.has(d.slug) ? "true" : "false";
    lines.push(
      `- id=${d.slug}; grade=${d.grade}; production_ready=${pr}; route=/v2/datasets/${d.slug}; page=${datasetUrl(d.slug, d.domain)}`,
    );
  }
  lines.push("");
  return lines.join("\n") + "\n";
}
