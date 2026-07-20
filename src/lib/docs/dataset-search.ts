// Matching logic for the docs sidebar's dataset autocomplete. Pure and dependency-free so it can be
// unit-tested directly; the index it runs over is built from the catalog SSOT in docs-sidebar.ts.

import type { DatasetGrade } from "./dataset-grade";

export type DocsDatasetSearchEntry = {
  href: string;
  title: string; // display name in the active locale
  groupLabel: string; // owning domain, shown as the suggestion's second line
  slug: string;
  grade: DatasetGrade;
  // Lower-cased zh name + en name + slug, pre-joined. Both languages are always indexed so a reader
  // typing "月營收", "monthly revenue" or "monthly-revenue" reaches the same page whatever the UI
  // locale is.
  haystack: string;
};

export function buildDatasetSearchHaystack(zh: string, en: string, slug: string): string {
  // The slug is indexed twice — hyphenated and space-separated — so "monthly revenue" matches
  // `monthly-revenue` even when the reader types a space instead of a hyphen.
  return `${zh} ${en} ${slug} ${slug.replace(/-/g, " ")}`.toLowerCase();
}

export function searchDocsDatasets(
  index: DocsDatasetSearchEntry[],
  rawQuery: string,
  limit = 8,
): DocsDatasetSearchEntry[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];
  // Every whitespace-separated token must appear, so "twse daily" narrows rather than widens.
  const tokens = query.split(/\s+/);
  const matches = index.filter((entry) => tokens.every((token) => entry.haystack.includes(token)));
  // Prefix matches on the visible title or the slug rank first — that is what the reader is usually
  // aiming at. Array#sort is stable, so ties keep catalog order.
  matches.sort((a, b) => {
    const aPrefix = a.title.toLowerCase().startsWith(query) || a.slug.startsWith(query) ? 0 : 1;
    const bPrefix = b.title.toLowerCase().startsWith(query) || b.slug.startsWith(query) ? 0 : 1;
    return aPrefix - bPrefix;
  });
  return matches.slice(0, limit);
}
