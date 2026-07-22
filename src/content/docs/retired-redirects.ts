// Retired dataset docs pages — a delisted dataset's old URL renders an honest "retired, use X instead"
// note rather than a 404, pointing readers at the live datasets that cover the same ground.

export type RetiredRedirect = {
  // The docs path segments after /docs/, e.g. ["api","market-prices","market-snapshot"].
  slugParts: string[];
  title: { zh: string; en: string };
  note: { zh: string; en: string };
  // Datasets that cover the same content. A live one is shown as a link; a `roadmap` one is not yet a
  // real page, so it is shown as plain text with a "roadmap" tag (never a dead link — 假不了就不顯示).
  alternatives: { href: string; zh: string; en: string; roadmap?: boolean }[];
};

export const RETIRED_REDIRECTS: RetiredRedirect[] = [
  // market-snapshot is NOT here: owner ruled a FULL delete (no note) — see PR #117. This mechanism now
  // serves institutional-ownership only, which owner ruled 下架導流 (delist with a pointer).
  {
    slugParts: ["api", "capital-flows", "institutional-ownership"],
    title: { zh: "法人持股（已下架）", en: "Institutional ownership (retired)" },
    note: {
      zh: "此資料集實測回傳 0 列、後端無實體來源表，因此已下架（原本的「已驗證」章與外資持股欄位並無實際服務支撐）。持股相關資料請改用：",
      en: "This dataset returns 0 rows in practice and has no live backing table on the backend, so it is retired (its former \"Verified\" grade and foreign-holding fields were never actually served). For ownership data, use:",
    },
    alternatives: [
      // ownership-distribution is a live docs page (available now); foreign-holding is a planned product
      // with no page yet, so it renders as a roadmap tag rather than a dead link.
      { href: "/docs/api/capital-flows/ownership-distribution", zh: "集保股權分散（TDCC 持股分佈，現已可用）", en: "Ownership distribution (TDCC holder distribution, available now)" },
      { href: "/docs/api/capital-flows/foreign-holding", zh: "外資持股（foreign-holding，規劃中）", en: "Foreign holding (foreign-holding, on the roadmap)", roadmap: true },
    ],
  },
];

export function getRetiredRedirect(slugParts: string[]): RetiredRedirect | null {
  return (
    RETIRED_REDIRECTS.find(
      (r) => r.slugParts.length === slugParts.length && r.slugParts.every((s, i) => s === slugParts[i]),
    ) ?? null
  );
}
