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
  {
    slugParts: ["api", "market-prices", "market-snapshot"],
    title: { zh: "市場快照（已下架）", en: "Market snapshot (retired)" },
    note: {
      zh: "此資料集已下架——後端標記為無實體來源表（不可販售），且其內容與下列現有資料集重疊。請改用：",
      en: "This dataset is retired — the backend marks it as having no live backing table (not for sale), and its content overlaps the live datasets below. Use instead:",
    },
    alternatives: [
      { href: "/docs/api/market-prices/market-index", zh: "市場指數（指數內容）", en: "Market indices (index content)" },
      { href: "/docs/api/market-prices/market-breadth", zh: "市場廣度（漲跌家數）", en: "Market breadth (advancers / decliners)" },
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
