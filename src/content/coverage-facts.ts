// Marketing-safe coverage facts — the single in-repo SSOT for any coverage NUMBER shown to the
// public (SEO/AEO pages, Dataset schema temporalCoverage, etc.).
//
// Source of truth: tw-feature-engine `docs/coverage/MARKETING_SAFE_COVERAGE_FACTS.md`, a read-only
// DB-measured snapshot verified by D on 2026-07-11. DO NOT invent or round beyond what is stated
// there; anything not listed as "safe to claim" must not appear on the site.
//
// Explicitly NOT claimable yet (do not add here): "weekly official reconciliation" as a live
// feature (harness built, single pass only, no cron — roadmap only) and a production hosted MCP
// endpoint (MCP stays "preview"). See §2 of the source doc.

export const COVERAGE_FACTS_SNAPSHOT_DATE = "2026-07-11";

export const coverageFacts = {
  twseDailyPrice: {
    rows: 5_215_311,
    rowsDisplay: "5.2 million",
    stocks: 1_682,
    earliestDate: "2004-02-11",
    latestDate: "2026-07-08",
    // Survivorship-bias-free: stocks that have stopped trading (>90 days) but whose full price
    // history is retained. 262 of these carry an official delisting date in security_master_items.
    stoppedTradingStocks: 311,
    delistedWithOfficialDate: 262,
  },
  tpexDailyPrice: {
    rows: 3_920_223,
    stocks: 11_757,
    earliestDate: "1994-01-05",
  },
  monthlyRevenue: {
    rows: 331_109,
    stocks: 2_096,
    earliestPeriod: "2010-01",
    latestPeriod: "2026-06",
  },
} as const;

// ─── Dataset availability status (catalog hygiene, 2026-07-14) ────────────────────────────────────
// The public catalog must never advertise a dataset as available when its table is empty, frozen, or
// does not exist. This registry is the SSOT for that: a dataset listed here with publiclyListable
// false must NOT appear as an available dataset on /datasets, in llms.txt, or under pricing's
// "全部資料集" claim.
//
// Only datasets that need a NON-available status are listed. Anything absent from this registry and
// present in the published catalog is a normal available dataset.
export type DatasetAvailabilityStatus =
  /** Real data, sellable, listed publicly. */
  | "available"
  /** Table exists but is empty pending an upstream dataset — not sellable yet. */
  | "coverage-limited"
  /** No data and no recorder yet; planned. Not sellable, not listed as available. */
  | "roadmap"
  /** Exists but is deliberately withdrawn from the public catalog. Not sellable. */
  | "frozen"
  /** We deliberately do NOT provide the full text; only structured metadata is offered. */
  | "metadata-only";

export type DatasetAvailabilityEntry = {
  status: DatasetAvailabilityStatus;
  /** Honest, user-facing reason. Shown when a surface needs to explain the gap. */
  note: string;
  /** May this dataset be listed publicly as an available dataset? */
  publiclyListable: boolean;
};

export const datasetAvailability: Record<string, DatasetAvailabilityEntry> = {
  bond_yield_curve: {
    status: "roadmap",
    note: "公債殖利率曲線（TPEx，OGDL v1.0 開放可商用）尚未建置 recorder，目前無資料。",
    publiclyListable: false,
  },
  taifex_atm_iv: {
    status: "coverage-limited",
    note: "表已建立但尚無資料；待上游 taifex_options 寫入後填充。",
    publiclyListable: false,
  },
  regime_serve: {
    status: "frozen",
    note: "已凍結，不對外提供。",
    publiclyListable: false,
  },
  announcements_fulltext: {
    status: "metadata-only",
    note: "不提供公告全文（版權考量）；僅提供結構化 metadata。",
    publiclyListable: false,
  },
  filings_fulltext: {
    status: "metadata-only",
    note: "不提供申報書全文（版權考量）；僅提供結構化 metadata。",
    publiclyListable: false,
  },
};

/** True when a dataset may be listed publicly as available (i.e. it has real data). */
export function isPubliclyListable(datasetId: string): boolean {
  const entry = datasetAvailability[datasetId];
  // Not in the registry → a normal available dataset.
  return entry ? entry.publiclyListable : true;
}

export function getDatasetAvailability(datasetId: string): DatasetAvailabilityEntry | null {
  return datasetAvailability[datasetId] ?? null;
}

/** The datasets explicitly held back from the public catalog, for honest disclosure. */
export function getNonListableDatasets(): Array<{ id: string } & DatasetAvailabilityEntry> {
  return Object.entries(datasetAvailability)
    .filter(([, entry]) => !entry.publiclyListable)
    .map(([id, entry]) => ({ id, ...entry }));
}

// Dataset-page temporalCoverage (schema.org ISO 8601 interval) for datasets with a DB-verified
// coverage window. Keyed by dataset slug; only include slugs with a real window from the source doc.
export const datasetTemporalCoverage: Record<string, string> = {
  "twse-daily-price": `${coverageFacts.twseDailyPrice.earliestDate}/${coverageFacts.twseDailyPrice.latestDate}`,
  "monthly-revenue": `${coverageFacts.monthlyRevenue.earliestPeriod}/${coverageFacts.monthlyRevenue.latestPeriod}`,
};

// Per-endpoint coverage mini-table (BENCH-01 §2). Keyed by dataset slug (last docs path segment).
// Only DB-verified values are filled; any field left undefined renders as "coming" — NEVER fabricate.
// `includesDelisted`: true = full price history retained for stopped-trading names; undefined = coming.
export type DatasetCoverageRow = {
  instruments?: string; // 標的數
  startYear?: string; // 起始年
  updateTiming?: string; // 更新時點 (no verified cadence yet → left undefined = coming)
  includesDelisted?: boolean; // 含已下市
};

export const datasetCoverageTable: Record<string, DatasetCoverageRow> = {
  "twse-daily-price": {
    instruments: coverageFacts.twseDailyPrice.stocks.toLocaleString("en-US"),
    startYear: coverageFacts.twseDailyPrice.earliestDate.slice(0, 4),
    includesDelisted: true, // 311 stopped-trading names retained (262 with official delisting date)
  },
  "tpex-daily-price": {
    instruments: coverageFacts.tpexDailyPrice.stocks.toLocaleString("en-US"),
    startYear: coverageFacts.tpexDailyPrice.earliestDate.slice(0, 4),
    includesDelisted: true,
  },
  "monthly-revenue": {
    instruments: coverageFacts.monthlyRevenue.stocks.toLocaleString("en-US"),
    startYear: coverageFacts.monthlyRevenue.earliestPeriod.slice(0, 4),
    // includesDelisted / updateTiming: not verified → coming
  },
};
