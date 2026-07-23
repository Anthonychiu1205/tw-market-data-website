#!/usr/bin/env node
// Guard against the "zh side is actually English" bug (Wave L building pages shipped with English in the
// zh description/coverage because the registry only had English halves). For every dataset-pages entry,
// the `zh` side of description / coverageTodo must be genuinely Chinese — not a large English sentence
// copied into the zh slot. Heuristic: if a zh string is long enough to be a real sentence and its
// Latin-letters dominate its CJK characters, it is almost certainly untranslated English. Field names and
// short technical tokens (start_date, TWT49U) are fine — the threshold only fires on prose-length English.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/content/docs/dataset-pages.ts"), "utf8");

const CJK = /[㐀-䶿一-鿿]/;
const count = (s, re) => (s.match(re) || []).length;

// Pull the zh string out of `<field>: { en: "...", zh: "..." }` blocks for the fields that are prose.
function zhValues(field) {
  const out = [];
  const re = new RegExp(`${field}:\\s*\\{[^}]*?zh:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g");
  let m;
  while ((m = re.exec(src))) out.push(m[1]);
  return out;
}

// A run of >=5 consecutive English WORDS (space-separated alphabetic tokens) is an English sentence.
// This distinguishes untranslated English prose from a Chinese string that merely contains a file path,
// a snake_case field name, or a dotted identifier (those are single tokens, not word runs).
function longestEnglishWordRun(s) {
  // Split on whitespace + sentence punctuation + CJK — but NOT on / _ . + so that a path, a
  // snake_case field name, or a dotted identifier stays ONE non-alpha token instead of being counted as
  // several English words. A "word" is then a pure-alpha token (1+ letters, so "a"/"I" don't break runs).
  const tokens = s.split(/[\s,、。;；:：()（）「」『』]+/u);
  let run = 0, best = 0;
  for (const t of tokens) {
    if (/^[A-Za-z]+$/.test(t)) { run += 1; best = Math.max(best, run); }
    else run = 0;
  }
  return best;
}

const findings = [];
for (const field of ["description", "coverageTodo"]) {
  for (const zh of zhValues(field)) {
    if (zh.length < 40) continue;
    const run = longestEnglishWordRun(zh);
    // A run of >=6 consecutive English words in a zh field is an untranslated English sentence.
    if (run >= 6) findings.push({ field, run, preview: zh.slice(0, 70) });
  }
}

if (findings.length > 0) {
  console.error(`[zh-not-english] FAIL — ${findings.length} zh field(s) look like untranslated English:`);
  for (const f of findings) console.error(`  - ${f.field} (cjk=${f.cjk} latin=${f.latin}): "${f.preview}…"`);
  console.error("  Fix: put the real Chinese in the zh side (SSOT: WAVE_L_REGISTRY description_zh / coverage_zh).");
  process.exit(1);
}

console.error(`[zh-not-english] OK — every dataset-pages description/coverage zh side is genuinely Chinese.`);
