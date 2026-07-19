// DOCS-01 bilingual endpoint-page content (Phase 1 sample pages). Unlike the legacy zh-only docs
// pages (which show an "English coming soon" banner on /en), these v5 pages carry genuine en + zh so
// /en is fully usable and scanned by the CJK guards. English is a semantic rewrite, not machine
// translation.
//
// Real-data discipline (Part 0): coverage totals come from the coverage-facts SSOT (imported, not
// re-typed). Where a real coverage number is not obtainable for this dataset yet (e.g. the doc-build
// key is not entitled to query it, or no full-table count exists), the field is a `coverageTodo`
// marker — never a fabricated number. Example rows are REAL values pulled from the live API.

import { COVERAGE_FACTS_SNAPSHOT_DATE, coverageFacts } from "@/src/content/coverage-facts";

export type Bi = { en: string; zh: string };

export type FieldDoc = { name: string; type: string; desc: Bi };
export type ParamDoc = { name: string; required: boolean; type: string; default?: string; desc: Bi };
export type CoverageFact = {
  rows?: string;
  symbols?: string;
  window: Bi;
  frequency: Bi;
};

export type DatasetDocContent = {
  slug: string;
  description: Bi; // one-line blockquote
  overview: Bi[]; // paragraphs
  fields: FieldDoc[]; // key response fields (includes provenance fields to show verifiability)
  // A REAL example response row. Bilingual when the row carries Chinese values (e.g. a company name):
  // /en shows the romanized/English form so the page stays CJK-free, /zh shows the native value.
  exampleJson: string | Bi;
  coverage: CoverageFact | null; // null → show coverageTodo instead (never a fake number)
  coverageTodo?: Bi;
  params: ParamDoc[];
  notes?: Bi[]; // honest limitations / boundaries
};

// The standard dataset query parameters (from the OpenAPI spec: symbol* / start_date / end_date / limit).
export const STANDARD_PARAMS: ParamDoc[] = [
  { name: "symbol", required: true, type: "string", desc: { en: "Ticker, e.g. 2330.", zh: "股票代碼，例如 2330。" } },
  { name: "start_date", required: false, type: "string (YYYY-MM-DD)", desc: { en: "Start of the query range.", zh: "查詢起始日期。" } },
  { name: "end_date", required: false, type: "string (YYYY-MM-DD)", desc: { en: "End of the query range.", zh: "查詢結束日期。" } },
  { name: "limit", required: false, type: "integer", desc: { en: "Maximum rows to return.", zh: "回傳筆數上限。" } },
];

// Reference-style datasets (master / metadata) take symbol + limit, no date range.
export const REFERENCE_PARAMS: ParamDoc[] = [
  { name: "symbol", required: false, type: "string", desc: { en: "Ticker to filter to a single security.", zh: "以股票代碼篩選單一標的。" } },
  { name: "limit", required: false, type: "integer", desc: { en: "Maximum rows to return.", zh: "回傳筆數上限。" } },
];

const twse = coverageFacts.twseDailyPrice;
const rev = coverageFacts.monthlyRevenue;
const fmt = (n: number) => n.toLocaleString("en-US");

export const DATASET_DOC_CONTENT: Record<string, DatasetDocContent> = {
  // 1) market-prices — verified, TWSE, full real coverage from SSOT
  "twse-daily-price": {
    slug: "twse-daily-price",
    description: {
      en: "Daily open/high/low/close, volume and turnover for TWSE-listed stocks, aligned to the official trading calendar.",
      zh: "上市股票的日開高低收、成交量與成交金額，對齊官方交易日曆。",
    },
    overview: [
      {
        en: "twse-daily-price returns one row per stock per trading day from the official TWSE daily quote feed. Every row carries its source fields, so a value can be traced back to the exact upstream publication.",
        zh: "twse-daily-price 以官方 TWSE 日成交行情為源，每一交易日每檔股票回傳一列，並附來源欄位，任一數值可回溯到上游原始發布。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "close", type: "number", desc: { en: "Closing price.", zh: "收盤價。" } },
      { name: "volume_shares", type: "number", desc: { en: "Shares traded.", zh: "成交股數。" } },
      { name: "turnover", type: "number", desc: { en: "Turnover value (TWD).", zh: "成交金額（新台幣）。" } },
      { name: "source_canonical", type: "string", desc: { en: "Canonical source id (e.g. official_twse).", zh: "正規來源識別（如 official_twse）。" } },
      { name: "updated_at", type: "string", desc: { en: "When this row was last refreshed.", zh: "此列最後更新時間。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "date": "2026-07-16",
      "open": 2495.0,
      "high": 2500.0,
      "low": 2465.0,
      "close": 2470.0,
      "volume_shares": 30538604,
      "turnover": 74750491934,
      "source_canonical": "official_twse",
      "source_name": "twse_stock_day_all_openapi",
      "updated_at": "2026-07-17"
    }
  ]
}`,
    coverage: {
      rows: fmt(twse.rows),
      symbols: fmt(twse.stocks),
      window: { en: `${twse.earliestDate} → ${twse.latestDate}`, zh: `${twse.earliestDate} → ${twse.latestDate}` },
      frequency: { en: "Daily (trading days)", zh: "每日（交易日）" },
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: `Coverage totals are a database snapshot measured on ${COVERAGE_FACTS_SNAPSHOT_DATE}; the live feed advances each trading day, so the latest available date is newer than the window end shown.`,
        zh: `涵蓋總數為 ${COVERAGE_FACTS_SNAPSHOT_DATE} 量測的資料庫快照；即時資料每交易日推進，故實際最新日期會新於上方視窗結束日。`,
      },
    ],
  },

  // 2) financials — verified, MOPS, full real coverage from SSOT
  "monthly-revenue": {
    slug: "monthly-revenue",
    description: {
      en: "Monthly revenue disclosures for listed companies, sourced from MOPS, with year-over-year and month-over-month growth ready to compute.",
      zh: "上市櫃公司月營收申報，來源為公開資訊觀測站（MOPS），可直接計算 YoY／MoM 成長。",
    },
    overview: [
      {
        en: "monthly-revenue returns one row per company per reporting month from MOPS. The lineage block names the exact MOPS form the figure came from, so each number is auditable rather than opaque.",
        zh: "monthly-revenue 以 MOPS 為源，每家公司每個申報月份回傳一列；lineage 欄位標明數字來自哪一份 MOPS 表單，數值可稽核而非黑箱。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period", type: "string", desc: { en: "Reporting month (YYYY-MM).", zh: "申報月份（YYYY-MM）。" } },
      { name: "revenue", type: "number", desc: { en: "Monthly revenue (TWD thousands).", zh: "月營收（新台幣仟元）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_mops_monthly_revenue).", zh: "正規來源角色（official_mops_monthly_revenue）。" } },
      { name: "lineage", type: "object", desc: { en: "Upstream endpoint + authority (e.g. MOPS t187ap05).", zh: "上游端點與權威來源（如 MOPS t187ap05）。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "period": "2026-05",
      "revenue": 416975163,
      "source_role": "official_mops_monthly_revenue",
      "lineage": {
        "endpoint_name": "t187ap05",
        "source_authority": "MOPS t187ap05",
        "payload_date": "2026-05-01"
      },
      "is_placeholder": false
    }
  ]
}`,
    coverage: {
      rows: fmt(rev.rows),
      symbols: fmt(rev.stocks),
      window: { en: `${rev.earliestPeriod} → ${rev.latestPeriod}`, zh: `${rev.earliestPeriod} → ${rev.latestPeriod}` },
      frequency: { en: "Monthly", zh: "每月" },
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Monthly revenue is point-in-time sensitive: pass as_of when backtesting so you only see figures that were public at that moment.",
        zh: "月營收具時間點敏感性：回測時請帶 as_of，只會看到當下已公開的數字。",
      },
    ],
  },

  // 3) capital-flows — verified provenance, TWSE T86; row count not in SSOT → TODO
  "institutional-flow": {
    slug: "institutional-flow",
    description: {
      en: "Daily net buy/sell by the three major institutional investor groups on TWSE, from the official T86 report.",
      zh: "TWSE 三大法人每日買賣超與淨流量，來源為官方 T86 報表。",
    },
    overview: [
      {
        en: "institutional-flow returns one row per stock per trading day with foreign, investment-trust and dealer flows, sourced from TWSE T86. Rows carry their source role so the number is traceable to the official report.",
        zh: "institutional-flow 以 TWSE T86 為源，每交易日每檔股票回傳外資、投信、自營商買賣超一列；附來源角色，數字可回溯官方報表。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "foreign_net", type: "number", desc: { en: "Foreign investor net (shares).", zh: "外資買賣超（股）。" } },
      { name: "trust_net", type: "number", desc: { en: "Investment-trust net (shares).", zh: "投信買賣超（股）。" } },
      { name: "dealer_net", type: "number", desc: { en: "Dealer net (shares).", zh: "自營商買賣超（股）。" } },
      { name: "source_role", type: "string", desc: { en: "official_twse_t86.", zh: "official_twse_t86。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "date": "2026-07-17",
      "foreign_net": -8123000,
      "trust_net": 415000,
      "dealer_net": 122000,
      "source_role": "official_twse_t86",
      "lineage": { "source_authority": "TWSE T86" }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official TWSE T86 daily report (present through the latest trading day).",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;來源為官方 TWSE T86 每日報表(涵蓋至最新交易日)。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Some rows are flagged is_placeholder:true upstream — check the flag before treating a value as final.",
        zh: "部分列在上游標記 is_placeholder:true——將數值視為定案前請先檢查此旗標。",
      },
    ],
  },

  // 4) macro — verified, CBC snapshot; single-snapshot, no full-table count → TODO
  "interest-rate-snapshot": {
    slug: "interest-rate-snapshot",
    description: {
      en: "Central Bank of Taiwan (CBC) policy interest-rate snapshot — the discount and accommodation rates as most recently set.",
      zh: "中央銀行（CBC）政策利率快照——最近一次設定的重貼現率與擔保放款融通利率。",
    },
    overview: [
      {
        en: "interest-rate-snapshot returns the current CBC policy rates with the date they took effect, sourced from the central bank. It is a snapshot surface, not a long daily time series.",
        zh: "interest-rate-snapshot 回傳目前 CBC 政策利率與其生效日期，來源為中央銀行。此為快照面，非長期每日時間序列。",
      },
    ],
    fields: [
      { name: "rate_name", type: "string", desc: { en: "Which policy rate.", zh: "政策利率名稱。" } },
      { name: "value_pct", type: "number", desc: { en: "Rate in percent.", zh: "利率（百分比）。" } },
      { name: "as_of", type: "string", desc: { en: "Date the rate took effect.", zh: "利率生效日期。" } },
      { name: "source_role", type: "string", desc: { en: "cbc_official.", zh: "cbc_official。" } },
    ],
    exampleJson: `{
  "data": [
    { "rate_name": "rediscount_rate", "value_pct": 2.000, "as_of": "2026-05-27", "source_role": "cbc_official" },
    { "rate_name": "rediscount_with_collateral", "value_pct": 2.375, "as_of": "2026-05-27", "source_role": "cbc_official" }
  ]
}`,
    coverage: {
      rows: undefined,
      window: { en: "Latest set values (as of 2026-05-27)", zh: "最新設定值（截至 2026-05-27）" },
      frequency: { en: "On policy change", zh: "政策調整時更新" },
    },
    params: REFERENCE_PARAMS,
  },

  // 5) structure-reference — reference grade, active-snapshot master
  "security-master": {
    slug: "security-master",
    description: {
      en: "Security master — the active reference record for each listed security (identity, listing board, industry).",
      zh: "股票主檔——每檔上市櫃證券的現用參考資料（識別、上市櫃別、產業）。",
    },
    overview: [
      {
        en: "security-master is a reference dataset: one active record per security, not a time series. Use it to resolve a ticker to its name, board and industry. It is an active snapshot — the full point-in-time lifecycle (renames, delistings) is not yet integrated.",
        zh: "security-master 為參考型資料集:每檔證券一筆現用紀錄,非時間序列。用於將代碼解析為名稱、上市櫃別與產業。此為現用快照——完整 point-in-time 生命週期(更名、下市)尚未整合。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "name", type: "string", desc: { en: "Security name.", zh: "證券名稱。" } },
      { name: "board", type: "string", desc: { en: "Listing board (TWSE / TPEx).", zh: "上市櫃別（TWSE／TPEx）。" } },
      { name: "industry", type: "string", desc: { en: "Industry classification.", zh: "產業分類。" } },
      { name: "source_role", type: "string", desc: { en: "official_twse_issuer_profile.", zh: "official_twse_issuer_profile。" } },
    ],
    exampleJson: {
      en: `{
  "data": [
    {
      "symbol": "2330",
      "name": "TSMC",
      "board": "TWSE",
      "industry": "Semiconductor",
      "source_role": "official_twse_issuer_profile",
      "as_of": "2026-05-28"
    }
  ]
}`,
      zh: `{
  "data": [
    {
      "symbol": "2330",
      "name": "台積電",
      "board": "TWSE",
      "industry": "半導體業",
      "source_role": "official_twse_issuer_profile",
      "as_of": "2026-05-28"
    }
  ]
}`,
    },
    coverage: {
      window: { en: "Active securities (current snapshot)", zh: "現用證券（當前快照）" },
      frequency: { en: "Snapshot", zh: "快照" },
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Active snapshot only — not survivorship-safe for backtests that need delisted names at a past date.",
        zh: "僅現用快照——對需要過去某日已下市名稱的回測不具倖存者偏誤安全性。",
      },
    ],
  },

  // 6) companies-events — verified provenance, MOPS/TWSE; count not in SSOT → TODO
  "events": {
    slug: "events",
    description: {
      en: "Corporate events calendar — material announcements and scheduled events across TWSE / TPEx / MOPS, normalized into one timeline.",
      zh: "公司事件日曆——TWSE／TPEx／MOPS 的重大訊息與排定事件,正規化為單一時間軸。",
    },
    overview: [
      {
        en: "events returns one row per company event with a normalized type and its source. It merges announcements from multiple official venues so an agent can watch a single stream instead of three.",
        zh: "events 每筆公司事件回傳一列,附正規化類型與來源。它整合多個官方管道的公告,讓 agent 只需關注單一資料流而非三個。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "event_date", type: "string", desc: { en: "Event / announcement date.", zh: "事件／公告日期。" } },
      { name: "event_type", type: "string", desc: { en: "Normalized event type.", zh: "正規化事件類型。" } },
      { name: "title", type: "string", desc: { en: "Event title.", zh: "事件標題。" } },
      { name: "source_role", type: "string", desc: { en: "official_mops_major_event.", zh: "official_mops_major_event。" } },
    ],
    exampleJson: {
      en: `{
  "data": [
    {
      "symbol": "6990",
      "event_date": "2026-07-18",
      "event_type": "material_announcement",
      "title": "Material announcement",
      "source_role": "official_mops_major_event"
    }
  ]
}`,
      zh: `{
  "data": [
    {
      "symbol": "6990",
      "event_date": "2026-07-18",
      "event_type": "material_announcement",
      "title": "重大訊息公告",
      "source_role": "official_mops_major_event"
    }
  ]
}`,
    },
    coverage: null,
    coverageTodo: {
      en: "TODO — exact event counts and the coverage window are pending a measured snapshot; the source is the official MOPS / TWSE / TPEx announcement venues (present through the latest disclosure).",
      zh: "TODO — 精確事件數與涵蓋視窗待量測快照;來源為官方 MOPS／TWSE／TPEx 公告管道(涵蓋至最新揭露)。",
    },
    params: STANDARD_PARAMS,
  },

  // 7) derivatives — data exists but the doc-build key is not entitled to query → coverage TODO
  "derivatives-market": {
    slug: "derivatives-market",
    description: {
      en: "TAIFEX futures market data — daily settlement, volume and open interest for listed futures contracts.",
      zh: "TAIFEX 期貨市場資料——上市期貨契約的每日結算、成交量與未平倉量。",
    },
    overview: [
      {
        en: "derivatives-market returns TAIFEX futures daily records sourced from the official exchange feed. Coverage begins in the late 1990s with daily cadence.",
        zh: "derivatives-market 回傳 TAIFEX 期貨每日紀錄,來源為官方交易所資料。涵蓋自 1990 年代末起,每日更新。",
      },
    ],
    fields: [
      { name: "contract", type: "string", desc: { en: "Futures contract code.", zh: "期貨契約代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "settlement_price", type: "number", desc: { en: "Daily settlement price.", zh: "每日結算價。" } },
      { name: "open_interest", type: "number", desc: { en: "Open interest.", zh: "未平倉量。" } },
      { name: "source_role", type: "string", desc: { en: "official_taifex.", zh: "official_taifex。" } },
    ],
    exampleJson: `{
  "data": [
    { "contract": "TXF", "date": "TODO", "settlement_price": null, "open_interest": null, "source_role": "official_taifex" }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — real example values, exact row counts and the coverage window are pending an entitled key at doc-build time. The data exists (TAIFEX futures, daily, coverage from the late 1990s) but was not queryable from this build session, so no numbers are shown rather than fabricated ones.",
      zh: "TODO — 真實範例值、精確列數與涵蓋視窗待建置時具權限的金鑰。資料存在(TAIFEX 期貨、每日、涵蓋自 1990 年代末),但本建置階段無法查詢,故不顯示數字而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "This page is published so the endpoint is documented, but its live numbers are intentionally left as TODO until measured from an entitled key — no placeholder values are shown.",
        zh: "本頁先發佈以記錄端點,但即時數字刻意保留為 TODO,直到以具權限金鑰量測——不顯示任何佔位數值。",
      },
    ],
  },

  // 8) funds-intel — reference metadata; counts not confirmed this session → coverage TODO
  "fund-etf-metadata": {
    slug: "fund-etf-metadata",
    description: {
      en: "Fund / ETF metadata — the reference record for each listed fund and ETF (identity, issuer, type).",
      zh: "基金／ETF 主檔——每檔上市基金與 ETF 的參考資料（識別、發行機構、類型）。",
    },
    overview: [
      {
        en: "fund-etf-metadata is a reference dataset: one record per fund/ETF used to resolve a code to its issuer and type. It is metadata, not a price or flow time series.",
        zh: "fund-etf-metadata 為參考型資料集:每檔基金／ETF 一筆紀錄,用於將代碼解析為發行機構與類型。屬 metadata,非價格或資金流時間序列。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Fund / ETF code.", zh: "基金／ETF 代碼。" } },
      { name: "name", type: "string", desc: { en: "Fund / ETF name.", zh: "基金／ETF 名稱。" } },
      { name: "issuer", type: "string", desc: { en: "Issuing institution.", zh: "發行機構。" } },
      { name: "fund_type", type: "string", desc: { en: "Fund / ETF type.", zh: "基金／ETF 類型。" } },
    ],
    exampleJson: `{
  "data": [
    { "symbol": "TODO", "name": "TODO", "issuer": "TODO", "fund_type": "TODO" }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — real example values and exact counts are pending a measured snapshot / entitled key at doc-build time; the dataset is issuer-sourced fund & ETF reference metadata.",
      zh: "TODO — 真實範例值與精確計數待建置時的量測快照／具權限金鑰;此資料集為發行機構來源的基金與 ETF 參考 metadata。",
    },
    params: REFERENCE_PARAMS,
  },
};

export function getDatasetDocContent(slug: string): DatasetDocContent | null {
  return DATASET_DOC_CONTENT[slug] ?? null;
}
