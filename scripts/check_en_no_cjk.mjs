#!/usr/bin/env node
// I18N-FIX-04 item 9 — systematic guard against Chinese leaking onto /en.
//
// Scans the BUILT server HTML for the /en key pages (.next/server/app/en/**/*.html — homepage, docs,
// pricing, blog and their subpaths) and fails the build if CJK appears in RENDERED text/attributes.
// The inlined hydration payload / message catalog (inside <script>/<style>) legitimately carries the
// full zh catalog, so those blocks are stripped before scanning — only the visible DOM is checked.
//
// Whitelist: the language-switcher label "中文" (the button that switches TO Chinese — intentional).
//
// LIMITATION (honest): client-only demo panels are `dynamic(ssr:false)`, so they are NOT in the server
// HTML and this scan does not cover them. Those panels are made locale-complete in the same PR
// (I18N-FIX-04). This guard covers all server-rendered content and catches future regressions there.
//
// Usage: `node scripts/check_en_no_cjk.mjs` — run AFTER `next build`. If no /en HTML exists yet it
// reports and exits 0 (so it never false-fails before a build).
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const EN_DIR = join(root, ".next", "server", "app", "en");

// CJK ideographs (+ Ext A), kana, and CJK fullwidth punctuation. Deliberately excludes fullwidth
// ASCII letters/digits (rare in output, and not "Chinese text").
const CJK = /[㐀-䶿一-鿿぀-ヿ　-〿！-｠￠-￦]/;
const CJK_RUN = /[㐀-䶿一-鿿぀-ヿ　-〿！-｠￠-￦]+/g;

// Intentional CJK on /en: the 中文 language-switcher label, and the Taiwan-market terms used as
// bilingual anchors in the EN AEO articles (the 三大法人 explainer) — these help both English and
// Chinese search intent and are deliberate, not leaks.
const WHITELIST = ["中文", "三大法人", "外資", "投信", "自營商"];

// A page that renders the §2.5 "coming soon" notice is DELIBERATELY untranslated (docs / not-yet-en
// blog): it tells the reader in English that the body is Chinese-only. Those are the accepted interim
// state, not a leak — skip them. This guard's job is to catch UNINTENTIONAL zh (demo panels, chrome,
// and pages that are supposed to be fully English: homepage, pricing, translated blog posts).
const SECTION_2_5_MARKERS = ["currently available in Chinese only", "coming soon"];

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

if (!existsSync(EN_DIR)) {
  console.error("[en-no-cjk] no /en server HTML at .next/server/app/en — run `next build` first. Skipping (exit 0).");
  process.exit(0);
}

const files = htmlFiles(EN_DIR);
const findings = [];

let skipped = 0;
for (const file of files) {
  const raw = readFileSync(file, "utf8");
  // Rendered DOM only — drop hydration/catalog payloads + styles (they carry the whole zh catalog by
  // design, incl. the §2.5 message string, so the checks below MUST run on the stripped HTML).
  let html = raw
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  // A RENDERED §2.5 notice → deliberately-untranslated page → skip (not a leak).
  if (SECTION_2_5_MARKERS.some((m) => html.includes(m))) {
    skipped += 1;
    continue;
  }
  for (const w of WHITELIST) html = html.split(w).join(" ");
  if (!CJK.test(html)) continue;
  const hits = Array.from(new Set((html.match(CJK_RUN) || []))).slice(0, 8);
  findings.push({ file: file.replace(root + "/", ""), hits });
}

if (findings.length > 0) {
  console.error(`[en-no-cjk] FAIL — Chinese found in rendered /en HTML (${findings.length} file(s)):`);
  for (const f of findings) console.error(`  - ${f.file}: ${f.hits.join("  ")}`);
  console.error("  Fix: route the offending UI text through i18n messages / an en display map. Whitelist only intentional CJK (e.g. the 中文 switcher).");
  process.exit(1);
}

console.error(`[en-no-cjk] OK — ${files.length - skipped} fully-English /en page(s) scanned (${skipped} §2.5 untranslated page(s) skipped), no unexpected Chinese in rendered text.`);
