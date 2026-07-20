// SSOT for the four-level dataset "grade" (分級) label + colour shown on the docs API-reference pages
// and sidebar (DOCS-01). This module holds ONLY the label + colour mapping — the grade VALUE for each
// dataset is a static field in the catalog (owner ruling: docs are static documents, not a live
// dashboard; there is no runtime grade derivation from an availability API / DB). To change a grade,
// edit the catalog.
//
// IMPORTANT — what "Verified/已驗證" means HERE. This grade is a data-MATURITY class (official source +
// full coverage). It is NOT the per-value / per-symbol reconciliation badge, which is a stronger claim
// and is deferred until the backend reconciliation job produces real verified dates (that whole
// "來源與對帳" section is intentionally omitted rather than shown empty). So "已驗證" here must be read as
// "官方來源、涵蓋完整", not "每值已對帳".

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
