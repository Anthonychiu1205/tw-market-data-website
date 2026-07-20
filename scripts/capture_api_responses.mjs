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
const PARAM_ATTEMPTS = [
  "?symbol=2330&limit=2",
  "?ticker=2330&limit=2",
  "?symbol=6488&limit=2",
  "?ticker=6488&limit=2",
  "?limit=2",
  "",
  "?symbol=2330",
];

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

    const trimmed = trim(parsed);
    const rowsKey = ROW_KEYS.find((k) => Array.isArray(trimmed[k])) ?? null;
    // A 200 with an empty row array documents nothing — treat it as "not captured" rather than
    // shipping an example that shows a reader zero rows.
    if (rowsKey && trimmed[rowsKey].length === 0) {
      last = { status: 200, text: "200 but the row array was empty" };
      continue;
    }

    const zh = JSON.stringify(trimmed, null, 2);
    const masked = JSON.stringify(mask(trimmed), null, 2);
    if (CJK.test(masked)) throw new Error(`${slug}: CJK survived masking (a KEY may be Chinese)`);

    return { slug, ok: true, query, rowsKey, zh, en: masked === zh ? null : masked };
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

if (DRY_RUN) {
  console.error("\n--dry-run: nothing written.");
} else {
  const capturedAt = new Date().toISOString().slice(0, 10);
  writeFileSync(OUT, render(ok, capturedAt));
  console.error(`\nwrote ${OUT}`);
}
