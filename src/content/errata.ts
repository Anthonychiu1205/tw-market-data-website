// Errata — the single source of truth for public corrections to the storefront. Every entry is a real
// change we made after finding something was wrong or overclaimed; the page at /errata renders this
// list verbatim. Being open about corrections is a trust signal, not an embarrassment — a data API that
// hides its mistakes is the one you should not trust. Newest first. Bilingual (en side stays CJK-free).

export type ErrataEntry = {
  /** ISO date the correction shipped. */
  date: string;
  /** Dataset slug or area the correction touches (shown as a tag). */
  area: string;
  title: { en: string; zh: string };
  /** What was wrong / overclaimed before. */
  before: { en: string; zh: string };
  /** What it says now. */
  after: { en: string; zh: string };
};

export const errata: readonly ErrataEntry[] = [
  {
    date: "2026-07-23",
    area: "price-enhanced",
    title: {
      en: "price-enhanced was described as OHLCV / enhanced price fields — it is actually ex-rights/dividend adjustment factors",
      zh: "price-enhanced 原描述為 OHLCV／增強價格欄位——實際服務是除權除息價格調整因子",
    },
    before: {
      en: "The page listed derived OHLCV-style fields (change, amplitude, VWAP) as if that were the service.",
      zh: "頁面列出衍生的 OHLCV 型欄位(漲跌、振幅、成交均價),彷彿那就是服務內容。",
    },
    after: {
      en: "The live service returns ex-rights/dividend price-adjustment factors from the official TWSE TWT49U report — event_type / factor / pre_event_close / reference_price. The name, description and field list were corrected to match the real response; the slug is unchanged.",
      zh: "實際服務回傳官方 TWSE TWT49U 的除權除息價格調整因子——event_type／factor／pre_event_close／reference_price。名稱、描述與欄位列表已對齊真實回應;slug 不變。",
    },
  },
  {
    date: "2026-07-23",
    area: "chip-flows · events",
    title: {
      en: "chip-flows and events were graded as if serving — both return zero rows, now marked Building",
      zh: "chip-flows 與 events 原分級彷彿已服務——兩者實測回 0 列,改標「建置中」",
    },
    before: {
      en: "chip-flows carried a Derived grade and events a Verified grade, implying queryable data.",
      zh: "chip-flows 掛「衍生」、events 掛「已驗證」,暗示資料可查詢。",
    },
    after: {
      en: "Both endpoints return 0 rows in practice (the aggregation is not wired through yet). They are now graded Building. events has ~1,709 rows in its table but the endpoint serves none, so the row count was removed rather than shown as if queryable.",
      zh: "兩端點實測回 0 列(聚合尚未接通),改標「建置中」。events 底表約 1,709 列但端點回 0,故移除列數而非顯示為可查詢。",
    },
  },
  {
    date: "2026-07-22",
    area: "institutional-ownership",
    title: {
      en: "institutional-ownership was graded Verified with foreign-holding fields it never served — delisted",
      zh: "institutional-ownership 原掛「已驗證」+從未服務的外資持股欄位——已下架",
    },
    before: {
      en: "It was listed as a sellable Verified dataset with foreign_shares_held / foreign_holding_ratio fields.",
      zh: "它被列為可販售的「已驗證」資料集,含 foreign_shares_held／foreign_holding_ratio 欄位。",
    },
    after: {
      en: "The endpoint returns 0 rows and has no live backing table, so the Verified grade and those fields were unbacked. It was removed from the sellable catalog; its old docs URL now shows an honest retired note pointing to ownership-distribution (available) and foreign-holding (roadmap).",
      zh: "端點回 0 列、無實體來源表,故「已驗證」章與欄位並無支撐。已從可販售型錄移除;舊文件 URL 改為誠實下架導流至 ownership-distribution(可用)與 foreign-holding(規劃中)。",
    },
  },
  {
    date: "2026-07-22",
    area: "corporate-actions",
    title: {
      en: "corporate-actions was graded Verified before its serving met the bar — downgraded to Reference",
      zh: "corporate-actions 在 serving 達標前即掛「已驗證」——降為「參考」",
    },
    before: { en: "Graded Verified.", zh: "掛「已驗證」。" },
    after: {
      en: "Serving did not meet the verified standard yet, so it was downgraded to Reference until the repoint lands. It will be raised again once it serves cleanly.",
      zh: "serving 尚未達「已驗證」標準,故降為「參考」直到 repoint 落地;serving 乾淨後再升回。",
    },
  },
  {
    date: "2026-07-22",
    area: "market-snapshot · etf-flow",
    title: {
      en: "market-snapshot and etf-flow were sellable with no live backing data — delisted",
      zh: "market-snapshot 與 etf-flow 可販售卻無實體資料——已下架",
    },
    before: {
      en: "Both were listed in the sellable catalog; etf-flow had even been graded as if verified.",
      zh: "兩者都列在可販售型錄;etf-flow 甚至曾掛得像已驗證。",
    },
    after: {
      en: "market-snapshot has no live backing table and etf-flow has no official source and returns 0 rows, so both were fully removed rather than sold as empty inventory.",
      zh: "market-snapshot 無實體來源表、etf-flow 無官方來源且回 0 列,故全數移除,而非以空殼販售。",
    },
  },
  {
    date: "2026-07-22",
    area: "docs · request examples",
    title: {
      en: "Dataset request examples used a date parameter the backend ignores — corrected to start_date/end_date",
      zh: "資料集請求範例使用了被後端忽略的日期參數——已修正為 start_date/end_date",
    },
    before: {
      en: "Examples used date_from / date_to, which the backend silently ignores (a request came back unfiltered, at the row limit).",
      zh: "範例使用 date_from／date_to,後端會靜默忽略(請求未過濾、回到列數上限)。",
    },
    after: {
      en: "The examples and parameter tables now use start_date / end_date — the names the OpenAPI documents and the only ones that actually filter — driven from a single source so the table and the example can never disagree.",
      zh: "範例與參數表格改用 start_date／end_date——OpenAPI 記載且唯一真正會過濾的參數名——由單一來源驅動,表格與範例永不打架。",
    },
  },
];
