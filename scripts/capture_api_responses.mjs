#!/usr/bin/env node
// DOCS-CAPTURE-01 — capture REAL read-API responses for the docs dataset pages.
//
// Writes src/content/api-captures.ts from responses the API actually returned. Nothing is authored
// here: a dataset that does not answer 200 is left out of the map entirely, and its docs page keeps
// its honest TODO. That is the whole point — a page must never show an example nobody has observed.
//
// USAGE (the key is read from the environment and is never written to disk):
//   TWMD_API_KEY=sk_live_... node scripts/capture_api_responses.mjs
//   TWMD_API_KEY=sk_live_... node scripts/capture_api_responses.mjs --dry-run   # report only
//
// The key must NOT be committed. This script reads process.env only, prints no key material, and
// the generated file contains no credentials.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://api.twmarketdata.com";
const OUT = join(root, "src/content/api-captures.ts");
const DRY_RUN = process.argv.includes("--dry-run");

const API_KEY = process.env.TWMD_API_KEY;
if (!API_KEY) {
  console.error("TWMD_API_KEY is not set. Export it in your shell; do not put it in a file.");
  process.exit(2);
}

// CJK anywhere in a string VALUE means the /en page needs a masked variant, or the docs CJK guard
// (which scans rendered /en HTML) fails the build.
const CJK = /[　-〿぀-ヿ㐀-䶿一-鿿＀-￯]/;
const MASK = "<Chinese value - see the zh page>";
const ROW_KEYS = ["data", "rows", "items"];

// Parameter sets tried in order. Datasets differ in what they require; a 422 on one shape may still
// succeed on another, so we try progressively narrower/wider shapes rather than assuming one API.
// 2330 is TWSE-listed, so a TPEx-only dataset answers 200 with an EMPTY row array for it; 6488 is a
// real TPEx ticker and is tried next. Some datasets name the parameter `ticker` rather than `symbol`
// (they answer 422 "ticker: Field required"), so both spellings are attempted.
// limit=50 is for FIELD DETECTION, not for the page: the stored example is trimmed to 2 rows, but a
// sparse column (e.g. security-master.industry_category, populated in ~2.6% of rows) would look like a
// phantom if only 2 rows were inspected. The larger sample is the anti-false-positive measure.
const FIELD_SAMPLE_LIMIT = 50;
const PARAM_ATTEMPTS = [
  `?symbol=2330&limit=${FIELD_SAMPLE_LIMIT}`,
  `?ticker=2330&limit=${FIELD_SAMPLE_LIMIT}`,
  `?symbol=6488&limit=${FIELD_SAMPLE_LIMIT}`,
  `?ticker=6488&limit=${FIELD_SAMPLE_LIMIT}`,
  `?limit=${FIELD_SAMPLE_LIMIT}`,
  "",
  "?symbol=2330",
];

// ── Ghost-field detection ───────────────────────────────────────────────────────────────────────
// Each docs page DECLARES a field table (`fields: [...]` in src/content/docs/dataset-pages.ts). Those
// tables were hand-written before anything was captured, so some describe fields the API does not
// actually return ("ghost fields") and miss fields it does. Since we are already calling every
// endpoint, diff the two while we are here.
//
// dataset-pages.ts is TypeScript with `@/` alias imports, so it cannot be imported from plain node —
// the declarations are extracted textually instead. A parse miss shows up as an empty declared-set
// (reported as "declared: 0"), never as a wrong diff.
function readDeclaredFields() {
  const src = readFileSync(join(root, "src/content/docs/dataset-pages.ts"), "utf8");
  const declared = new Map();
  const entryRe = /\n {2}"([a-z0-9-]+)":\s*\{/g;
  const entries = [...src.matchAll(entryRe)];

  entries.forEach((m, idx) => {
    const slug = m[1];
    const blockEnd = idx + 1 < entries.length ? entries[idx + 1].index : src.length;
    const start = src.indexOf("fields: [", m.index);
    if (start === -1 || start > blockEnd) return;

    // Walk to the matching ] so the `params:` array further down is never scooped up.
    let depth = 0;
    let i = start + "fields: ".length;
    for (; i < src.length; i += 1) {
      if (src[i] === "[") depth += 1;
      else if (src[i] === "]" && --depth === 0) break;
    }
    declared.set(slug, [...src.slice(start, i).matchAll(/name:\s*"([^"]+)"/g)].map((f) => f[1]));
  });
  return declared;
}

// Field presence, collected with three anti-false-positive rules the backend learned the hard way:
//
//   1. ANY DEPTH. Keys are collected recursively, so a field living inside a nested object
//      (lineage.source_family, fundamentals_context.*) is not reported as missing just because it is
//      not at the row's top level.
//   2. ENVELOPE INCLUDED. The envelope's own keys count as present, so envelope-level fields
//      (not_investment_advice, data_gaps, lineage) documented in a page's field table are not phantoms.
//   3. NULL IS NOT ABSENT. Presence is judged by the KEY existing, never by its value. A serializer
//      emitting `null` still proves the field exists. Fields that are present but null in every
//      sampled row are reported separately as "always-null" — informational, never phantom.
//
// Returns { present:Set, nullOnly:Set }.
function collectFieldPresence(parsedBody) {
  const seen = new Map(); // key -> { nonNull: boolean }

  function walk(value) {
    if (Array.isArray(value)) {
      for (const v of value) walk(v);
      return;
    }
    if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) {
        const entry = seen.get(k) ?? { nonNull: false };
        if (v !== null && v !== undefined) entry.nonNull = true;
        seen.set(k, entry);
        walk(v);
      }
    }
  }

  walk(parsedBody); // rule 1 + rule 2: whole envelope, all depths
  return {
    present: new Set(seen.keys()),
    nullOnly: new Set([...seen.entries()].filter(([, v]) => !v.nonNull).map(([k]) => k)),
  };
}

// Find the row array. The API has (at least) two envelope shapes: a FLAT one with a top-level
// data/rows/items array, and a NESTED one where the rows live under `envelope`. Both are checked, and
// the DOTTED PATH ("data" or "envelope.data") is returned so snippets can access it correctly. Only a
// NON-EMPTY array counts — a 200 with rows_returned:0 documents nothing and must fall through to an
// honest TODO, never be shown as a real example (rule 2).
function findRows(obj) {
  for (const k of ROW_KEYS) {
    if (Array.isArray(obj[k]) && obj[k].length > 0) return { path: k, rows: obj[k] };
  }
  const env = obj.envelope;
  if (env && typeof env === "object" && !Array.isArray(env)) {
    for (const k of ROW_KEYS) {
      if (Array.isArray(env[k]) && env[k].length > 0) return { path: `envelope.${k}`, rows: env[k] };
    }
  }
  return null;
}

function readSlugs() {
  const src = readFileSync(join(root, "src/lib/gateway/dataset-policies.ts"), "utf8");
  const slugs = [...src.matchAll(/datasetSlug: "([a-z0-9-]+)"/g)].map((m) => m[1]);
  const paths = [...src.matchAll(/backendPath: "([^"]+)"/g)].map((m) => m[1]);
  if (slugs.length !== paths.length) throw new Error("slug/path count mismatch in the billing SSOT");
  return slugs.map((slug, i) => ({ slug, path: paths[i] }));
}

function trim(value, key = "") {
  if (Array.isArray(value)) {
    const cap = ROW_KEYS.includes(key) ? 2 : 3;
    return value.slice(0, cap).map((v) => trim(v, key));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, trim(v, k)]));
  }
  return value;
}

function mask(value) {
  if (Array.isArray(value)) return value.map(mask);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mask(v)]));
  }
  return typeof value === "string" && CJK.test(value) ? MASK : value;
}

async function attempt(url) {
  try {
    const res = await fetch(url, { headers: { "X-API-Key": API_KEY, Accept: "application/json" } });
    const text = await res.text();
    return { status: res.status, text };
  } catch (error) {
    return { status: 0, text: String(error?.message ?? error) };
  }
}

async function capture({ slug, path }) {
  let last = { status: 0, text: "" };
  for (const query of PARAM_ATTEMPTS) {
    const res = await attempt(`${BASE}${path}${query}`);
    last = res;
    if (res.status !== 200) continue;

    let parsed;
    try {
      parsed = JSON.parse(res.text);
    } catch {
      continue; // a 200 that is not JSON is not a usable example
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;

    const found = findRows(parsed);
    // No non-empty row array anywhere (flat OR nested) → not a usable example. Record why and try the
    // next param shape; if every shape is empty, this dataset ends up as an honest TODO.
    if (!found) {
      const rr =
        (parsed.meta && parsed.meta.rows_returned) ??
        (parsed.envelope && parsed.envelope.meta && parsed.envelope.meta.rows_returned);
      last = { status: 200, text: rr === 0 ? "200 but rows_returned=0 (empty)" : "200 but no non-empty row array" };
      continue;
    }

    const trimmed = trim(parsed);
    const rowsKey = found.path; // "data" | "rows" | "items" | "envelope.data" | …
    const zh = JSON.stringify(trimmed, null, 2);
    const masked = JSON.stringify(mask(trimmed), null, 2);
    if (CJK.test(masked)) throw new Error(`${slug}: CJK survived masking (a KEY may be Chinese)`);

    const presence = collectFieldPresence(parsed); // parsed, NOT trimmed — full sample
    return {
      slug, ok: true, query, rowsKey, zh,
      en: masked === zh ? null : masked,
      present: [...presence.present],
      nullOnly: [...presence.nullOnly],
      rowsSampled: found.rows.length,
    };
  }

  let reason = `HTTP ${last.status}`;
  try {
    const body = JSON.parse(last.text);
    if (body?.error) reason += ` ${typeof body.error === "string" ? body.error : body.error.code}`;
  } catch {
    if (last.status === 200) reason = last.text;
    else if (last.status === 0) reason = `connection failed`;
  }
  return { slug, ok: false, reason };
}

function lit(s) {
  return "`" + s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function render(captures, capturedAt) {
  const entries = captures
    .map((c) => {
      const rowsKey = c.rowsKey ? `"${c.rowsKey}"` : "null";
      const envelopeKeys = JSON.stringify(Object.keys(JSON.parse(c.zh)).sort());
      let body = `  "${c.slug}": {\n    rowsKey: ${rowsKey},\n    envelopeKeys: ${envelopeKeys},\n    zh: ${lit(c.zh)},\n`;
      if (c.en) body += `    en: ${lit(c.en)},\n`;
      return body + "  },";
    })
    .join("\n");

  return `// REAL captured 200 responses from the public read API, one per dataset. GENERATED by
// scripts/capture_api_responses.mjs — do not hand-edit; re-run the script instead.
//
// WHY PER-DATASET AND NOT ONE TEMPLATE (this is the whole point of this file):
// the envelope is NOT uniform. The row array is \`data\`, \`rows\` or \`items\` depending on the dataset,
// and provenance differs too — some datasets expose a singular top-level \`source_role\`, others a
// plural \`lineage.source_roles\`. None of that is normalized here: each dataset shows its own real
// shape, because normalizing would be inventing a contract the API does not honour.
//
// A dataset ABSENT from this map did not return a usable 200 (no entitlement, no route, unknown
// required parameters, or an empty row array). Its docs page must show an honest TODO — never a
// templated body.
//
// zh  = the captured body, verbatim (see TRIM below).
// en  = present only when the captured body contains Chinese DATA VALUES. It is the same JSON with
//       those values replaced by a marker, so /en stays CJK-free without inventing English data the
//       API never returned. When absent, the body is already ASCII and \`zh\` serves both locales.
//
// TRIM: row arrays are capped at 2 entries and other arrays at 3, purely for page length. Keys,
// nesting, types and values are otherwise untouched.

export type ApiCapture = {
  // The key holding the row array in THIS dataset's envelope: "data" | "rows" | "items", or null when
  // the response has no row array at all. Never assume one dataset's key applies to another.
  rowsKey: string | null;
  envelopeKeys: string[];
  zh: string;
  en?: string;
};

export const API_CAPTURED_AT = "${capturedAt}";

export const API_CAPTURES: Record<string, ApiCapture> = {
${entries}
};

export function getApiCapture(slug: string): ApiCapture | null {
  return API_CAPTURES[slug] ?? null;
}

// The captured body for a locale. /en falls back to the zh body only when that body is already
// CJK-free (no \`en\` variant was needed).
export function apiCaptureBody(capture: ApiCapture, locale: string): string {
  return locale === "en" ? capture.en ?? capture.zh : capture.zh;
}
`;
}

const targets = readSlugs();
console.error(`capturing ${targets.length} datasets from ${BASE} …`);

const results = [];
const CONCURRENCY = 4;
for (let i = 0; i < targets.length; i += CONCURRENCY) {
  const batch = targets.slice(i, i + CONCURRENCY);
  results.push(...(await Promise.all(batch.map(capture))));
  process.stderr.write(`  ${Math.min(i + CONCURRENCY, targets.length)}/${targets.length}\r`);
}

const ok = results.filter((r) => r.ok).sort((a, b) => a.slug.localeCompare(b.slug));
const failed = results.filter((r) => !r.ok).sort((a, b) => a.slug.localeCompare(b.slug));

console.error(`\n\ncaptured ${ok.length} / ${targets.length}`);
console.error(`\nCAPTURED (${ok.length}):`);
for (const r of ok) console.error(`  ${r.slug.padEnd(34)} rowsKey=${String(r.rowsKey).padEnd(6)} ${r.query || "(no params)"}`);
console.error(`\nLEFT AS TODO (${failed.length}):`);
for (const r of failed) console.error(`  ${r.slug.padEnd(34)} ${r.reason}`);

// ── Declared-vs-actual field diff ───────────────────────────────────────────────────────────────
const declaredFields = readDeclaredFields();
const fieldDiff = ok.map((r) => {
  const declared = declaredFields.get(r.slug) ?? [];
  const present = new Set(r.present ?? []);
  return {
    slug: r.slug,
    rowsSampled: r.rowsSampled ?? 0,
    declared: declared.length,
    // PHANTOM: documented but the key never appeared, at any depth, anywhere in the envelope, across
    // the whole sample. Still stated as "not observed in N rows" rather than "does not exist" — with a
    // small sample a genuinely sparse column can hide, so this is a review queue, not an auto-delete.
    phantom: declared.filter((f) => !present.has(f)),
    // Present but null in every sampled row. NOT a phantom — the field exists; it is just unpopulated
    // in this sample. Kept separate precisely so nobody deletes a real sparse column.
    alwaysNull: declared.filter((f) => (r.nullOnly ?? []).includes(f)),
    // Returned but not documented — the page is incomplete rather than wrong.
    undocumented: [...present].filter((f) => !declared.includes(f)),
  };
});

const withGhosts = fieldDiff.filter((d) => d.phantom.length > 0);
const withUndocumented = fieldDiff.filter((d) => d.undocumented.length > 0);
const withNullOnly = fieldDiff.filter((d) => d.alwaysNull.length > 0);

console.error(`\n\n=== FIELD DIFF (declared in docs vs returned by the API) ===`);
console.error(`checked ${fieldDiff.length} captured dataset(s); ${withGhosts.length} have phantom field(s)`);
console.error(`keys matched recursively at any depth, envelope included; null counts as PRESENT\n`);
console.error(`PHANTOM — documented, never seen at any depth in the sample (${withGhosts.length}):`);
if (withGhosts.length === 0) console.error("  none");
for (const d of withGhosts) console.error(`  ${d.slug.padEnd(34)} [${d.rowsSampled} rows] ${d.phantom.join(", ")}`);

console.error(`\nALWAYS-NULL — field EXISTS but unpopulated in the sample; NOT a phantom (${withNullOnly.length}):`);
if (withNullOnly.length === 0) console.error("  none");
for (const d of withNullOnly) console.error(`  ${d.slug.padEnd(34)} ${d.alwaysNull.join(", ")}`);

console.error(`\nUNDOCUMENTED — returned but not in the docs table (${withUndocumented.length}):`);
if (withUndocumented.length === 0) console.error("  none");
for (const d of withUndocumented) console.error(`  ${d.slug.padEnd(34)} ${d.undocumented.join(", ")}`);

const notChecked = failed.map((f) => f.slug);
console.error(`\nNOT CHECKED (no capture, so nothing to compare): ${notChecked.length}`);

const diffOut = process.argv.find((a) => a.startsWith("--diff-out="))?.split("=")[1];
if (diffOut) {
  writeFileSync(diffOut, JSON.stringify({ checkedAt: new Date().toISOString().slice(0, 10), fieldDiff, notChecked }, null, 2));
  console.error(`wrote ${diffOut}`);
}

if (DRY_RUN) {
  console.error("\n--dry-run: nothing written.");
} else {
  const capturedAt = new Date().toISOString().slice(0, 10);
  writeFileSync(OUT, render(ok, capturedAt));
  console.error(`\nwrote ${OUT}`);
}
