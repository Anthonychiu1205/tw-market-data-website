#!/usr/bin/env node
// I18N-FIX-06 data-layer guard (generalized from the news-only check_news_en_cjk.mjs of #99).
//
// Several homepage demo/agent-workflow panels render CLIENT-SIDE (ssr:false), so scripts/check_en_no_cjk.mjs
// (which scans the server-rendered /en HTML) can't see them — that's exactly how zh sample data slipped
// onto /en past every prior HTML guard (the filings agent demo, I18N-FIX-06). Fix: each demo sample is
// localized by locale via `{ en, zh }` maps and the /en side reads `.en`. This guard asserts every
// English-facing demo sample is CJK-free at the DATA layer:
//   1. The committed snapshot data/market-marquee-snapshot.json `news[]` passes through to /en verbatim
//      (asView can't tell a stored sample from real news) → must be empty OR English.
//   2. Every `en:` value in the demo `{ en, zh }` maps below — string, array, or array-of-objects — must
//      be CJK-free. The paired `zh:` values and zh object KEYS (e.g. index-names lookup keys) are NOT
//      scanned; they legitimately hold Chinese and never render on /en.
//   3. The TICKER_EN_NAME record values (English display names) must be CJK-free.
// Any CJK in what /en can output → exit 1 (fails the build).
//
// Self-test: put a Chinese character in any `.en` value (or the snapshot news) and this must exit 1.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// CJK ideographs + kana + fullwidth forms.
const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/;
const problems = [];

// Strip block comments and full-line // comments so a stray `en:` in prose isn't scanned. (Full-line
// only, to avoid mangling `https://` inside string values.)
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

// Read the JS value starting at `i` (first non-space char): a string literal, an array/object literal
// (bracket-balanced, quote-aware), or a bare token up to , } ; or newline. Returns { value, end }.
function readValue(src, i) {
  while (i < src.length && /\s/.test(src[i])) i += 1;
  const ch = src[i];
  if (ch === '"' || ch === "'" || ch === "`") {
    let j = i + 1;
    while (j < src.length) {
      if (src[j] === "\\") { j += 2; continue; }
      if (src[j] === ch) { j += 1; break; }
      j += 1;
    }
    return { value: src.slice(i, j), end: j };
  }
  if (ch === "[" || ch === "{") {
    const open = ch, close = ch === "[" ? "]" : "}";
    let depth = 0, j = i, str = null;
    for (; j < src.length; j += 1) {
      const c = src[j];
      if (str) {
        if (c === "\\") { j += 1; continue; }
        if (c === str) str = null;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") { str = c; continue; }
      if (c === open) depth += 1;
      else if (c === close) { depth -= 1; if (depth === 0) { j += 1; break; } }
    }
    return { value: src.slice(i, j), end: j };
  }
  let j = i;
  while (j < src.length && !",};\n".includes(src[j])) j += 1;
  return { value: src.slice(i, j).trim(), end: j };
}

// 1) committed snapshot news must be empty or CJK-free (it passes through to /en verbatim).
try {
  const snap = JSON.parse(readFileSync(join(root, "data", "market-marquee-snapshot.json"), "utf8"));
  for (const n of snap.news ?? []) {
    for (const field of ["title", "category"]) {
      if (typeof n[field] === "string" && CJK.test(n[field])) {
        problems.push(`data/market-marquee-snapshot.json news[].${field}: "${n[field]}" — baked zh news leaks to /en; keep news empty (view-only localized fallback) or use English.`);
      }
    }
  }
} catch (e) {
  problems.push(`could not read data/market-marquee-snapshot.json: ${e.message}`);
}

// 2) every `en:` value across the demo `{ en, zh }` maps must be CJK-free.
const EN_KEY_FILES = [
  "src/lib/homepage/demo-real-data.ts",       // apiDemo / coverage / source-of-truth labels + prompts
  "src/lib/homepage/index-names.ts",          // INDEX_NAME_I18N (marquee index names)
  "src/lib/market-marquee-snapshot.ts",       // CURATED_FALLBACK_NEWS_I18N (news fallback sample)
  "src/components/home/agent-documents-demo.tsx", // filings agent demo (I18N-FIX-06)
];
for (const rel of EN_KEY_FILES) {
  try {
    const src = stripComments(readFileSync(join(root, rel), "utf8"));
    for (const m of src.matchAll(/(?:^|[{,\s])en\s*:/g)) {
      const { value } = readValue(src, m.index + m[0].length);
      if (CJK.test(value)) {
        const snippet = value.length > 80 ? value.slice(0, 80) + "…" : value;
        problems.push(`${rel} en: ${snippet} contains CJK — the English demo sample must be English (semantic rewrite, not zh).`);
      }
    }
  } catch (e) {
    problems.push(`could not read ${rel}: ${e.message}`);
  }
}

// 3) TICKER_EN_NAME record values (English display names) must be CJK-free.
try {
  const rel = "src/lib/homepage/ticker-names.ts";
  const src = stripComments(readFileSync(join(root, rel), "utf8"));
  const marker = src.indexOf("TICKER_EN_NAME");
  const eq = marker >= 0 ? src.indexOf("=", marker) : -1;
  if (eq >= 0) {
    const { value } = readValue(src, eq + 1);
    if (CJK.test(value)) {
      problems.push(`${rel} TICKER_EN_NAME record contains CJK — English display names must be English, never the zh company name.`);
    }
  } else {
    problems.push(`could not locate TICKER_EN_NAME in ${rel}`);
  }
} catch (e) {
  problems.push(`could not read src/lib/homepage/ticker-names.ts: ${e.message}`);
}

if (problems.length) {
  console.error("[demo-en-cjk] FAIL — Chinese in /en-facing demo data:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.error("[demo-en-cjk] OK — /en demo data is CJK-free (snapshot news + all en: sample values + TICKER_EN_NAME).");
