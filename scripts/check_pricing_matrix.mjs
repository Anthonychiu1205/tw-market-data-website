#!/usr/bin/env node
// PRICING-SSOT anti-drift guard (PRICING-RETIER-V2).
//
// The canonical per-dataset tier lives in the BACKEND and is exported as
// docs/coverage/PRICING_RETIER_V2_MATRIX.json, vendored here at
// src/content/pricing/retier-v2-matrix.json. This guard fails the build if the website's
// `requiredPlan` (src/lib/gateway/dataset-policies.ts) disagrees with that matrix for any slug.
//
// This is the fix for the dual-SSOT drift the pricing audit found: before this, `requiredPlan` was a
// hand-maintained second copy that nobody compared to the backend. Now the matrix is the authority and
// any divergence is a build failure. `creditsCost` stays website-owned and is NOT checked here.
//
// To re-sync after a backend re-tier: re-vendor the matrix JSON, then update dataset-policies to match
// (this guard tells you exactly which slugs differ).

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Website slugs that are NOT in the backend matrix (the 168 ENDPOINT_REGISTRY datasets). Each needs an
// owner/backend decision before it can be guarded; until then it is exempted WITH A REASON so the gap
// is visible rather than silently passing. Do not add to this list to dodge a real mismatch.
const NOT_IN_MATRIX = {
  // Backend now lists market_snapshot with after="absent" + "dead inventory — no live backing table;
  // not for sale". It is exempted here (kept at free, not charged) but SHOULD BE DELISTED — see the
  // "not for sale" handling below. Tracked for owner: remove the slug from this SSOT.
  "market-snapshot": "Backend marks it dead inventory / not for sale (matrix after=absent). DELIST pending owner.",
  "institutional-flow-market-aggregate": "Derived aggregate view; not listed as its own id in the retier matrix. Needs a canonical tier from the backend.",
};

// Matrix entries the backend explicitly marks as not-sellable. A website slug pointing at one of these
// must be delisted, not priced — surfaced distinctly so it is not mistaken for a tier mismatch.
const NOT_FOR_SALE = new Set(["absent"]);

const matrix = JSON.parse(readFileSync(join(root, "src/content/pricing/retier-v2-matrix.json"), "utf8"));
const canonical = new Map(matrix.matrix.map((r) => [r.dataset_id, r.after]));

const policiesSrc = readFileSync(join(root, "src/lib/gateway/dataset-policies.ts"), "utf8");
const website = [...policiesSrc.matchAll(/"([a-z0-9-]+)":\s*\{[^}]*requiredPlan:\s*"(\w+)"/g)].map((m) => ({
  slug: m[1],
  requiredPlan: m[2],
}));

const mismatches = [];
const exemptedSeen = new Set();

for (const { slug, requiredPlan } of website) {
  const id = slug.replace(/-/g, "_");
  const want = canonical.get(id);
  if (want === undefined || NOT_FOR_SALE.has(want)) {
    if (slug in NOT_IN_MATRIX) {
      exemptedSeen.add(slug);
      continue;
    }
    const why = NOT_FOR_SALE.has(want)
      ? `backend marks it not-for-sale (after="${want}") — delist it, do not price it`
      : "not found in the retier matrix and not in the documented exemption list";
    mismatches.push(`${slug}: ${why}`);
    continue;
  }
  if (want !== requiredPlan) {
    mismatches.push(`${slug}: website requiredPlan="${requiredPlan}" but matrix says "${want}"`);
  }
}

// A slug removed from the exemption list but still absent from the matrix should re-surface, not vanish.
for (const slug of Object.keys(NOT_IN_MATRIX)) {
  if (!website.some((w) => w.slug === slug)) {
    console.warn(`[pricing-matrix] note: exempted slug "${slug}" is no longer in dataset-policies (stale exemption?)`);
  }
}

if (mismatches.length > 0) {
  console.error(`[pricing-matrix] FAIL — ${mismatches.length} slug(s) disagree with ${matrix.spec}:`);
  for (const m of mismatches) console.error(`  - ${m}`);
  console.error("\nThe backend matrix is canonical. Re-vendor src/content/pricing/retier-v2-matrix.json");
  console.error("and align src/lib/gateway/dataset-policies.ts requiredPlan to the values above.");
  process.exit(1);
}

console.error(
  `[pricing-matrix] OK — ${website.length} website slug(s) match ${matrix.spec}` +
    ` (${exemptedSeen.size} exempted as not-in-matrix, documented).`,
);
