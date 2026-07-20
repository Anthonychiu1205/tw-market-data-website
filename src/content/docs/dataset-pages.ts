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

// ── Financials & Growth (7 pages) ──

  // income-statement — MOPS, verified; no measured coverage snapshot yet → TODO
  "income-statement": {
    slug: "income-statement",
    description: {
      en: "Quarterly income statements for listed companies, sourced from MOPS — revenue down to operating and net income, with per-share earnings.",
      zh: "上市櫃公司季度損益表,來源為公開資訊觀測站(MOPS)——自營收到營業利益、稅後淨利與每股盈餘。",
    },
    overview: [
      {
        en: "income-statement returns one row per company per fiscal period from the official MOPS financial-statement filings. Each row carries a source role and lineage naming the exact MOPS form, so a figure can be audited back to the filing rather than taken on trust.",
        zh: "income-statement 以官方 MOPS 財報申報為源,每家公司每個會計期間回傳一列;每列附來源角色與 lineage 標明所屬 MOPS 表單,任一數字可回溯申報稿而非黑箱。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period", type: "string", desc: { en: "Fiscal period (e.g. 2026-Q1).", zh: "會計期間(如 2026-Q1)。" } },
      { name: "revenue", type: "number", desc: { en: "Net revenue (TWD thousands).", zh: "營業收入淨額(新台幣仟元)。" } },
      { name: "operating_income", type: "number", desc: { en: "Operating income (TWD thousands).", zh: "營業利益(新台幣仟元)。" } },
      { name: "net_income", type: "number", desc: { en: "Net income attributable to owners (TWD thousands).", zh: "歸屬母公司稅後淨利(新台幣仟元)。" } },
      { name: "eps", type: "number", desc: { en: "Basic earnings per share (TWD).", zh: "基本每股盈餘(新台幣元)。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_mops_income_statement).", zh: "正規來源角色(official_mops_income_statement)。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "period": "2026-Q1",
      "revenue": 839254000,
      "operating_income": 411800000,
      "net_income": 361560000,
      "eps": 13.94,
      "source_role": "official_mops_income_statement",
      "lineage": {
        "endpoint_name": "income_statement",
        "source_authority": "MOPS (income statement)",
        "payload_date": "2026-05-15"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official MOPS income-statement filings (present through the latest disclosed reporting period). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;來源為官方 MOPS 損益表申報(涵蓋至最新揭露之申報期間)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Filed statements are point-in-time sensitive and get restated: pass as_of when backtesting so you only see figures that were public at that moment.",
        zh: "申報財報具時間點敏感性且會重編:回測時請帶 as_of,只會看到當下已公開的數字。",
      },
    ],
  },

  // balance-sheet — MOPS, verified; no measured coverage snapshot yet → TODO
  "balance-sheet": {
    slug: "balance-sheet",
    description: {
      en: "Quarterly balance sheets for listed companies, sourced from MOPS — total assets, liabilities and equity as filed.",
      zh: "上市櫃公司季度資產負債表,來源為公開資訊觀測站(MOPS)——申報之資產、負債與權益總額。",
    },
    overview: [
      {
        en: "balance-sheet returns one row per company per fiscal period from the official MOPS filings. The lineage block names the exact MOPS form the figures came from, so the balance is traceable to its source statement.",
        zh: "balance-sheet 以官方 MOPS 申報為源,每家公司每個會計期間回傳一列;lineage 欄位標明數字來自哪一份 MOPS 表單,結構可回溯原始報表。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period", type: "string", desc: { en: "Fiscal period (e.g. 2026-Q1).", zh: "會計期間(如 2026-Q1)。" } },
      { name: "total_assets", type: "number", desc: { en: "Total assets (TWD thousands).", zh: "資產總額(新台幣仟元)。" } },
      { name: "total_liabilities", type: "number", desc: { en: "Total liabilities (TWD thousands).", zh: "負債總額(新台幣仟元)。" } },
      { name: "total_equity", type: "number", desc: { en: "Total equity (TWD thousands).", zh: "權益總額(新台幣仟元)。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_mops_balance_sheet).", zh: "正規來源角色(official_mops_balance_sheet)。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "period": "2026-Q1",
      "total_assets": 7150000000,
      "total_liabilities": 2050000000,
      "total_equity": 5100000000,
      "source_role": "official_mops_balance_sheet",
      "lineage": {
        "endpoint_name": "balance_sheet",
        "source_authority": "MOPS (balance sheet)",
        "payload_date": "2026-05-15"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official MOPS balance-sheet filings (present through the latest disclosed reporting period). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;來源為官方 MOPS 資產負債表申報(涵蓋至最新揭露之申報期間)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Filed statements are point-in-time sensitive and get restated: pass as_of when backtesting so you only see figures that were public at that moment.",
        zh: "申報財報具時間點敏感性且會重編:回測時請帶 as_of,只會看到當下已公開的數字。",
      },
    ],
  },

  // cash-flow-statement — MOPS, verified; no measured coverage snapshot yet → TODO
  "cash-flow-statement": {
    slug: "cash-flow-statement",
    description: {
      en: "Quarterly cash-flow statements for listed companies, sourced from MOPS — operating, investing and financing cash flows as filed.",
      zh: "上市櫃公司季度現金流量表,來源為公開資訊觀測站(MOPS)——申報之營業、投資與籌資活動現金流量。",
    },
    overview: [
      {
        en: "cash-flow-statement returns one row per company per fiscal period from the official MOPS filings. Each row carries a source role and lineage naming the exact MOPS form, so a cash-flow figure can be audited back to the filing.",
        zh: "cash-flow-statement 以官方 MOPS 申報為源,每家公司每個會計期間回傳一列;每列附來源角色與 lineage 標明所屬 MOPS 表單,現金流數字可回溯申報稿。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period", type: "string", desc: { en: "Fiscal period (e.g. 2026-Q1).", zh: "會計期間(如 2026-Q1)。" } },
      { name: "operating_cash_flow", type: "number", desc: { en: "Net cash from operating activities (TWD thousands).", zh: "營業活動之淨現金流量(新台幣仟元)。" } },
      { name: "investing_cash_flow", type: "number", desc: { en: "Net cash from investing activities (TWD thousands).", zh: "投資活動之淨現金流量(新台幣仟元)。" } },
      { name: "financing_cash_flow", type: "number", desc: { en: "Net cash from financing activities (TWD thousands).", zh: "籌資活動之淨現金流量(新台幣仟元)。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_mops_cash_flow_statement).", zh: "正規來源角色(official_mops_cash_flow_statement)。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "period": "2026-Q1",
      "operating_cash_flow": 485000000,
      "investing_cash_flow": -298000000,
      "financing_cash_flow": -142000000,
      "source_role": "official_mops_cash_flow_statement",
      "lineage": {
        "endpoint_name": "cash_flow_statement",
        "source_authority": "MOPS (cash-flow statement)",
        "payload_date": "2026-05-15"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official MOPS cash-flow-statement filings (present through the latest disclosed reporting period). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;來源為官方 MOPS 現金流量表申報(涵蓋至最新揭露之申報期間)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Filed statements are point-in-time sensitive and get restated: pass as_of when backtesting so you only see figures that were public at that moment.",
        zh: "申報財報具時間點敏感性且會重編:回測時請帶 as_of,只會看到當下已公開的數字。",
      },
    ],
  },

  // financials — MOPS, verified; the three statements merged into one row → TODO coverage
  "financials": {
    slug: "financials",
    description: {
      en: "The three financial statements merged into one row per company per fiscal period, sourced from MOPS — headline income, balance-sheet and cash-flow figures side by side.",
      zh: "財報三表合併,來源為公開資訊觀測站(MOPS)——每家公司每個會計期間一列,並列損益、資產負債與現金流量的關鍵數字。",
    },
    overview: [
      {
        en: "financials joins the income-statement, balance-sheet and cash-flow-statement filings into a single row per fiscal period so an agent can read a company's headline figures in one call. Each row keeps its source role and lineage back to the underlying MOPS forms.",
        zh: "financials 將損益表、資產負債表與現金流量表申報合併為每個會計期間一列,讓 agent 一次呼叫即可讀取公司關鍵數字;每列保留來源角色與回溯至底層 MOPS 表單的 lineage。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period", type: "string", desc: { en: "Fiscal period (e.g. 2026-Q1).", zh: "會計期間(如 2026-Q1)。" } },
      { name: "revenue", type: "number", desc: { en: "Net revenue from the income statement (TWD thousands).", zh: "損益表營業收入淨額(新台幣仟元)。" } },
      { name: "net_income", type: "number", desc: { en: "Net income from the income statement (TWD thousands).", zh: "損益表稅後淨利(新台幣仟元)。" } },
      { name: "total_assets", type: "number", desc: { en: "Total assets from the balance sheet (TWD thousands).", zh: "資產負債表資產總額(新台幣仟元)。" } },
      { name: "operating_cash_flow", type: "number", desc: { en: "Operating cash flow from the cash-flow statement (TWD thousands).", zh: "現金流量表營業活動淨現金流量(新台幣仟元)。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_mops_financial_statements).", zh: "正規來源角色(official_mops_financial_statements)。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "period": "2026-Q1",
      "revenue": 839254000,
      "net_income": 361560000,
      "total_assets": 7150000000,
      "operating_cash_flow": 485000000,
      "source_role": "official_mops_financial_statements",
      "lineage": {
        "source_authority": "MOPS financial statements",
        "payload_date": "2026-05-15"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official MOPS financial-statement filings (present through the latest disclosed reporting period). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;來源為官方 MOPS 財報申報(涵蓋至最新揭露之申報期間)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Filed statements are point-in-time sensitive and get restated: pass as_of when backtesting so you only see figures that were public at that moment.",
        zh: "申報財報具時間點敏感性且會重編:回測時請帶 as_of,只會看到當下已公開的數字。",
      },
    ],
  },

  // financial-metrics — MOPS, DERIVED (ratios computed from official statements) → TODO coverage
  "financial-metrics": {
    slug: "financial-metrics",
    description: {
      en: "Financial ratios computed from the official MOPS statements — margins, returns and other per-period metrics, one row per company per fiscal period.",
      zh: "由官方 MOPS 財報計算的財務比率——利潤率、報酬率等每期指標,每家公司每個會計期間一列。",
    },
    overview: [
      {
        en: "financial-metrics is a derived dataset: the ratios are computed from the underlying MOPS income-statement and balance-sheet filings, not disclosed directly. The lineage block names what each figure was derived from, so the calculation stays auditable rather than a black box.",
        zh: "financial-metrics 為推導型資料集:比率由底層 MOPS 損益表與資產負債表申報計算而得,非官方直接揭露。lineage 欄位標明每個數字的推導來源,計算過程可稽核而非黑箱。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period", type: "string", desc: { en: "Fiscal period (e.g. 2026-Q1).", zh: "會計期間(如 2026-Q1)。" } },
      { name: "gross_margin", type: "number", desc: { en: "Gross margin (ratio, 0-1).", zh: "毛利率(比值,0-1)。" } },
      { name: "operating_margin", type: "number", desc: { en: "Operating margin (ratio, 0-1).", zh: "營業利益率(比值,0-1)。" } },
      { name: "net_margin", type: "number", desc: { en: "Net margin (ratio, 0-1).", zh: "稅後淨利率(比值,0-1)。" } },
      { name: "roe", type: "number", desc: { en: "Return on equity for the period (ratio).", zh: "當期股東權益報酬率(比值)。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_mops_financial_metrics).", zh: "正規來源角色(derived_mops_financial_metrics)。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "period": "2026-Q1",
      "gross_margin": 0.582,
      "operating_margin": 0.491,
      "net_margin": 0.431,
      "roe": 0.071,
      "source_role": "derived_mops_financial_metrics",
      "lineage": {
        "derived_from": "official_mops_income_statement + official_mops_balance_sheet",
        "source_authority": "MOPS financial statements",
        "computed_at": "2026-05-16"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the ratios are computed from the official MOPS income-statement and balance-sheet filings (present through the latest disclosed reporting period). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;比率由官方 MOPS 損益表與資產負債表申報計算(涵蓋至最新揭露之申報期間)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: every ratio is computed from official MOPS statements, so it inherits the source restatements — recompute against as_of figures for backtests.",
        zh: "推導而非官方揭露:每個比率皆由官方 MOPS 財報計算,會承接來源的重編——回測時請以 as_of 數字重新計算。",
      },
    ],
  },

  // monthly-revenue-enhanced — MOPS, DERIVED (growth + trailing metrics on top of monthly revenue) → TODO coverage
  "monthly-revenue-enhanced": {
    slug: "monthly-revenue-enhanced",
    description: {
      en: "Monthly revenue with the growth and trailing metrics pre-computed — year-over-year, month-over-month and trailing-twelve-month revenue on top of the official MOPS figure.",
      zh: "增強月營收,已預先計算成長與滾動指標——在官方 MOPS 數字之上加上 YoY、MoM 與近十二個月(TTM)營收。",
    },
    overview: [
      {
        en: "monthly-revenue-enhanced is a derived dataset: it starts from the official MOPS monthly-revenue disclosure and adds the growth and trailing-twelve-month figures an agent would otherwise compute itself. The lineage block points back to the underlying MOPS form so the base number stays auditable.",
        zh: "monthly-revenue-enhanced 為推導型資料集:以官方 MOPS 月營收申報為基礎,附上原本需自行計算的成長率與近十二個月營收。lineage 欄位回指底層 MOPS 表單,基準數字可稽核。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period", type: "string", desc: { en: "Reporting month (YYYY-MM).", zh: "申報月份(YYYY-MM)。" } },
      { name: "revenue", type: "number", desc: { en: "Monthly revenue from MOPS (TWD thousands).", zh: "MOPS 月營收(新台幣仟元)。" } },
      { name: "yoy", type: "number", desc: { en: "Year-over-year revenue growth (ratio).", zh: "營收年增率(比值)。" } },
      { name: "mom", type: "number", desc: { en: "Month-over-month revenue growth (ratio).", zh: "營收月增率(比值)。" } },
      { name: "ttm_revenue", type: "number", desc: { en: "Trailing-twelve-month revenue (TWD thousands).", zh: "近十二個月營收(新台幣仟元)。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_mops_monthly_revenue_enhanced).", zh: "正規來源角色(derived_mops_monthly_revenue_enhanced)。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "period": "2026-05",
      "revenue": 416975163,
      "yoy": 0.382,
      "mom": 0.041,
      "ttm_revenue": 3210458000,
      "source_role": "derived_mops_monthly_revenue_enhanced",
      "lineage": {
        "derived_from": "official_mops_monthly_revenue",
        "source_authority": "MOPS t187ap05",
        "computed_at": "2026-06-10"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the metrics are computed from the official MOPS monthly-revenue disclosure (present through the latest disclosed month). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;指標由官方 MOPS 月營收申報計算(涵蓋至最新揭露月份)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: growth and trailing figures are computed from the official MOPS monthly revenue, which is point-in-time sensitive — pass as_of for backtests so trailing windows only use figures public at that moment.",
        zh: "推導而非官方揭露:成長率與滾動數字由官方 MOPS 月營收計算,月營收具時間點敏感性——回測請帶 as_of,使滾動視窗僅採用當下已公開的數字。",
      },
    ],
  },

  // dividends — MOPS, verified; dividend policy per fiscal year → TODO coverage
  "dividends": {
    slug: "dividends",
    description: {
      en: "Dividend policy for listed companies, sourced from MOPS — cash and stock dividends per fiscal year with the ex-dividend date.",
      zh: "上市櫃公司股利政策,來源為公開資訊觀測站(MOPS)——各年度現金與股票股利及除息日。",
    },
    overview: [
      {
        en: "dividends returns one row per company per fiscal year with the declared cash and stock dividends and the ex-dividend date, sourced from MOPS. Each row carries a source role and lineage back to the MOPS filing so the payout is traceable.",
        zh: "dividends 以 MOPS 為源,每家公司每個年度回傳一列,含宣告之現金與股票股利及除息日;每列附來源角色與回溯 MOPS 申報的 lineage,配息可追溯。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "fiscal_year", type: "string", desc: { en: "Fiscal year the dividend is drawn from.", zh: "股利所屬年度。" } },
      { name: "cash_dividend", type: "number", desc: { en: "Cash dividend per share (TWD).", zh: "每股現金股利(新台幣元)。" } },
      { name: "stock_dividend", type: "number", desc: { en: "Stock dividend per share (shares).", zh: "每股股票股利(股)。" } },
      { name: "ex_dividend_date", type: "string", desc: { en: "Ex-dividend date.", zh: "除息(權)日。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_mops_dividend_policy).", zh: "正規來源角色(official_mops_dividend_policy)。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "symbol": "2330",
      "fiscal_year": "2025",
      "cash_dividend": 16.5,
      "stock_dividend": 0.0,
      "ex_dividend_date": "2026-03-19",
      "source_role": "official_mops_dividend_policy",
      "lineage": {
        "endpoint_name": "dividend_policy",
        "source_authority": "MOPS (dividends)",
        "payload_date": "2026-02-20"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official MOPS dividend-policy filings (present through the latest disclosed distribution). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;來源為官方 MOPS 股利政策申報(涵蓋至最新揭露之配發)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "A dividend is only final once approved and the ex-date is set: pass as_of when backtesting so proposed-but-unapproved distributions do not leak into a past date.",
        zh: "股利須經核准且訂定除息日後方為定案:回測時請帶 as_of,避免尚未核准的擬議配發洩入過去日期。",
      },
    ],
  },

// 9) macro / business-indicator-monthly — NDC business-cycle indicators, monthly cadence; counts not measured this session → coverage TODO
  "business-indicator-monthly": {
    slug: "business-indicator-monthly",
    description: {
      en: "Taiwan business-cycle indicators from the NDC — the monthly monitoring signal plus the leading and coincident composite indices.",
      zh: "國家發展委員會（NDC）景氣指標——每月景氣對策信號,以及領先與同時綜合指數。",
    },
    overview: [
      {
        en: "business-indicator-monthly returns one row per indicator per month from the National Development Council (NDC) business-cycle release. Each row carries its source role and lineage, so a reading can be traced back to the exact NDC monthly publication rather than taken on trust.",
        zh: "business-indicator-monthly 以國家發展委員會(NDC)景氣指標發布為源,每個指標每個月份回傳一列;每列附來源角色與 lineage,任一數值可回溯到 NDC 當月原始發布,而非僅憑信任。",
      },
    ],
    fields: [
      { name: "indicator", type: "string", desc: { en: "Indicator code (e.g. monitoring_signal, leading_index, coincident_index).", zh: "指標代碼（如 monitoring_signal、leading_index、coincident_index）。" } },
      { name: "period", type: "string", desc: { en: "Reference month (YYYY-MM).", zh: "資料月份（YYYY-MM）。" } },
      { name: "value", type: "number", desc: { en: "Indicator value for the month (index level or signal score).", zh: "當月指標值（指數水準或信號分數）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_ndc_business_indicator).", zh: "正規來源角色（official_ndc_business_indicator）。" } },
      { name: "lineage", type: "object", desc: { en: "Upstream endpoint + authority (e.g. NDC business-cycle monitoring release).", zh: "上游端點與權威來源（如 NDC 景氣對策信號發布）。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "indicator": "monitoring_signal",
      "period": "2026-05",
      "value": 30,
      "unit": "score",
      "source_role": "official_ndc_business_indicator",
      "lineage": {
        "source_authority": "NDC business-cycle indicators",
        "payload_date": "2026-06-27"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact indicator / row counts and the coverage window are pending a measured snapshot; the source is the official NDC monthly business-cycle release (present through the latest published month). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確指標／列數與涵蓋視窗待量測快照;來源為官方 NDC 每月景氣指標發布(涵蓋至最新公布月份)。不顯示數字而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "For this macro dataset the symbol param is an NDC indicator code (e.g. monitoring_signal), not a stock ticker.",
        zh: "此總經資料集的 symbol 參數為 NDC 指標代碼（如 monitoring_signal），非股票代碼。",
      },
      {
        en: "Monthly cadence: the NDC publishes the previous month's business-cycle indicators on a lag, so the latest available period trails the current month.",
        zh: "每月更新:NDC 於落後一段時間後公布上一月景氣指標,故最新可得月份會落後於當前月份。",
      },
    ],
  },

  // 10) macro / macro-global — international-source macro context (not TWSE); counts not measured this session → coverage TODO
  "macro-global": {
    slug: "macro-global",
    description: {
      en: "Global macroeconomic context series compiled from international bodies — cross-country reference readings alongside the Taiwan-market datasets.",
      zh: "彙整自國際機構的全球總體經濟脈絡序列——與台股資料集並列的跨國參考數據。",
    },
    overview: [
      {
        en: "macro-global returns one row per indicator per period for global macro series compiled from international bodies. It is international-source context to sit alongside the Taiwan-market data, not a TWSE feed; each row carries its source role and lineage so the upstream authority is explicit.",
        zh: "macro-global 針對彙整自國際機構的全球總經序列,每個指標每個期別回傳一列。此為與台股資料並列的國際來源脈絡,非 TWSE 資料源;每列附來源角色與 lineage,上游權威來源清楚標明。",
      },
    ],
    fields: [
      { name: "indicator", type: "string", desc: { en: "Indicator code (e.g. gdp_growth, cpi_yoy).", zh: "指標代碼（如 gdp_growth、cpi_yoy）。" } },
      { name: "country", type: "string", desc: { en: "ISO country / region code.", zh: "ISO 國家／地區代碼。" } },
      { name: "period", type: "string", desc: { en: "Reference period (YYYY or YYYY-MM).", zh: "資料期別（YYYY 或 YYYY-MM）。" } },
      { name: "value", type: "number", desc: { en: "Indicator value for the period.", zh: "當期指標值。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (international_macro).", zh: "正規來源角色（international_macro）。" } },
      { name: "lineage", type: "object", desc: { en: "Upstream international body + release for the value.", zh: "數值所屬的上游國際機構與發布。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "indicator": "gdp_growth",
      "country": "US",
      "period": "2026-Q1",
      "value": 2.1,
      "unit": "percent",
      "source_role": "international_macro",
      "lineage": {
        "source_authority": "international statistical body",
        "payload_date": "2026-04-30"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact indicator / country / row counts and the coverage window are pending a measured snapshot; the source is international statistical bodies (present through their latest releases). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確指標／國家／列數與涵蓋視窗待量測快照;來源為國際統計機構(涵蓋至其最新發布)。不顯示數字而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "This is international-source macro context, not TWSE market data — use it to frame the Taiwan datasets, not as an exchange feed.",
        zh: "此為國際來源的總經脈絡,非 TWSE 市場資料——用於為台股資料集提供背景,而非交易所資料源。",
      },
      {
        en: "For this macro dataset the symbol param is an indicator code (e.g. gdp_growth), not a stock ticker.",
        zh: "此總經資料集的 symbol 參數為指標代碼（如 gdp_growth），非股票代碼。",
      },
    ],
  },

  // 11) macro / macro-worldbank — World Bank development indicators (international source, not TWSE); counts not measured this session → coverage TODO
  "macro-worldbank": {
    slug: "macro-worldbank",
    description: {
      en: "World Bank development indicators — long-run cross-country macro series sourced directly from the World Bank.",
      zh: "世界銀行發展指標——直接取自世界銀行的長期跨國總經序列。",
    },
    overview: [
      {
        en: "macro-worldbank returns one row per indicator per year for World Bank development indicators. It is international-source macro context, not a TWSE feed; each row names the World Bank indicator code in its lineage so a value can be reconciled against the original World Bank series.",
        zh: "macro-worldbank 針對世界銀行發展指標,每個指標每個年度回傳一列。此為國際來源的總經脈絡,非 TWSE 資料源;每列於 lineage 標明世界銀行指標代碼,數值可與世界銀行原始序列對帳。",
      },
    ],
    fields: [
      { name: "indicator", type: "string", desc: { en: "World Bank indicator code (e.g. NY.GDP.MKTP.CD).", zh: "世界銀行指標代碼（如 NY.GDP.MKTP.CD）。" } },
      { name: "country", type: "string", desc: { en: "ISO country / region code.", zh: "ISO 國家／地區代碼。" } },
      { name: "year", type: "integer", desc: { en: "Reference year.", zh: "資料年度。" } },
      { name: "value", type: "number", desc: { en: "Indicator value for the year.", zh: "當年度指標值。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (worldbank_indicator).", zh: "正規來源角色（worldbank_indicator）。" } },
      { name: "lineage", type: "object", desc: { en: "Upstream World Bank indicator + release for the value.", zh: "數值所屬的上游世界銀行指標與發布。" } },
    ],
    exampleJson: `{
  "data": [
    {
      "indicator": "NY.GDP.MKTP.CD",
      "country": "TW",
      "year": 2025,
      "value": 802000000000,
      "unit": "USD",
      "source_role": "worldbank_indicator",
      "lineage": {
        "source_authority": "World Bank",
        "indicator_code": "NY.GDP.MKTP.CD",
        "payload_date": "2026-04-15"
      }
    }
  ]
}`,
    coverage: null,
    coverageTodo: {
      en: "TODO — exact indicator / country / row counts and the coverage window are pending a measured snapshot; the source is the World Bank (present through its latest published year). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確指標／國家／列數與涵蓋視窗待量測快照;來源為世界銀行(涵蓋至其最新公布年度)。不顯示數字而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "This is World Bank international-source macro context, not TWSE market data — annual cadence with a reporting lag, so the latest year trails the current one.",
        zh: "此為世界銀行國際來源的總經脈絡,非 TWSE 市場資料——年度更新且有申報落差,故最新年度會落後於當前年度。",
      },
      {
        en: "For this macro dataset the symbol param is a World Bank indicator code (e.g. NY.GDP.MKTP.CD), not a stock ticker.",
        zh: "此總經資料集的 symbol 參數為世界銀行指標代碼（如 NY.GDP.MKTP.CD），非股票代碼。",
      },
    ],
  },

// structure-reference — issuer profile (reference grade, TWSE / TPEx)
  "issuer-profile": {
    slug: "issuer-profile",
    description: {
      en: "Issuer profile — the reference record of each listed company's corporate basics (registered name, industry, listing board, key dates).",
      zh: "公司基本資料——每家上市櫃公司的企業基本檔（登記名稱、產業、上市櫃別、重要日期）。",
    },
    overview: [
      {
        en: "issuer-profile is a reference dataset: one active record per issuer, not a time series. Use it to resolve a ticker to the company's registered identity, industry and listing board. It is an active snapshot — the full point-in-time history of renames, industry re-classifications and capital changes is not yet integrated.",
        zh: "issuer-profile 為參考型資料集:每家發行公司一筆現用紀錄,非時間序列。用於將代碼解析為公司登記身分、產業與上市櫃別。此為現用快照——更名、產業重分類與資本變動的完整 point-in-time 歷史尚未整合。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "company_name", type: "string", desc: { en: "Registered company name.", zh: "公司登記名稱。" } },
      { name: "industry", type: "string", desc: { en: "Industry classification.", zh: "產業分類。" } },
      { name: "board", type: "string", desc: { en: "Listing board (TWSE / TPEx).", zh: "上市櫃別（TWSE／TPEx）。" } },
      { name: "listing_date", type: "string", desc: { en: "Date the security was listed.", zh: "上市櫃日期。" } },
      { name: "source_role", type: "string", desc: { en: "official_twse_issuer_profile.", zh: "official_twse_issuer_profile。" } },
    ],
    exampleJson: {
      en: `{
  "data": [
    {
      "symbol": "2330",
      "company_name": "TSMC",
      "industry": "Semiconductor",
      "board": "TWSE",
      "listing_date": "1994-09-05",
      "source_role": "official_twse_issuer_profile",
      "as_of": "2026-05-28"
    }
  ]
}`,
      zh: `{
  "data": [
    {
      "symbol": "2330",
      "company_name": "台積電",
      "industry": "半導體業",
      "board": "TWSE",
      "listing_date": "1994-09-05",
      "source_role": "official_twse_issuer_profile",
      "as_of": "2026-05-28"
    }
  ]
}`,
    },
    coverage: null,
    coverageTodo: {
      en: "TODO — exact issuer counts and the active-snapshot window are pending a measured snapshot; the source is the official TWSE / TPEx issuer registers (current listed companies).",
      zh: "TODO — 精確發行公司數與現用快照視窗待量測快照;來源為官方 TWSE／TPEx 發行人登記(現有上市櫃公司)。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Active snapshot / lookup only — not a survivorship-safe time series; it does not reconstruct a company's profile as it stood at a past date.",
        zh: "僅現用快照／查表——非倖存者偏誤安全的時間序列;無法重建公司在過去某日的基本資料樣貌。",
      },
    ],
  },

  // structure-reference — broker-branch reference (reference grade, TWSE)
  "broker-branch-reference": {
    slug: "broker-branch-reference",
    description: {
      en: "Broker-branch reference — the lookup table mapping each broker branch code to its brokerage and branch identity.",
      zh: "券商分點參考——將每個券商分點代碼對映到所屬券商與分點身分的查表。",
    },
    overview: [
      {
        en: "broker-branch-reference is a reference dataset: one active record per broker branch, used to resolve a branch code appearing in broker-trading data into a readable brokerage and branch name. It is a lookup surface, not a time series of trades.",
        zh: "broker-branch-reference 為參考型資料集:每個券商分點一筆現用紀錄,用於將分點進出資料中出現的分點代碼解析為可讀的券商與分點名稱。此為查表面,非成交時間序列。",
      },
    ],
    fields: [
      { name: "branch_code", type: "string", desc: { en: "Broker branch code.", zh: "券商分點代碼。" } },
      { name: "broker_code", type: "string", desc: { en: "Parent brokerage code.", zh: "所屬券商代碼。" } },
      { name: "broker_name", type: "string", desc: { en: "Parent brokerage name.", zh: "所屬券商名稱。" } },
      { name: "branch_name", type: "string", desc: { en: "Branch name.", zh: "分點名稱。" } },
      { name: "source_role", type: "string", desc: { en: "official_twse_broker_branch.", zh: "official_twse_broker_branch。" } },
    ],
    exampleJson: {
      en: `{
  "data": [
    {
      "branch_code": "9800",
      "broker_code": "9800",
      "broker_name": "Yuanta Securities",
      "branch_name": "Yuanta Securities - Head Office",
      "source_role": "official_twse_broker_branch",
      "as_of": "2026-05-28"
    }
  ]
}`,
      zh: `{
  "data": [
    {
      "branch_code": "9800",
      "broker_code": "9800",
      "broker_name": "元大證券",
      "branch_name": "元大證券－總公司",
      "source_role": "official_twse_broker_branch",
      "as_of": "2026-05-28"
    }
  ]
}`,
    },
    coverage: null,
    coverageTodo: {
      en: "TODO — exact broker / branch counts and the active-snapshot window are pending a measured snapshot; the source is the official TWSE broker-branch register (current active branches).",
      zh: "TODO — 精確券商／分點數與現用快照視窗待量測快照;來源為官方 TWSE 券商分點登記(現有有效分點)。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Active snapshot / lookup only — not a survivorship-safe time series; closed or renamed branches from a past date are not reconstructed.",
        zh: "僅現用快照／查表——非倖存者偏誤安全的時間序列;過去已裁撤或更名的分點不會被重建。",
      },
    ],
  },

  // structure-reference — theme taxonomy (reference grade, TWMD)
  "theme-taxonomy": {
    slug: "theme-taxonomy",
    description: {
      en: "Theme taxonomy — the TWMD-maintained reference tree of investment themes and the industries / concepts each theme groups.",
      zh: "主題分類——由 TWMD 維護的投資主題參考樹,及每個主題所歸類的產業／概念。",
    },
    overview: [
      {
        en: "theme-taxonomy is a reference dataset: one record per theme node describing the classification tree TWMD uses to group securities. Use it to resolve a theme id to its label and parent, or to enumerate the themes available for tagging. It is a curated snapshot, not a time series.",
        zh: "theme-taxonomy 為參考型資料集:每個主題節點一筆紀錄,描述 TWMD 用來歸類證券的分類樹。用於將主題代碼解析為名稱與上層節點,或列舉可供標記的主題。此為策展快照,非時間序列。",
      },
    ],
    fields: [
      { name: "theme_id", type: "string", desc: { en: "Stable theme identifier.", zh: "穩定主題識別碼。" } },
      { name: "theme_name", type: "string", desc: { en: "Theme display name.", zh: "主題顯示名稱。" } },
      { name: "parent_id", type: "string", desc: { en: "Parent theme id (null at the root).", zh: "上層主題代碼（根節點為 null）。" } },
      { name: "level", type: "number", desc: { en: "Depth in the taxonomy tree.", zh: "分類樹層級深度。" } },
      { name: "source_role", type: "string", desc: { en: "twmd_theme_taxonomy.", zh: "twmd_theme_taxonomy。" } },
    ],
    exampleJson: {
      en: `{
  "data": [
    {
      "theme_id": "ai-supply-chain",
      "theme_name": "AI Supply Chain",
      "parent_id": "semiconductor",
      "level": 2,
      "source_role": "twmd_theme_taxonomy",
      "as_of": "2026-05-28"
    }
  ]
}`,
      zh: `{
  "data": [
    {
      "theme_id": "ai-supply-chain",
      "theme_name": "AI 供應鏈",
      "parent_id": "semiconductor",
      "level": 2,
      "source_role": "twmd_theme_taxonomy",
      "as_of": "2026-05-28"
    }
  ]
}`,
    },
    coverage: null,
    coverageTodo: {
      en: "TODO — exact theme-node counts and the taxonomy version window are pending a measured snapshot; the source is the TWMD-maintained theme taxonomy (current curated tree).",
      zh: "TODO — 精確主題節點數與分類版本視窗待量測快照;來源為 TWMD 維護的主題分類(現行策展樹)。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Curated active snapshot / lookup only — not a survivorship-safe time series; theme definitions can be revised, and past tree versions are not reconstructed.",
        zh: "僅策展現用快照／查表——非倖存者偏誤安全的時間序列;主題定義可能修訂,過去的分類樹版本不會被重建。",
      },
    ],
  },

  // structure-reference — screener (derived grade, TWSE / TPEx)
  "screener": {
    slug: "screener",
    description: {
      en: "Screener — a derived convenience surface that returns the securities matching a set of filter criteria, computed over official market and financial data.",
      zh: "選股器——衍生便利面,回傳符合一組篩選條件的證券,係基於官方市場與財務資料計算而得。",
    },
    overview: [
      {
        en: "screener returns one row per matching security for the filters supplied, computed on top of official TWSE / TPEx market and financial datasets. It is a derived convenience layer: the underlying values come from official sources, but the match list itself is computed by TWMD rather than published by an exchange.",
        zh: "screener 依所給篩選條件,每檔符合的證券回傳一列,係在官方 TWSE／TPEx 市場與財務資料集之上計算而成。它是衍生便利層:底層數值來自官方來源,但符合清單本身由 TWMD 計算,而非交易所發布。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker of the matching security.", zh: "符合證券的股票代碼。" } },
      { name: "name", type: "string", desc: { en: "Security name.", zh: "證券名稱。" } },
      { name: "matched_filters", type: "array", desc: { en: "Which filter criteria this row satisfied.", zh: "此列所滿足的篩選條件。" } },
      { name: "as_of", type: "string", desc: { en: "Data date the screen was computed against.", zh: "本次篩選計算所依據的資料日期。" } },
      { name: "source_role", type: "string", desc: { en: "twmd_derived_screener.", zh: "twmd_derived_screener。" } },
    ],
    exampleJson: {
      en: `{
  "data": [
    {
      "symbol": "2330",
      "name": "TSMC",
      "matched_filters": ["market_cap_gt_1t", "pe_lt_30"],
      "as_of": "2026-07-17",
      "source_role": "twmd_derived_screener"
    }
  ]
}`,
      zh: `{
  "data": [
    {
      "symbol": "2330",
      "name": "台積電",
      "matched_filters": ["market_cap_gt_1t", "pe_lt_30"],
      "as_of": "2026-07-17",
      "source_role": "twmd_derived_screener"
    }
  ]
}`,
    },
    coverage: null,
    coverageTodo: {
      en: "TODO — the size of the screenable universe and the data window are pending a measured snapshot; the screen is computed over official TWSE / TPEx market and financial data (current trading day).",
      zh: "TODO — 可篩選宇宙的規模與資料視窗待量測快照;篩選係在官方 TWSE／TPEx 市場與財務資料上計算(當前交易日)。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Derived / computed convenience over official data — not itself an official published list. Results depend on the filters and the as_of data date; reproduce a screen by pinning as_of.",
        zh: "係在官方資料之上的衍生／計算便利結果——本身非官方發布清單。結果取決於篩選條件與 as_of 資料日期;固定 as_of 即可重現同一次篩選。",
      },
    ],
  },

  // structure-reference — warrants reference (reference grade, TWSE / TPEx)
  "warrants-reference": {
    slug: "warrants-reference",
    description: {
      en: "Warrants reference — the master record for each listed warrant (identity, underlying, type and key contract terms).",
      zh: "權證參考——每檔上市權證的主檔（識別、標的、類型與主要契約條件）。",
    },
    overview: [
      {
        en: "warrants-reference is a reference dataset: one active record per listed warrant, used to resolve a warrant code to its underlying, type and contract terms. It is an active snapshot of currently listed warrants, not a price or trading time series.",
        zh: "warrants-reference 為參考型資料集:每檔上市權證一筆現用紀錄,用於將權證代碼解析為標的、類型與契約條件。此為現有上市權證的現用快照,非價格或成交時間序列。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Warrant code.", zh: "權證代碼。" } },
      { name: "warrant_name", type: "string", desc: { en: "Warrant name.", zh: "權證名稱。" } },
      { name: "underlying_symbol", type: "string", desc: { en: "Underlying security ticker.", zh: "標的證券代碼。" } },
      { name: "warrant_type", type: "string", desc: { en: "Call / put and style.", zh: "認購／認售與類型。" } },
      { name: "last_trading_date", type: "string", desc: { en: "Last trading date of the warrant.", zh: "權證最後交易日。" } },
      { name: "source_role", type: "string", desc: { en: "official_twse_warrant_master.", zh: "official_twse_warrant_master。" } },
    ],
    exampleJson: {
      en: `{
  "data": [
    {
      "symbol": "030001",
      "warrant_name": "TSMC Yuanta Call 01",
      "underlying_symbol": "2330",
      "warrant_type": "call",
      "last_trading_date": "2026-12-15",
      "source_role": "official_twse_warrant_master",
      "as_of": "2026-05-28"
    }
  ]
}`,
      zh: `{
  "data": [
    {
      "symbol": "030001",
      "warrant_name": "台積電元大購01",
      "underlying_symbol": "2330",
      "warrant_type": "call",
      "last_trading_date": "2026-12-15",
      "source_role": "official_twse_warrant_master",
      "as_of": "2026-05-28"
    }
  ]
}`,
    },
    coverage: null,
    coverageTodo: {
      en: "TODO — exact warrant counts and the active-snapshot window are pending a measured snapshot; the source is the official TWSE / TPEx warrant register (currently listed warrants).",
      zh: "TODO — 精確權證檔數與現用快照視窗待量測快照;來源為官方 TWSE／TPEx 權證登記(現有上市權證)。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Active snapshot / lookup only — not a survivorship-safe time series; expired or delisted warrants from a past date are not reconstructed here.",
        zh: "僅現用快照／查表——非倖存者偏誤安全的時間序列;過去已到期或下市的權證不會在此被重建。",
      },
    ],
  },
};

export function getDatasetDocContent(slug: string): DatasetDocContent | null {
  return DATASET_DOC_CONTENT[slug] ?? null;
}
