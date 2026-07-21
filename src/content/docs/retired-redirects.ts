// Retired dataset docs pages — a delisted dataset's old URL renders an honest "retired, use X instead"
// note rather than a 404, pointing readers at the live datasets that cover the same ground.

export type RetiredRedirect = {
  // The docs path segments after /docs/, e.g. ["api","market-prices","market-snapshot"].
  slugParts: string[];
  title: { zh: string; en: string };
  note: { zh: string; en: string };
  // Live datasets that cover the same content, shown as links.
  alternatives: { href: string; zh: string; en: string }[];
};

export const RETIRED_REDIRECTS: RetiredRedirect[] = [
  // market-snapshot is NOT here: owner ruled a FULL delete (no note) — see PR #117. This mechanism now
  // serves institutional-ownership only, which owner ruled 下架導流 (delist with a pointer).
  {
    slugParts: ["api", "capital-flows", "institutional-ownership"],
    title: { zh: "法人持股（已下架）", en: "Institutional ownership (retired)" },
    note: {
      zh: "此資料集已下架。相同性質的法人／持股資料請改用：",
      en: "This dataset is retired. For equivalent ownership data, use instead:",
    },
    alternatives: [
      // foreign-holding is NOT a real docs page; ownership-distribution is the only valid target.
      { href: "/docs/api/capital-flows/ownership-distribution", zh: "股權分散（TDCC 持股分佈）", en: "Ownership distribution (TDCC holder distribution)" },
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
