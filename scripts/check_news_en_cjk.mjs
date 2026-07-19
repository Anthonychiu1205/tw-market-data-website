#!/usr/bin/env node
// I18N-FIX-05 data-layer guard: the market-news card renders client-side (ssr:false) from a data
// snapshot, so scripts/check_en_no_cjk.mjs (which scans server-rendered HTML) can't see it — that's
// exactly how zh news slipped onto /en past every prior guard. This asserts the news DATA that can
// reach /en is CJK-free:
//   1. The committed snapshot data/market-marquee-snapshot.json `news[]` is passed through to /en
//      as-is (asView can't tell a stored sample from real news), so it must be empty OR English.
//      The sample is a VIEW-ONLY localized fallback (curatedFallbackNews) — it must NOT be baked here.
//   2. The English sample (CURATED_FALLBACK_NEWS_I18N `.en`) must itself be CJK-free.
// Any CJK in what /en can output → exit 1 (fails the build).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// CJK ideographs + kana + fullwidth forms.
const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/;
const problems = [];

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

// 2) the English fallback sample (CURATED_FALLBACK_NEWS_I18N `.en`) must be CJK-free.
try {
  const src = readFileSync(join(root, "src", "lib", "market-marquee-snapshot.ts"), "utf8");
  for (const m of src.matchAll(/\ben:\s*"((?:\\.|[^"\\])*)"/g)) {
    if (CJK.test(m[1])) problems.push(`market-marquee-snapshot.ts CURATED_FALLBACK_NEWS_I18N en: "${m[1]}" contains CJK — the English sample must be English.`);
  }
} catch (e) {
  problems.push(`could not read src/lib/market-marquee-snapshot.ts: ${e.message}`);
}

if (problems.length) {
  console.error("[news-en-cjk] FAIL — Chinese in /en-facing news data:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.error("[news-en-cjk] OK — /en news data is CJK-free (committed snapshot news empty/English + English sample clean).");
