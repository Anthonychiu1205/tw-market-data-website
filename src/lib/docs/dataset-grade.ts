// SSOT for the four-level dataset "grade" (分級) shown on the docs API-reference pages and sidebar
// (DOCS-01 Part 6). This is DERIVED, never hand-set per page: the grade is computed from a dataset's
// availability status + its source role, so when a dataset's real status changes (e.g. a roadmap
// dataset goes live, or the availability snapshot drops it to coverage-limited) the badge re-colours
// on its own — no page edit (Part 0: read status dynamically, never freeze it in copy).
//
// IMPORTANT — what "Verified/已驗證" means HERE. This grade is a data-MATURITY class (official source +
// available + coverage confirmed). It is NOT the per-value / per-symbol reconciliation badge, which is
// a stronger claim and is deferred until the backend reconciliation job produces real verified dates
// (that whole "來源與對帳" section is intentionally omitted from Phase 1 rather than shown empty). So
// "已驗證" here must be read as "官方來源、現值可用、涵蓋已確認", not "每值已對帳".

export type DatasetGrade = "verified" | "derived" | "reference" | "building";

// Bilingual display names (Part 6 分級對外命名 map). The `en` side is user-facing on /en and MUST stay
// CJK-free — the docs guards scan it. English here is a fixed term, not a machine translation.
export const DATASET_GRADE_LABELS: Record<DatasetGrade, { en: string; zh: string }> = {
  verified: { en: "Verified", zh: "已驗證" },
  derived: { en: "Derived", zh: "衍生" },
  reference: { en: "Reference", zh: "參考" },
  building: { en: "Building", zh: "建置中" },
};

// Low-saturation colour codes fixed by the v5 IA spec. `building` is an outline (border) treatment,
// the other three are solid text/badge colours.
export const DATASET_GRADE_COLORS: Record<DatasetGrade, string> = {
  verified: "#2C8C6A",
  derived: "#3E6EA6",
  reference: "#928C7F",
  building: "#C08A33",
};

export function datasetGradeLabel(grade: DatasetGrade, locale: string): string {
  const label = DATASET_GRADE_LABELS[grade];
  return locale === "en" ? label.en : label.zh;
}

// The real signals a grade is derived from. Every field is optional so a dataset we only partially
// know still resolves to a safe grade (worst-case → reference/building, never a false "verified").
export type DatasetGradeSignals = {
  // Availability from the coverage registry / availability snapshot.
  availability?: "available" | "coverage-limited" | "roadmap" | "frozen" | "metadata-only";
  // Marketing readiness (site.ts): a preview dataset is not yet a full-history "verified" dataset.
  readiness?: "available_now" | "preview";
  // The dataset's canonical source role, e.g. "official_twse_t86" vs "derived_market_breadth".
  sourceRole?: string;
  // True when the dataset has a confirmed real coverage window / current data.
  hasRealCoverage?: boolean;
};

// Derivation order is intentional (most-specific / most-conservative first):
//   1. building — not really queryable yet (roadmap/frozen, or no real coverage). Shown but not callable.
//   2. derived  — a computed/derived dataset (source_role or availability says so). Real, but downstream.
//   3. reference — metadata / dimension / lookup data (no time series to "verify" a value against).
//   4. verified — official source, available, coverage confirmed. The default for a live official feed.
// A dataset that matches nothing above falls to "reference" (safe: never claims verified without proof).
export function deriveDatasetGrade(signals: DatasetGradeSignals): DatasetGrade {
  const { availability, readiness, sourceRole = "", hasRealCoverage } = signals;

  // 1. Building — nothing real to call yet.
  if (availability === "roadmap" || availability === "frozen") return "building";
  if (hasRealCoverage === false && availability !== "metadata-only") return "building";

  // 2. Derived — an explicitly computed dataset.
  if (/^derived[_-]/i.test(sourceRole) || /(^|[_-])derived([_-]|$)/i.test(sourceRole)) return "derived";

  // 3. Reference — pure lookup/metadata (master, calendar, classification), no verifiable time series.
  if (availability === "metadata-only") return "reference";
  if (/(master|calendar|classification|dimension|profile|registration)/i.test(sourceRole)) return "reference";

  // 4. Verified — official + available. A preview/coverage-limited official feed is real but not yet
  //    full-history, so it does not get the top grade; it degrades to reference (honest, not "verified").
  if (/^official[_-]/i.test(sourceRole) || sourceRole.startsWith("official")) {
    if (availability === "coverage-limited" || readiness === "preview") return "reference";
    return "verified";
  }

  // Unknown source role → never fabricate "verified".
  return "reference";
}
