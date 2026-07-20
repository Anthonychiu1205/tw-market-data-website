import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildDatasetSearchHaystack,
  searchDocsDatasets,
  type DocsDatasetSearchEntry,
} from "./dataset-search.ts";

function entry(zh: string, en: string, slug: string, groupLabel = "Market & Prices"): DocsDatasetSearchEntry {
  return {
    href: `/docs/api/market-prices/${slug}`,
    title: en,
    groupLabel,
    slug,
    grade: "verified",
    haystack: buildDatasetSearchHaystack(zh, en, slug),
  };
}

const INDEX: DocsDatasetSearchEntry[] = [
  entry("TWSE 日線價格", "TWSE daily prices", "twse-daily-price"),
  entry("TPEx 日線價格", "TPEx daily prices", "tpex-daily-price"),
  entry("月營收", "Monthly revenue", "monthly-revenue", "Financials & Growth"),
  entry("股利政策", "Dividend policy", "dividends", "Financials & Growth"),
];

test("an empty query suggests nothing", () => {
  assert.deepEqual(searchDocsDatasets(INDEX, ""), []);
  assert.deepEqual(searchDocsDatasets(INDEX, "   "), []);
});

test("matches the Chinese name whatever the UI locale is", () => {
  const hits = searchDocsDatasets(INDEX, "月營收");
  assert.equal(hits.length, 1);
  assert.equal(hits[0]?.slug, "monthly-revenue");
});

test("matches the English name case-insensitively", () => {
  const hits = searchDocsDatasets(INDEX, "DIVIDEND");
  assert.equal(hits.length, 1);
  assert.equal(hits[0]?.slug, "dividends");
});

test("matches the slug, hyphenated or space-separated", () => {
  assert.equal(searchDocsDatasets(INDEX, "monthly-revenue")[0]?.slug, "monthly-revenue");
  assert.equal(searchDocsDatasets(INDEX, "monthly revenue")[0]?.slug, "monthly-revenue");
});

test("multiple tokens narrow rather than widen the result", () => {
  const daily = searchDocsDatasets(INDEX, "daily");
  assert.equal(daily.length, 2);
  const narrowed = searchDocsDatasets(INDEX, "twse daily");
  assert.equal(narrowed.length, 1);
  assert.equal(narrowed[0]?.slug, "twse-daily-price");
});

test("title/slug prefix matches rank ahead of mid-string matches", () => {
  const index = [
    entry("增強月營收", "Enhanced monthly revenue", "monthly-revenue-enhanced", "Financials & Growth"),
    entry("月營收", "Monthly revenue", "monthly-revenue", "Financials & Growth"),
  ];
  // Both contain "monthly revenue"; only the second one starts with it.
  assert.equal(searchDocsDatasets(index, "monthly revenue")[0]?.slug, "monthly-revenue");
});

test("the suggestion list is capped", () => {
  const many = Array.from({ length: 20 }, (_, i) => entry(`指數 ${i}`, `Index ${i}`, `index-${i}`));
  assert.equal(searchDocsDatasets(many, "index").length, 8);
  assert.equal(searchDocsDatasets(many, "index", 3).length, 3);
});

test("a query that matches nothing returns an empty list", () => {
  assert.deepEqual(searchDocsDatasets(INDEX, "no-such-dataset"), []);
});
