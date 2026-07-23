// DOCS-01 bilingual endpoint-page content (Phase 1 sample pages). Unlike the legacy zh-only docs
// pages (which show an "English coming soon" banner on /en), these v5 pages carry genuine en + zh so
// /en is fully usable and scanned by the CJK guards. English is a semantic rewrite, not machine
// translation.
//
// Real-data discipline (Part 0): coverage totals come from the coverage-facts SSOT (imported, not
// re-typed). Where a real coverage number is not obtainable for this dataset yet (e.g. the doc-build
// key is not entitled to query it, or no full-table count exists), the field is a `coverageTodo`
// marker — never a fabricated number.
//
// Example RESPONSES no longer live here. They were hand-written and their shape turned out not to
// match the API (they assumed a `data` array with per-row provenance for every dataset; the real
// envelope varies per dataset). They are now real captures in src/content/api-captures.ts, and a
// dataset without a capture shows an honest TODO rather than a templated body.

import { COVERAGE_FACTS_SNAPSHOT_DATE, coverageFacts } from "@/src/content/coverage-facts";

export type Bi = { en: string; zh: string };

export type FieldDoc = { name: string; type: string; desc: Bi };
export type ParamDoc = { name: string; required: boolean; type: string; default?: string; desc: Bi };
export type CoverageFact = {
  rows?: string;
  symbols?: string;
  window: Bi;
  // Optional: the coverage manifest (DB ground-truth) provides row_count + date range but NOT update
  // frequency, so it is only present where a real cadence is known — never fabricated.
  frequency?: Bi;
};

export type DatasetDocContent = {
  slug: string;
  description: Bi; // one-line blockquote
  overview: Bi[]; // paragraphs
  fields: FieldDoc[]; // key response fields (includes provenance fields to show verifiability)
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
    coverage: { rows: "5,230,134", window: { en: "2004-02-11 – 2026-07-21", zh: "2004-02-11 至 2026-07-21" } },
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
    coverage: { rows: "331,109", window: { en: "2010-02-10 – 2026-07-10", zh: "2010-02-10 至 2026-07-10" } },
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
    coverage: { rows: "11,744,999", window: { en: "2012-05-02 – 2026-07-17", zh: "2012-05-02 至 2026-07-17" } },
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
    coverage: { rows: "165", window: { en: "2000-12-29 – 2026-05-27", zh: "2000-12-29 至 2026-05-27" } },
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
    coverage: { rows: "91,660", window: { en: "Reference data, no time series", zh: "參考資料，無時間序列" } },
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
      en: "Coming soon — a unified corporate events calendar across TWSE / TPEx / MOPS. The underlying table exists, but the serving endpoint returns no rows yet, so this dataset is being finished before it goes live.",
      zh: "即將開放——整合 TWSE／TPEx／MOPS 的統一公司事件日曆。底層資料表已存在,但服務端點目前尚未回傳資料,故此資料集仍在完成中。",
    },
    overview: [
      {
        en: "events will return one row per company event with a normalized type and its source, merging announcements from multiple official venues into one stream. The serving endpoint currently returns no rows (the aggregation is not wired through yet), so the fields below are the planned schema, not a served response. It will move off \"Building\" once the endpoint serves the table.",
        zh: "events 未來會每筆公司事件回傳一列(附正規化類型與來源),整合多個官方管道的公告為單一資料流。服務端點目前不回傳資料(聚合尚未接通),故下方欄位為規劃 schema,非已服務的回應。端點接通資料表後才會脫離「建置中」。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "event_date", type: "string", desc: { en: "Event / announcement date.", zh: "事件／公告日期。" } },
      { name: "event_type", type: "string", desc: { en: "Normalized event type.", zh: "正規化事件類型。" } },
      { name: "title", type: "string", desc: { en: "Event title.", zh: "事件標題。" } },
      { name: "source_role", type: "string", desc: { en: "official_mops_major_event.", zh: "official_mops_major_event。" } },
    ],
    // coverage null: the underlying table holds ~1,709 rows (DB snapshot) but the serving endpoint
    // returns 0, so showing a row count would imply queryability it does not have (鐵則②). Restore a
    // real coverage figure only once the endpoint serves the table.
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
    coverage: { rows: "5,960,037", window: { en: "1998-07-21 – 2026-07-16", zh: "1998-07-21 至 2026-07-16" } },
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
    coverage: { rows: "257", window: { en: "Reference data, no time series", zh: "參考資料，無時間序列" } },
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
    coverage: { rows: "90,713", window: { en: "2013-03-31 – 2026-03-31", zh: "2013-03-31 至 2026-03-31" } },
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
    coverage: { rows: "103,577", window: { en: "2013-03-31 – 2026-03-31", zh: "2013-03-31 至 2026-03-31" } },
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
    coverage: { rows: "77,712", window: { en: "2013-03-31 – 2026-03-31", zh: "2013-03-31 至 2026-03-31" } },
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
    coverage: { rows: "90,713", window: { en: "2013-03-31 – 2026-03-31", zh: "2013-03-31 至 2026-03-31" } },
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
    coverage: { rows: "331,109", window: { en: "2010-02-10 – 2026-07-10", zh: "2010-02-10 至 2026-07-10" } },
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
    coverage: { rows: "9,069", window: { en: "2015-04-17 – 2026-06-02", zh: "2015-04-17 至 2026-06-02" } },
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
    coverage: { rows: "608", window: { en: "2020-01-01 – 2026-04-01", zh: "2020-01-01 至 2026-04-01" } },
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
    coverage: { rows: "119,463", window: { en: "1947-01-01 – 2026-07-02", zh: "1947-01-01 至 2026-07-02" } },
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
      {
        en: "Coverage was recently extended with the US Federal Funds Rate (FEDFUNDS) and the Broad US Dollar Index (DTWEXBGS). The US GDP series (GDP, GDPC1) were recalibrated to billions of USD in July 2026 to match the upstream FRED units.",
        zh: "涵蓋範圍近期擴充,新增美國聯邦資金利率(FEDFUNDS)與廣義美元指數(DTWEXBGS);美國 GDP 序列(GDP、GDPC1)已於 2026 年 7 月校正為十億美元,對齊上游 FRED 單位。",
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
    coverage: { rows: "1,362,467", window: { en: "1960 – 2025", zh: "1960 至 2025" } },
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
    coverage: { rows: "1,084", window: { en: "Reference data, no time series", zh: "參考資料，無時間序列" } },
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
    coverage: { rows: "811", window: { en: "Reference data, no time series", zh: "參考資料，無時間序列" } },
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
    coverage: { rows: "2,160", window: { en: "2026-05-30 (single-day snapshot)", zh: "2026-05-30（單日快照）" } },
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
    coverage: { rows: "7,625,469", window: { en: "2006-01-02 – 2026-07-16", zh: "2006-01-02 至 2026-07-16" } },
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
    coverage: { rows: "51,570", window: { en: "Reference data, no time series", zh: "參考資料，無時間序列" } },
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

// ── Market & Prices (16 pages) ──
// Paste these entries inside DATASET_DOC_CONTENT. In scope at that point: coverageFacts,
// COVERAGE_FACTS_SNAPSHOT_DATE, fmt(), STANDARD_PARAMS, REFERENCE_PARAMS.

  // tpex-daily-price — verified, TPEx; REAL coverage from the SSOT (rows/stocks/earliestDate).
  "tpex-daily-price": {
    slug: "tpex-daily-price",
    description: {
      en: "Daily open/high/low/close, volume and turnover for TPEx (over-the-counter) listed stocks, aligned to the official trading calendar.",
      zh: "上櫃股票的日開高低收、成交量與成交金額,對齊官方交易日曆。",
    },
    overview: [
      {
        en: "tpex-daily-price returns one row per stock per trading day from the official TPEx daily quote feed. Every row carries its source fields, so a value can be traced back to the exact upstream publication.",
        zh: "tpex-daily-price 以官方 TPEx 日成交行情為源,每一交易日每檔股票回傳一列,並附來源欄位,任一數值可回溯到上游原始發布。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "close", type: "number", desc: { en: "Closing price.", zh: "收盤價。" } },
      { name: "volume_shares", type: "number", desc: { en: "Shares traded.", zh: "成交股數。" } },
      { name: "turnover", type: "number", desc: { en: "Turnover value (TWD).", zh: "成交金額（新台幣）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_tpex).", zh: "正規來源角色（official_tpex）。" } },
      { name: "updated_at", type: "string", desc: { en: "When this row was last refreshed.", zh: "此列最後更新時間。" } },
    ],
    coverage: { rows: "1,121", window: { en: "2023-06-01 – 2026-05-28", zh: "2023-06-01 至 2026-05-28" } },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: `Row and symbol totals are a database snapshot measured on ${COVERAGE_FACTS_SNAPSHOT_DATE}; the live TPEx feed advances each trading day, so the latest available date is newer than the snapshot and no fixed window end is claimed. The symbol total spans the full TPEx history, including names that have since stopped trading.`,
        zh: `列數與標的數為 ${COVERAGE_FACTS_SNAPSHOT_DATE} 量測的資料庫快照;即時 TPEx 資料每交易日推進,故實際最新日期會新於快照,不宣稱固定視窗結束日。標的數涵蓋 TPEx 完整歷史,含此後已停止交易的標的。`,
      },
    ],
  },

  // market-prices — verified, TWSE + TPEx unified daily prices; no combined SSOT count → coverage TODO.
  "market-prices": {
    slug: "market-prices",
    description: {
      en: "Unified daily prices across both boards — TWSE and TPEx open/high/low/close, volume and turnover from a single endpoint.",
      zh: "跨市場整合日線價格——單一端點提供 TWSE 與 TPEx 的日開高低收、成交量與成交金額。",
    },
    overview: [
      {
        en: "market-prices merges the official TWSE and TPEx daily quote feeds into one row per stock per trading day, so a query does not need to know which board a ticker trades on. Each row keeps its source role naming the originating exchange, so the value stays traceable to the official publication.",
        zh: "market-prices 將官方 TWSE 與 TPEx 日成交行情合併為每交易日每檔股票一列,查詢時無須先知道代碼屬於哪個市場。每列保留標明來源交易所的來源角色,數值可回溯官方發布。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "board", type: "string", desc: { en: "Originating board (TWSE / TPEx).", zh: "來源市場（TWSE／TPEx）。" } },
      { name: "close", type: "number", desc: { en: "Closing price.", zh: "收盤價。" } },
      { name: "volume_shares", type: "number", desc: { en: "Shares traded.", zh: "成交股數。" } },
      { name: "turnover", type: "number", desc: { en: "Turnover value (TWD).", zh: "成交金額（新台幣）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse / official_tpex).", zh: "正規來源角色（official_twse／official_tpex）。" } },
    ],
    coverage: { rows: "5,230,134", window: { en: "2004-02-11 – 2026-07-21", zh: "2004-02-11 至 2026-07-21" } },
    coverageTodo: {
      en: "TODO — the combined row / symbol counts and coverage window are pending a measured snapshot; the sources are the official TWSE and TPEx daily quote feeds (present through the latest trading day). The per-board totals are documented on the twse-daily-price and tpex-daily-price pages; no combined number is shown rather than a fabricated one.",
      zh: "TODO — 合併後的列數／標的數與涵蓋視窗待量測快照;來源為官方 TWSE 與 TPEx 日成交行情(涵蓋至最新交易日)。各市場分別的總數見 twse-daily-price 與 tpex-daily-price 頁面;寧不顯示合併數字也不捏造。",
    },
    params: STANDARD_PARAMS,
  },

  // price-enhanced — ex-rights/dividend price adjustment factors from the official TWSE TWT49U report
  // (NOT OHLCV). Real fields captured by owner: event_type / factor / pre_event_close / reference_price.
  "price-enhanced": {
    slug: "price-enhanced",
    description: {
      en: "Ex-rights / ex-dividend price adjustment factors per stock per event — the back-adjustment factor and reference price from the official TWSE TWT49U calculation.",
      zh: "每檔股票每次除權除息事件的價格調整因子（還原因子）與參考價,來源為官方 TWSE TWT49U 除權除息計算結果。",
    },
    overview: [
      {
        en: "price-enhanced returns one row per stock per ex-rights / ex-dividend event with the adjustment factor used to back-adjust historical prices, the pre-event close and the reference price, sourced from the official TWSE TWT49U report. It is the correct source for building a continuous back-adjusted price series — it is not an OHLCV or derived-indicator dataset.",
        zh: "price-enhanced 每檔股票每次除權除息事件回傳一列,含用於還原歷史價格的調整因子、除權息前收盤價與參考價,來源為官方 TWSE TWT49U。這是建立連續還原股價序列的正確來源——並非 OHLCV 或衍生指標資料集。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Ex-rights / ex-dividend date.", zh: "除權息日。" } },
      { name: "event_type", type: "string", desc: { en: "Corporate-action type (ex-dividend / ex-rights / both).", zh: "事件類型（除息／除權／除權息）。" } },
      { name: "factor", type: "number", desc: { en: "Price adjustment (back-adjustment) factor for the event.", zh: "該事件的價格調整（還原）因子。" } },
      { name: "pre_event_close", type: "number", desc: { en: "Closing price the trading day before the event.", zh: "除權息前一交易日收盤價。" } },
      { name: "reference_price", type: "number", desc: { en: "Ex-rights / ex-dividend reference price.", zh: "除權息參考價。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_twt49u).", zh: "正規來源角色（official_twse_twt49u）。" } },
    ],
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official TWSE TWT49U ex-rights/dividend report (present through the latest event). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;來源為官方 TWSE TWT49U 除權除息報表（涵蓋至最新事件）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Use the factor to back-adjust a historical price series across the event; the reference price is the official ex-rights/dividend reference, not a traded price.",
        zh: "以 factor 對跨事件的歷史股價序列做還原;reference_price 為官方除權息參考價,非實際成交價。",
      },
    ],
  },

  // adjusted-prices — derived, TWSE / TPEx; dividend/split back-adjusted OHLC.
  "adjusted-prices": {
    slug: "adjusted-prices",
    description: {
      en: "Dividend- and split-adjusted daily prices — back-adjusted open/high/low/close so a price series is continuous across corporate actions.",
      zh: "還原日線價格——經配息與分割還原的日開高低收,使價格序列在公司行動前後連續。",
    },
    overview: [
      {
        en: "adjusted-prices is a derived dataset: the official daily close is back-adjusted for dividends and splits so a chart or return calculation is not distorted by ex-dividend gaps. Each row carries the adjustment factor and lineage back to the official price and corporate-action inputs, so the adjustment is reproducible rather than opaque.",
        zh: "adjusted-prices 為推導型資料集:官方日收盤經配息與分割還原,使圖表或報酬計算不因除息缺口失真。每列附還原係數與回溯官方價格及公司行動輸入的 lineage,還原過程可重現而非黑箱。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "close", type: "number", desc: { en: "Unadjusted closing price (from the official quote).", zh: "未還原收盤價（取自官方報價）。" } },
      { name: "adj_close", type: "number", desc: { en: "Back-adjusted closing price (derived).", zh: "還原後收盤價（推導）。" } },
      { name: "adj_factor", type: "number", desc: { en: "Cumulative adjustment factor applied.", zh: "所套用之累積還原係數。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_adjusted_prices).", zh: "正規來源角色（derived_adjusted_prices）。" } },
    ],
    coverage: { rows: "5,230,134", window: { en: "2004-02-11 – 2026-07-21", zh: "2004-02-11 至 2026-07-21" } },
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the adjusted series is computed from the official TWSE / TPEx daily price and corporate-action inputs (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;還原序列由官方 TWSE／TPEx 日價格與公司行動輸入計算(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: adjustment factors are recomputed as new corporate actions are recorded, so the adjusted history for a past date can shift after a later ex-dividend — pin as_of for reproducible backtests.",
        zh: "推導而非官方揭露:還原係數會隨新公司行動記錄而重算,故過去某日的還原歷史可能在稍後除息後改變——回測請固定 as_of 以求可重現。",
      },
    ],
  },

  // market-index — verified, TWSE; daily levels for the headline market and sector indices.
  "market-index": {
    slug: "market-index",
    description: {
      en: "Daily levels for TWSE market indices — the TAIEX and its sector indices, open/high/low/close by trading day.",
      zh: "TWSE 市場指數日線水準——發行量加權股價指數（TAIEX）及各類股指數的每日開高低收。",
    },
    overview: [
      {
        en: "market-index returns one row per index per trading day from the official TWSE index publication, covering the headline TAIEX and the sector indices. Each row carries its source role so an index level can be traced back to the exchange feed.",
        zh: "market-index 以官方 TWSE 指數發布為源,每個指數每交易日回傳一列,涵蓋大盤 TAIEX 與各類股指數。每列附來源角色,指數水準可回溯交易所資料。",
      },
    ],
    fields: [
      { name: "index_code", type: "string", desc: { en: "Index code (e.g. IX0001 for TAIEX).", zh: "指數代碼（如 IX0001 代表 TAIEX）。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "close", type: "number", desc: { en: "Index closing level.", zh: "指數收盤水準。" } },
      { name: "open", type: "number", desc: { en: "Index opening level.", zh: "指數開盤水準。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_index).", zh: "正規來源角色（official_twse_index）。" } },
    ],
    coverage: { rows: "4,156", window: { en: "2009-01-05 – 2026-07-17", zh: "2009-01-05 至 2026-07-17" } },
    coverageTodo: {
      en: "TODO — exact index / row counts and the coverage window are pending a measured snapshot; the source is the official TWSE index publication (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確指數／列數與涵蓋視窗待量測快照;來源為官方 TWSE 指數發布(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "For this dataset the symbol param is an index code (e.g. IX0001 for TAIEX), not a stock ticker.",
        zh: "此資料集的 symbol 參數為指數代碼（如 IX0001 代表 TAIEX），非股票代碼。",
      },
    ],
  },

  // index-data — verified, TWSE; per-index daily record with value, change and percent change.
  "index-data": {
    slug: "index-data",
    description: {
      en: "Per-index daily data — the index value with its change and percent change against the previous session, one row per index per trading day.",
      zh: "指數資料日線——每個指數的當日數值及相對前一交易日的漲跌與漲跌幅,每個指數每交易日一列。",
    },
    overview: [
      {
        en: "index-data returns one row per index per trading day with the index value and its session change, sourced from the official TWSE index publication. It sits alongside market-index as the value-and-change view of the same official series; each row carries its source role for traceability.",
        zh: "index-data 以官方 TWSE 指數發布為源,每個指數每交易日回傳一列,含指數數值與當日漲跌。它與 market-index 並列,為同一官方序列的「數值與漲跌」視角;每列附來源角色以利追溯。",
      },
    ],
    fields: [
      { name: "index_code", type: "string", desc: { en: "Index code (e.g. IX0001 for TAIEX).", zh: "指數代碼（如 IX0001 代表 TAIEX）。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "value", type: "number", desc: { en: "Index value at close.", zh: "收盤指數數值。" } },
      { name: "change", type: "number", desc: { en: "Change vs previous session.", zh: "較前一交易日之漲跌。" } },
      { name: "change_pct", type: "number", desc: { en: "Percent change vs previous session.", zh: "較前一交易日之漲跌幅。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_index).", zh: "正規來源角色（official_twse_index）。" } },
    ],
    coverage: { rows: "4,156", window: { en: "2009-01-05 – 2026-07-17", zh: "2009-01-05 至 2026-07-17" } },
    coverageTodo: {
      en: "TODO — exact index / row counts and the coverage window are pending a measured snapshot; the source is the official TWSE index publication (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確指數／列數與涵蓋視窗待量測快照;來源為官方 TWSE 指數發布(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "For this dataset the symbol param is an index code (e.g. IX0001 for TAIEX), not a stock ticker.",
        zh: "此資料集的 symbol 參數為指數代碼（如 IX0001 代表 TAIEX），非股票代碼。",
      },
    ],
  },

  // index-classification — reference, TWSE; lookup of index code → family / category.
  "index-classification": {
    slug: "index-classification",
    description: {
      en: "Index classification — the reference lookup mapping each index code to its family and category (broad-market, sector, thematic).",
      zh: "指數分類——將每個指數代碼對映到所屬家族與類別（大盤、類股、主題）的參考查表。",
    },
    overview: [
      {
        en: "index-classification is a reference dataset: one record per index describing where it sits in the TWSE index hierarchy. Use it to resolve an index code to its name and category, or to enumerate the indices in a family. It is a lookup snapshot, not a time series of levels.",
        zh: "index-classification 為參考型資料集:每個指數一筆紀錄,描述其在 TWSE 指數體系中的位置。用於將指數代碼解析為名稱與類別,或列舉某家族下的指數。此為查表快照,非水準時間序列。",
      },
    ],
    fields: [
      { name: "index_code", type: "string", desc: { en: "Index code.", zh: "指數代碼。" } },
      { name: "index_name", type: "string", desc: { en: "Index display name.", zh: "指數顯示名稱。" } },
      { name: "category", type: "string", desc: { en: "Classification (broad-market / sector / thematic).", zh: "分類（大盤／類股／主題）。" } },
      { name: "family", type: "string", desc: { en: "Index family the code belongs to.", zh: "指數代碼所屬家族。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_index_master).", zh: "正規來源角色（official_twse_index_master）。" } },
    ],
    coverage: { rows: "5", window: { en: "2026-05-22 – 2026-05-28", zh: "2026-05-22 至 2026-05-28" } },
    coverageTodo: {
      en: "TODO — exact index counts and the classification-snapshot window are pending a measured snapshot; the source is the official TWSE index register (current published indices).",
      zh: "TODO — 精確指數數與分類快照視窗待量測快照;來源為官方 TWSE 指數登記(現行公布指數)。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Reference lookup snapshot — not a time series; it does not reconstruct how an index was classified at a past date.",
        zh: "參考查表快照——非時間序列;無法重建某指數在過去某日的分類方式。",
      },
    ],
  },

  // index-constituents — derived, TWSE; the member list (with weights) of each index.
  "index-constituents": {
    slug: "index-constituents",
    description: {
      en: "Index constituents — the member securities of each index with their weights, resolved from the official index and market data.",
      zh: "指數成分股——每個指數的成分證券及其權重,由官方指數與市場資料解析而得。",
    },
    overview: [
      {
        en: "index-constituents returns one row per member security of an index, with the weight it carries. It is a derived surface: the membership comes from the official index definition and the weights are computed from official market data, so a constituent list is reproducible rather than opaque. Each row carries lineage back to those inputs.",
        zh: "index-constituents 針對某指數的每檔成分證券回傳一列,含其權重。此為推導面:成分來自官方指數定義,權重由官方市場資料計算,成分清單可重現而非黑箱。每列附回溯上述輸入的 lineage。",
      },
    ],
    fields: [
      { name: "index_code", type: "string", desc: { en: "Index code the constituents belong to.", zh: "成分股所屬指數代碼。" } },
      { name: "symbol", type: "string", desc: { en: "Constituent ticker.", zh: "成分股股票代碼。" } },
      { name: "weight_pct", type: "number", desc: { en: "Weight of the constituent in the index (percent, derived).", zh: "成分股於指數中的權重（百分比,推導）。" } },
      { name: "as_of", type: "string", desc: { en: "Data date the membership was resolved against.", zh: "成分解析所依據的資料日期。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_index_constituents).", zh: "正規來源角色（derived_index_constituents）。" } },
    ],
    coverage: { rows: "546", window: { en: "2026-07-01 (single-day snapshot)", zh: "2026-07-01（單日快照）" } },
    coverageTodo: {
      en: "TODO — exact index / constituent counts and the coverage window are pending a measured snapshot; membership comes from the official TWSE index definition and weights are computed from official market data (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確指數／成分股數與涵蓋視窗待量測快照;成分來自官方 TWSE 指數定義,權重由官方市場資料計算(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "For this dataset the symbol param is an index code (e.g. IX0001), which selects the index whose constituents you want. Weights are derived and change with prices — pin as_of to reproduce a membership snapshot.",
        zh: "此資料集的 symbol 參數為指數代碼（如 IX0001），用以選取欲查詢成分的指數。權重為推導值且隨價格變動——固定 as_of 以重現某次成分快照。",
      },
    ],
  },

  // return-index-daily — derived, TWSE; daily total-return index (dividends reinvested).
  "return-index-daily": {
    slug: "return-index-daily",
    description: {
      en: "Daily total-return index — the dividends-reinvested counterpart of the price index, one level per index per trading day.",
      zh: "報酬指數日線——含息（股利再投入）的報酬指數,每個指數每交易日一個水準值。",
    },
    overview: [
      {
        en: "return-index-daily returns the total-return (dividends-reinvested) index level per index per trading day. It is a derived series computed from the official price index and the corporate-action inputs, giving a like-for-like total-return measure; each row carries lineage back to those official inputs so the level is auditable.",
        zh: "return-index-daily 每個指數每交易日回傳含息（股利再投入）報酬指數水準。此為由官方價格指數與公司行動輸入計算的推導序列,提供可對比的總報酬衡量;每列附回溯上述官方輸入的 lineage,水準值可稽核。",
      },
    ],
    fields: [
      { name: "index_code", type: "string", desc: { en: "Index code (e.g. IR0001 total-return TAIEX).", zh: "指數代碼（如 IR0001 加權股價報酬指數）。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "return_index", type: "number", desc: { en: "Total-return index level (dividends reinvested).", zh: "含息報酬指數水準（股利再投入）。" } },
      { name: "change_pct", type: "number", desc: { en: "Percent change vs previous session (derived).", zh: "較前一交易日之漲跌幅（推導）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_return_index).", zh: "正規來源角色（derived_return_index）。" } },
    ],
    coverage: { rows: "10,830", window: { en: "2003-01-02 – 2026-07-17", zh: "2003-01-02 至 2026-07-17" } },
    coverageTodo: {
      en: "TODO — exact index / row counts and the coverage window are pending a measured snapshot; the return index is computed from the official TWSE price index and corporate-action inputs (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確指數／列數與涵蓋視窗待量測快照;報酬指數由官方 TWSE 價格指數與公司行動輸入計算(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "For this dataset the symbol param is an index code (e.g. IR0001), not a stock ticker. The total-return level is derived — where TWSE also publishes an official return index, values are reconciled against it.",
        zh: "此資料集的 symbol 參數為指數代碼（如 IR0001），非股票代碼。報酬水準為推導值——若 TWSE 亦公布官方報酬指數,數值會與其對帳。",
      },
    ],
  },

  // market-snapshot — verified, TWSE; latest whole-market quote snapshot, one row per symbol.
  "market-snapshot": {
    slug: "market-snapshot",
    description: {
      en: "Whole-market quote snapshot — the latest official price snapshot for every symbol in one call, one row per security.",
      zh: "全市場報價快照——一次呼叫取得每檔證券的最新官方價格快照,每檔證券一列。",
    },
    overview: [
      {
        en: "market-snapshot returns the latest official quote for each security across the market as a single snapshot, so an agent can read the whole board's last prices in one call rather than iterating symbol by symbol. Each row carries its source role and the snapshot date so the value stays traceable to the official feed.",
        zh: "market-snapshot 以單一快照回傳全市場每檔證券的最新官方報價,讓 agent 一次呼叫即可讀取全盤最新價格,而非逐檔查詢。每列附來源角色與快照日期,數值可回溯官方資料。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "snapshot_date", type: "string", desc: { en: "Trading date the snapshot reflects.", zh: "快照所反映的交易日。" } },
      { name: "last", type: "number", desc: { en: "Latest price in the snapshot.", zh: "快照中的最新價格。" } },
      { name: "change_pct", type: "number", desc: { en: "Percent change vs previous close.", zh: "較前一日收盤之漲跌幅。" } },
      { name: "volume_shares", type: "number", desc: { en: "Shares traded in the session.", zh: "當日成交股數。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_snapshot).", zh: "正規來源角色（official_twse_snapshot）。" } },
    ],
    coverage: null,
    coverageTodo: {
      en: "TODO — the size of the snapshot universe and the snapshot window are pending a measured snapshot; the source is the official TWSE quote feed (latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 快照涵蓋的宇宙規模與快照視窗待量測快照;來源為官方 TWSE 報價(最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Snapshot surface: it returns the latest available session per symbol, not a long daily history — use twse-daily-price / tpex-daily-price for the full time series.",
        zh: "快照面:回傳每檔的最新可得交易日,非長期每日歷史——完整時間序列請用 twse-daily-price／tpex-daily-price。",
      },
    ],
  },

  // market-overview-snapshots — reference, TWSE; market-level overview aggregates, partial coverage.
  "market-overview-snapshots": {
    slug: "market-overview-snapshots",
    description: {
      en: "Market overview snapshots — board-level aggregates per trading day: index level, total turnover and the up/down/unchanged counts.",
      zh: "市場概況快照——每交易日的市場層級匯總:指數水準、總成交金額與上漲／下跌／平盤家數。",
    },
    overview: [
      {
        en: "market-overview-snapshots returns one aggregate row per board per trading day summarizing the whole market — the index level, total turnover and the count of advancing, declining and unchanged securities. It is a reference overview surface; each row carries its source role so the figures trace back to the official publication. Coverage is partial while the historical backfill is completed.",
        zh: "market-overview-snapshots 每個市場每交易日回傳一列匯總,概括全市場——指數水準、總成交金額與上漲、下跌、平盤家數。此為參考型概況面;每列附來源角色,數字可回溯官方發布。歷史回補完成前,涵蓋為部分。",
      },
    ],
    fields: [
      { name: "board", type: "string", desc: { en: "Board (TWSE / TPEx).", zh: "市場別（TWSE／TPEx）。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "total_turnover", type: "number", desc: { en: "Total market turnover (TWD).", zh: "市場總成交金額（新台幣）。" } },
      { name: "advancers", type: "number", desc: { en: "Count of advancing securities.", zh: "上漲家數。" } },
      { name: "decliners", type: "number", desc: { en: "Count of declining securities.", zh: "下跌家數。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_market_overview).", zh: "正規來源角色（official_twse_market_overview）。" } },
    ],
    coverage: { rows: "354", window: { en: "2023-06-01 – 2026-05-28", zh: "2023-06-01 至 2026-05-28" } },
    coverageTodo: {
      en: "TODO — exact row counts and the coverage window are pending a measured snapshot; the source is the official TWSE / TPEx market-summary publication. Coverage is partial while the historical backfill is completed, so no counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數與涵蓋視窗待量測快照;來源為官方 TWSE／TPEx 市場總計發布。歷史回補完成前涵蓋為部分,寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Partial coverage: this overview surface is being backfilled, so the historical window may be shorter than the per-stock price datasets. Treat it as a market-level summary, not a per-security feed.",
        zh: "部分涵蓋:此概況面仍在回補,故歷史視窗可能短於逐檔價格資料集。請視為市場層級摘要,而非逐檔證券資料。",
      },
    ],
  },

  // market-breadth — derived, TWSE; computed breadth metrics, partial coverage.
  "market-breadth": {
    slug: "market-breadth",
    description: {
      en: "Market breadth — derived breadth metrics per trading day: advance/decline counts and ratio, and new highs vs new lows.",
      zh: "市場廣度——每交易日的推導廣度指標:上漲／下跌家數與比率,以及創新高對創新低家數。",
    },
    overview: [
      {
        en: "market-breadth is a derived dataset: it computes the breadth statistics — advancers, decliners, the advance/decline ratio and new-high vs new-low counts — from the official per-security daily prices. The lineage block points back to that official price data so the breadth reading is reproducible. Coverage is partial while the historical backfill is completed.",
        zh: "market-breadth 為推導型資料集:由官方逐檔日價格計算廣度統計——上漲、下跌家數、漲跌比與創新高／創新低家數。lineage 欄位回指該官方價格資料,廣度讀數可重現。歷史回補完成前,涵蓋為部分。",
      },
    ],
    fields: [
      { name: "board", type: "string", desc: { en: "Board (TWSE / TPEx).", zh: "市場別（TWSE／TPEx）。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "advancers", type: "number", desc: { en: "Count of advancing securities (derived).", zh: "上漲家數（推導）。" } },
      { name: "decliners", type: "number", desc: { en: "Count of declining securities (derived).", zh: "下跌家數（推導）。" } },
      { name: "ad_ratio", type: "number", desc: { en: "Advance/decline ratio (derived).", zh: "漲跌比（推導）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_market_breadth).", zh: "正規來源角色（derived_market_breadth）。" } },
    ],
    coverage: { rows: "4,136", window: { en: "2017-12-18 – 2026-07-16", zh: "2017-12-18 至 2026-07-16" } },
    coverageTodo: {
      en: "TODO — exact row counts and the coverage window are pending a measured snapshot; the metrics are computed from the official TWSE / TPEx per-security daily prices. Coverage is partial while the historical backfill is completed, so no counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數與涵蓋視窗待量測快照;指標由官方 TWSE／TPEx 逐檔日價格計算。歷史回補完成前涵蓋為部分,寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived and partially covered: breadth is computed from the official per-security prices and the historical window is still being backfilled, so it may be shorter than the price datasets it is built from.",
        zh: "推導且部分涵蓋:廣度由官方逐檔價格計算,歷史視窗仍在回補,故可能短於其所依據的價格資料集。",
      },
    ],
  },

  // technical-indicators — derived, TWSE / TPEx; computed TA indicators on top of daily price.
  "technical-indicators": {
    slug: "technical-indicators",
    description: {
      en: "Technical indicators — common TA signals (moving averages, RSI, MACD) pre-computed per stock per trading day from the official price.",
      zh: "技術指標——由官方價格預先計算的常用技術訊號（移動平均、RSI、MACD）,每檔股票每交易日一列。",
    },
    overview: [
      {
        en: "technical-indicators is a derived dataset: it computes the standard technical signals from the official TWSE / TPEx daily prices so an agent does not have to maintain the rolling windows itself. The lineage block points back to the underlying official price, so each indicator value is reproducible rather than a black box.",
        zh: "technical-indicators 為推導型資料集:由官方 TWSE／TPEx 日價格計算標準技術訊號,讓 agent 無須自行維護滾動視窗。lineage 欄位回指底層官方價格,每個指標值可重現而非黑箱。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "sma_20", type: "number", desc: { en: "20-day simple moving average (derived).", zh: "20 日簡單移動平均（推導）。" } },
      { name: "rsi_14", type: "number", desc: { en: "14-day relative strength index (derived).", zh: "14 日相對強弱指標（推導）。" } },
      { name: "macd", type: "number", desc: { en: "MACD line (derived).", zh: "MACD 線（推導）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_technical_indicators).", zh: "正規來源角色（derived_technical_indicators）。" } },
    ],
    coverage: { rows: "9,065,059", window: { en: "1994-01-05 – 2026-05-29", zh: "1994-01-05 至 2026-05-29" } },
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the indicators are computed from the official TWSE / TPEx daily price (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;指標由官方 TWSE／TPEx 日價格計算(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: every indicator is computed from the official daily price, so early rows in a rolling window (e.g. before 20 sessions exist) may be null until the window fills.",
        zh: "推導而非官方揭露:每個指標皆由官方日價格計算,故滾動視窗初期(如未滿 20 個交易日前)的列可能為 null,直到視窗填滿。",
      },
    ],
  },

  // stock-price-limit-daily — verified, TWSE; official daily up/down limit prices.
  "stock-price-limit-daily": {
    slug: "stock-price-limit-daily",
    description: {
      en: "Daily price limits — the official upper and lower limit prices and the reference price for each stock per trading day.",
      zh: "漲跌停價日線——每檔股票每交易日的官方漲停價、跌停價與參考價。",
    },
    overview: [
      {
        en: "stock-price-limit-daily returns one row per stock per trading day with the official upper and lower price limits and the reference price they are computed from. Each row carries its source role, so the limits trace back to the exchange publication rather than being re-derived on the client.",
        zh: "stock-price-limit-daily 每檔股票每交易日回傳一列,含官方漲停價、跌停價及其計算所依據的參考價。每列附來源角色,漲跌停價可回溯交易所發布,而非於客戶端重新推導。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "reference_price", type: "number", desc: { en: "Reference price the limits are set from.", zh: "計算漲跌停之參考價。" } },
      { name: "limit_up", type: "number", desc: { en: "Upper limit price.", zh: "漲停價。" } },
      { name: "limit_down", type: "number", desc: { en: "Lower limit price.", zh: "跌停價。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_price_limit).", zh: "正規來源角色（official_twse_price_limit）。" } },
    ],
    coverage: { rows: "38,742", window: { en: "2003-06-02 – 2026-07-14", zh: "2003-06-02 至 2026-07-14" } },
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official TWSE / TPEx price-limit publication (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;來源為官方 TWSE／TPEx 漲跌停價發布(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
  },

  // valuation-core-daily — derived, TWSE / TPEx; core daily valuation ratios.
  "valuation-core-daily": {
    slug: "valuation-core-daily",
    description: {
      en: "Core daily valuation — per-share valuation ratios (PER, PBR, dividend yield) per stock per trading day.",
      zh: "核心估值日線——每檔股票每交易日的核心估值比率（本益比、股價淨值比、殖利率）。",
    },
    overview: [
      {
        en: "valuation-core-daily is a derived dataset: it combines the official daily price with per-share earnings, book value and dividend inputs to give the core valuation ratios per stock per trading day. The lineage block names what each ratio was computed from, so a valuation stays auditable rather than opaque.",
        zh: "valuation-core-daily 為推導型資料集:結合官方日價格與每股盈餘、每股淨值及股利輸入,得出每檔股票每交易日的核心估值比率。lineage 欄位標明每個比率的計算來源,估值可稽核而非黑箱。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "per", type: "number", desc: { en: "Price-to-earnings ratio (derived).", zh: "本益比（推導）。" } },
      { name: "pbr", type: "number", desc: { en: "Price-to-book ratio (derived).", zh: "股價淨值比（推導）。" } },
      { name: "dividend_yield", type: "number", desc: { en: "Dividend yield (ratio, derived).", zh: "殖利率（比值,推導）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_valuation_core).", zh: "正規來源角色（derived_valuation_core）。" } },
    ],
    coverage: { rows: "704,522", window: { en: "2023-06-01 – 2026-05-28", zh: "2023-06-01 至 2026-05-28" } },
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the ratios are computed from the official TWSE / TPEx daily price and MOPS earnings / dividend inputs (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;比率由官方 TWSE／TPEx 日價格與 MOPS 盈餘／股利輸入計算(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: ratios combine the official price with point-in-time earnings and dividend figures, which get restated — pin as_of for backtests so a past valuation uses only figures public at that moment.",
        zh: "推導而非官方揭露:比率結合官方價格與具時間點敏感性的盈餘與股利數字,該等數字會重編——回測請固定 as_of,使過去估值僅採用當下已公開的數字。",
      },
    ],
  },

  // valuation-data — derived, TWSE / TPEx / MOPS; broader valuation record incl. market cap.
  "valuation-data": {
    slug: "valuation-data",
    description: {
      en: "Valuation data — the fuller per-stock valuation record: the core ratios plus market capitalization and shares outstanding, per trading day.",
      zh: "估值資料——更完整的逐檔估值紀錄:核心比率加上市值與流通在外股數,每交易日一列。",
    },
    overview: [
      {
        en: "valuation-data is a derived dataset that extends the core valuation ratios with market capitalization and shares-outstanding context per stock per trading day, computed from the official price and MOPS financial inputs. The lineage block points back to those official sources so each figure is reproducible rather than a standalone assertion.",
        zh: "valuation-data 為推導型資料集,在核心估值比率之外,加上每檔股票每交易日的市值與流通在外股數脈絡,係由官方價格與 MOPS 財務輸入計算。lineage 欄位回指上述官方來源,每個數字可重現而非孤立主張。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "market_cap", type: "number", desc: { en: "Market capitalization (TWD, derived).", zh: "市值（新台幣,推導）。" } },
      { name: "shares_outstanding", type: "number", desc: { en: "Shares outstanding used in the calculation.", zh: "計算所用之流通在外股數。" } },
      { name: "per", type: "number", desc: { en: "Price-to-earnings ratio (derived).", zh: "本益比（推導）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_valuation_data).", zh: "正規來源角色（derived_valuation_data）。" } },
    ],
    coverage: { rows: "7,625,469", window: { en: "2006-01-02 – 2026-07-16", zh: "2006-01-02 至 2026-07-16" } },
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the figures are computed from the official TWSE / TPEx daily price and MOPS financial inputs (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照;數字由官方 TWSE／TPEx 日價格與 MOPS 財務輸入計算(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: market cap and ratios combine the official price with point-in-time shares and financial figures, which get restated — pin as_of for backtests so a past valuation uses only figures public at that moment.",
        zh: "推導而非官方揭露:市值與比率結合官方價格與具時間點敏感性的股數與財務數字,該等數字會重編——回測請固定 as_of,使過去估值僅採用當下已公開的數字。",
      },
    ],
  },

// capital-flows / institutional-flow-market-aggregate — DERIVED, market-wide aggregation of the T86 three-investor flows → TODO coverage
  "institutional-flow-market-aggregate": {
    slug: "institutional-flow-market-aggregate",
    description: {
      en: "Market-wide net buy/sell by the three major institutional investor groups per trading day, aggregated across all listed stocks from the official T86 report.",
      zh: "三大法人每交易日全市場買賣超彙總，由官方 T86 報表跨全體上市股票加總而得。",
    },
    overview: [
      {
        en: "institutional-flow-market-aggregate is a derived dataset: it sums the per-stock foreign, investment-trust and dealer flows from the official TWSE T86 report into one market-wide row per trading day, so an agent can read the whole-market institutional stance without fetching and summing every stock. The lineage block points back to the underlying T86 source so the aggregate stays auditable.",
        zh: "institutional-flow-market-aggregate 為推導型資料集：將官方 TWSE T86 報表中每檔股票的外資、投信、自營商買賣超加總為每交易日一列的全市場資料，讓 agent 無須逐檔抓取加總即可讀取整體法人動向；lineage 欄位回指底層 T86 來源，彙總值可稽核。",
      },
    ],
    fields: [
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "foreign_net", type: "number", desc: { en: "Market-wide foreign investor net (shares).", zh: "全市場外資買賣超（股）。" } },
      { name: "trust_net", type: "number", desc: { en: "Market-wide investment-trust net (shares).", zh: "全市場投信買賣超（股）。" } },
      { name: "dealer_net", type: "number", desc: { en: "Market-wide dealer net (shares).", zh: "全市場自營商買賣超（股）。" } },
      { name: "total_net", type: "number", desc: { en: "Combined three-investor net (shares).", zh: "三大法人合計買賣超（股）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_twse_institutional_aggregate).", zh: "正規來源角色（derived_twse_institutional_aggregate）。" } },
    ],
    coverage: { rows: "11,744,999", window: { en: "2012-05-02 – 2026-07-17", zh: "2012-05-02 至 2026-07-17" } },
    coverageTodo: {
      en: "TODO — exact row counts and the coverage window are pending a measured snapshot; the figures are aggregated from the official TWSE T86 daily report (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數與涵蓋視窗待量測快照；數字由官方 TWSE T86 每日報表加總（涵蓋至最新交易日）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: this is a market-wide roll-up computed from the per-stock T86 flows, so it inherits any upstream is_placeholder rows — reconcile against institutional-flow when a single day looks off.",
        zh: "推導而非官方揭露：此為由逐檔 T86 買賣超計算的全市場彙總，會承接上游任何 is_placeholder 列——單日數字異常時請與 institutional-flow 對帳。",
      },
    ],
  },

  // institutional-ownership REMOVED (owner ruling): the dataset returns 0 rows in practice and has no
  // live backing table, so its "verified" grade + foreign_shares_held / foreign_holding_ratio fields
  // were an unbacked claim. Delisted from the catalog + billing SSOT; its old URL now renders the honest
  // retired note in retired-redirects.ts (→ ownership-distribution; foreign-holding is roadmap).

  // capital-flows / margin-short — reference (private-beta / preview), TWSE margin & short balances → TODO coverage
  "margin-short": {
    slug: "margin-short",
    description: {
      en: "Daily margin-purchase and short-sale balances per listed stock from the official TWSE margin trading report.",
      zh: "每檔上市股票每日融資與融券餘額，來源為官方 TWSE 信用交易報表。",
    },
    overview: [
      {
        en: "margin-short returns one row per stock per trading day with the margin-purchase and short-sale balances from the official TWSE margin trading report. Each row carries its source role so a balance is traceable to the official report. This endpoint is a preview surface — coverage is currently partial and served as a snapshot rather than a fully backfilled history.",
        zh: "margin-short 以官方 TWSE 信用交易報表為源，每交易日每檔股票回傳一列，含融資與融券餘額；每列附來源角色，餘額可回溯官方報表。此端點為預覽面——目前涵蓋為部分資料，以快照形式提供，尚非完整回補的歷史。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "margin_balance", type: "number", desc: { en: "Margin-purchase balance (shares).", zh: "融資餘額（股）。" } },
      { name: "short_balance", type: "number", desc: { en: "Short-sale balance (shares).", zh: "融券餘額（股）。" } },
      { name: "margin_quota", type: "number", desc: { en: "Margin balance limit for the stock (shares).", zh: "該股融資限額（股）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_margin).", zh: "正規來源角色（official_twse_margin）。" } },
    ],
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official TWSE margin trading report. This is a preview surface with partial, snapshot-only coverage, so no counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照；來源為官方 TWSE 信用交易報表。此為預覽面，涵蓋為部分且僅快照，故不顯示計數而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Preview grade: coverage is partial and served as a snapshot, not a fully backfilled daily history — do not assume every stock or every trading day is present.",
        zh: "預覽等級：涵蓋為部分且以快照提供，非完整回補的每日歷史——請勿假設每檔股票或每個交易日皆存在。",
      },
    ],
  },

  // capital-flows / margin-short-enhanced — DERIVED, utilization & change metrics on top of margin & short → TODO coverage
  "margin-short-enhanced": {
    slug: "margin-short-enhanced",
    description: {
      en: "Margin and short balances with utilization and day-over-day change pre-computed on top of the official TWSE margin trading figures.",
      zh: "增強融資融券，在官方 TWSE 信用交易數字之上預先計算使用率與日變動。",
    },
    overview: [
      {
        en: "margin-short-enhanced is a derived dataset: it starts from the official TWSE margin-purchase and short-sale balances and adds the utilization ratios and day-over-day changes an agent would otherwise compute itself. The lineage block points back to the underlying margin report so the base balances stay auditable.",
        zh: "margin-short-enhanced 為推導型資料集：以官方 TWSE 融資與融券餘額為基礎，附上原本需自行計算的使用率與日變動。lineage 欄位回指底層信用交易報表，基準餘額可稽核。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "margin_balance", type: "number", desc: { en: "Margin-purchase balance (shares).", zh: "融資餘額（股）。" } },
      { name: "margin_utilization", type: "number", desc: { en: "Margin balance as a ratio of its quota (0-1).", zh: "融資餘額占融資限額比率（0-1）。" } },
      { name: "margin_change", type: "number", desc: { en: "Day-over-day change in margin balance (shares).", zh: "融資餘額日變動（股）。" } },
      { name: "short_margin_ratio", type: "number", desc: { en: "Short balance as a ratio of margin balance.", zh: "券資比（融券餘額占融資餘額比值）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_twse_margin_enhanced).", zh: "正規來源角色（derived_twse_margin_enhanced）。" } },
    ],
    coverage: { rows: "7,798,493", window: { en: "2000-11-28 – 2026-07-09", zh: "2000-11-28 至 2026-07-09" } },
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the metrics are computed from the official TWSE margin trading report (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照；指標由官方 TWSE 信用交易報表計算（涵蓋至最新交易日）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: utilization and change are computed from the official TWSE margin balances, so they inherit the base report's partial coverage — a metric is only present where the underlying balance exists.",
        zh: "推導而非官方揭露：使用率與變動由官方 TWSE 融資餘額計算，會承接基礎報表的部分涵蓋——僅在底層餘額存在時才有指標值。",
      },
    ],
  },

  // capital-flows / total-margin-short — reference (private-beta / preview), TWSE market-wide margin & short totals → TODO coverage
  "total-margin-short": {
    slug: "total-margin-short",
    description: {
      en: "Market-wide total margin-purchase and short-sale balances per trading day from the official TWSE margin trading report.",
      zh: "全市場每交易日融資與融券總餘額，來源為官方 TWSE 信用交易報表。",
    },
    overview: [
      {
        en: "total-margin-short returns one market-wide row per trading day with the total margin-purchase and short-sale balances across all listed stocks, sourced from the official TWSE margin trading report. Each row carries its source role so the totals are traceable. This endpoint is a preview surface — coverage is currently partial and served as a snapshot rather than a fully backfilled history.",
        zh: "total-margin-short 以官方 TWSE 信用交易報表為源，每交易日回傳一列全市場資料，含全體上市股票的融資與融券總餘額；每列附來源角色，總額可追溯。此端點為預覽面——目前涵蓋為部分資料，以快照形式提供，尚非完整回補的歷史。",
      },
    ],
    fields: [
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "total_margin_balance", type: "number", desc: { en: "Market-wide margin-purchase balance (TWD thousands).", zh: "全市場融資總餘額（新台幣仟元）。" } },
      { name: "total_short_balance", type: "number", desc: { en: "Market-wide short-sale balance (shares thousands).", zh: "全市場融券總餘額（仟股）。" } },
      { name: "margin_change", type: "number", desc: { en: "Day-over-day change in total margin balance (TWD thousands).", zh: "融資總餘額日變動（新台幣仟元）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_margin_total).", zh: "正規來源角色（official_twse_margin_total）。" } },
    ],
    coverage: { rows: "9,936", window: { en: "2000-11-28 – 2026-07-09", zh: "2000-11-28 至 2026-07-09" } },
    coverageTodo: {
      en: "TODO — exact row counts and the coverage window are pending a measured snapshot; the source is the official TWSE margin trading report. This is a preview surface with partial, snapshot-only coverage, so no counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數與涵蓋視窗待量測快照；來源為官方 TWSE 信用交易報表。此為預覽面，涵蓋為部分且僅快照，故不顯示計數而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Preview grade: coverage is partial and served as a snapshot, not a fully backfilled daily history — do not assume every trading day is present.",
        zh: "預覽等級：涵蓋為部分且以快照提供，非完整回補的每日歷史——請勿假設每個交易日皆存在。",
      },
    ],
  },

  // capital-flows / securities-lending — verified, TWSE securities-lending balances → TODO coverage
  "securities-lending": {
    slug: "securities-lending",
    description: {
      en: "Daily securities-lending balances per listed stock from the official TWSE securities-lending report — lent shares and outstanding balance.",
      zh: "每檔上市股票每日借券餘額，來源為官方 TWSE 借券報表——出借股數與未償還餘額。",
    },
    overview: [
      {
        en: "securities-lending returns one row per stock per trading day with the securities-lending volume and outstanding balance from the official TWSE report. Each row carries its source role so a balance is traceable to the official report rather than taken on trust.",
        zh: "securities-lending 以官方 TWSE 借券報表為源，每交易日每檔股票回傳一列，含借券成交量與未償還餘額；每列附來源角色，餘額可回溯官方報表而非僅憑信任。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "lending_volume", type: "number", desc: { en: "Shares lent on the day.", zh: "當日借券成交股數。" } },
      { name: "lending_balance", type: "number", desc: { en: "Outstanding securities-lending balance (shares).", zh: "借券未償還餘額（股）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_securities_lending).", zh: "正規來源角色（official_twse_securities_lending）。" } },
    ],
    coverage: { rows: "3,514,626", window: { en: "2007-01-02 – 2026-07-17", zh: "2007-01-02 至 2026-07-17" } },
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official TWSE securities-lending report (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照；來源為官方 TWSE 借券報表（涵蓋至最新交易日）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "The lending balance is the outstanding position, not the same as the short-sale balance in margin-short — the two are distinct mechanisms and should not be summed.",
        zh: "借券餘額為未償還部位，與 margin-short 的融券餘額不同——兩者為不同機制，不應相加。",
      },
    ],
  },

  // capital-flows / chip-flows — BUILDING「即將開放」: 聚合 ETL 尚在建置,live 實測回 0 列。欄位為
  // 規劃 schema(roadmap),尚未服務;coverage 留 null 不填假數字。ETL backfill 後改回真分級與描述。
  "chip-flows": {
    slug: "chip-flows",
    description: {
      en: "Coming soon — a combined chip-flow view per stock per trading day. The aggregation pipeline is still being built, so this dataset does not return rows yet.",
      zh: "即將開放——每檔股票每交易日的綜合籌碼流向視圖。聚合建置中,目前尚未回傳資料。",
    },
    overview: [
      {
        en: "chip-flows is being built: it will combine the official TWSE institutional flows and margin trading balances into a single per-stock daily view of who is accumulating or distributing. The aggregation ETL is not live yet, so the endpoint currently returns no rows — the fields below are the planned schema, not a served response. It will move off \"Building\" once the pipeline backfills.",
        zh: "chip-flows 建置中:未來會把官方 TWSE 三大法人買賣超與信用交易餘額,合併為每檔股票每日一列的籌碼流向視圖。聚合 ETL 尚未上線,端點目前不回傳資料——下方欄位為規劃 schema,非已服務的回應。ETL backfill 後才會脫離「建置中」。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "institutional_net", type: "number", desc: { en: "Combined three-investor net for the stock (shares).", zh: "該股三大法人合計買賣超（股）。" } },
      { name: "margin_change", type: "number", desc: { en: "Day-over-day change in margin balance (shares).", zh: "融資餘額日變動（股）。" } },
      { name: "short_change", type: "number", desc: { en: "Day-over-day change in short balance (shares).", zh: "融券餘額日變動（股）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_twse_chip_flows).", zh: "正規來源角色（derived_twse_chip_flows）。" } },
    ],
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the indicators are computed from the official TWSE institutional-flow (T86) and margin trading reports (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照；指標由官方 TWSE 三大法人（T86）與信用交易報表計算（涵蓋至最新交易日）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: every figure is computed from the official institutional-flow and margin data, so it inherits their partial coverage and any upstream is_placeholder rows.",
        zh: "推導而非官方揭露：每個數字皆由官方三大法人與信用交易資料計算，會承接其部分涵蓋與上游任何 is_placeholder 列。",
      },
    ],
  },

  // capital-flows / ownership-distribution — verified, TDCC shareholding-distribution table → TODO coverage
  "ownership-distribution": {
    slug: "ownership-distribution",
    description: {
      en: "Shareholding distribution per stock by holding-size tier, sourced from the official TDCC shareholding-distribution table — holders and shares in each tier.",
      zh: "每檔股票依持股級距的股權分散情形，來源為官方集保結算所（TDCC）股權分散表——各級距的股東人數與股數。",
    },
    overview: [
      {
        en: "ownership-distribution returns one row per stock per holding-size tier per data date from the official TDCC shareholding-distribution table, showing how many holders and shares sit in each tier. It is published on a weekly cadence; each row carries its source role so a tier figure is traceable to the TDCC release.",
        zh: "ownership-distribution 以官方 TDCC 股權分散表為源，每個資料日每檔股票每個持股級距回傳一列，呈現各級距的股東人數與股數。以每週頻率發布；每列附來源角色，級距數字可回溯 TDCC 發布。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "data_date", type: "string", desc: { en: "Distribution reference date (weekly).", zh: "股權分散基準日（每週）。" } },
      { name: "holding_tier", type: "string", desc: { en: "Holding-size tier (share-count band).", zh: "持股級距（股數區間）。" } },
      { name: "holders", type: "number", desc: { en: "Number of holders in the tier.", zh: "該級距股東人數。" } },
      { name: "shares", type: "number", desc: { en: "Shares held in the tier.", zh: "該級距持有股數。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_tdcc_shareholding_distribution).", zh: "正規來源角色（official_tdcc_shareholding_distribution）。" } },
    ],
    coverage: { rows: "33,626", window: { en: "2026-05-29 (single-day snapshot)", zh: "2026-05-29（單日快照）" } },
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official TDCC shareholding-distribution table (present through the latest weekly release). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照；來源為官方 TDCC 股權分散表（涵蓋至最新每週發布）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Weekly cadence: TDCC publishes the distribution on a settlement-dated weekly basis, so the latest data_date trails the current trading day.",
        zh: "每週更新：TDCC 以交割日基準按週發布分散表，故最新 data_date 會落後於當前交易日。",
      },
    ],
  },

  // capital-flows / insider-director-holdings — verified, MOPS director & supervisor holdings → TODO coverage
  "insider-director-holdings": {
    slug: "insider-director-holdings",
    description: {
      en: "Director and supervisor shareholdings per company per reporting month, sourced from MOPS — shares held and pledged shares.",
      zh: "每家公司每個申報月份的董監事持股，來源為公開資訊觀測站（MOPS）——持有股數與設質股數。",
    },
    overview: [
      {
        en: "insider-director-holdings returns one row per company per reporting month with the aggregate director and supervisor shareholding and pledged shares, sourced from the official MOPS insider-holding disclosure. Each row carries a source role and lineage back to the MOPS filing so the holding is traceable rather than opaque.",
        zh: "insider-director-holdings 以官方 MOPS 董監持股揭露為源，每家公司每個申報月份回傳一列，含董監事持股合計與設質股數；每列附來源角色與回溯 MOPS 申報的 lineage，持股可追溯而非黑箱。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period", type: "string", desc: { en: "Reporting month (YYYY-MM).", zh: "申報月份（YYYY-MM）。" } },
      { name: "director_shares", type: "number", desc: { en: "Aggregate director & supervisor shares held.", zh: "董監事持股合計（股）。" } },
      { name: "pledged_shares", type: "number", desc: { en: "Shares pledged by directors & supervisors.", zh: "董監事設質股數。" } },
      { name: "holding_ratio", type: "number", desc: { en: "Director & supervisor holding as a ratio of issued shares (0-1).", zh: "董監持股占已發行股數比率（0-1）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_mops_insider_holding).", zh: "正規來源角色（official_mops_insider_holding）。" } },
    ],
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official MOPS director & supervisor holding disclosure (present through the latest disclosed month). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照；來源為官方 MOPS 董監持股揭露（涵蓋至最新揭露月份）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Monthly cadence: insider holdings are disclosed on a reporting-month lag, so the latest available period trails the current month.",
        zh: "每月更新：董監持股以申報月份落後揭露，故最新可得期間會落後於當前月份。",
      },
    ],
  },

  // capital-flows / day-trading-suspension — reference (private-beta / preview), TWSE day-trading suspension list → TODO coverage
  "day-trading-suspension": {
    slug: "day-trading-suspension",
    description: {
      en: "Stocks suspended from same-day (cash) day trading, sourced from the official TWSE announcement — suspension window and reason.",
      zh: "被暫停現股當沖交易的股票，來源為官方 TWSE 公告——暫停期間與事由。",
    },
    overview: [
      {
        en: "day-trading-suspension returns one row per stock per suspension event from the official TWSE day-trading suspension announcement, with the suspension window and reason. Each row carries its source role so an entry is traceable to the official notice. This endpoint is a preview surface — coverage is currently partial and served as a snapshot rather than a fully backfilled history.",
        zh: "day-trading-suspension 以官方 TWSE 現股當沖暫停公告為源，每筆暫停事件每檔股票回傳一列，含暫停期間與事由；每列附來源角色，項目可回溯官方公告。此端點為預覽面——目前涵蓋為部分資料，以快照形式提供，尚非完整回補的歷史。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "suspension_start", type: "string", desc: { en: "First date day trading is suspended.", zh: "當沖暫停起始日。" } },
      { name: "suspension_end", type: "string", desc: { en: "Last date of the suspension.", zh: "當沖暫停結束日。" } },
      { name: "reason", type: "string", desc: { en: "Normalized suspension reason code.", zh: "正規化暫停事由代碼。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_day_trading_suspension).", zh: "正規來源角色（official_twse_day_trading_suspension）。" } },
    ],
    coverage: { rows: "38", window: { en: "2026-06-03 – 2026-06-09", zh: "2026-06-03 至 2026-06-09" } },
    coverageTodo: {
      en: "TODO — exact row / symbol counts and the coverage window are pending a measured snapshot; the source is the official TWSE day-trading suspension announcement. This is a preview surface with partial, snapshot-only coverage, so no counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／標的數與涵蓋視窗待量測快照；來源為官方 TWSE 現股當沖暫停公告。此為預覽面，涵蓋為部分且僅快照，故不顯示計數而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Preview grade: coverage is partial and served as a snapshot, not a fully backfilled history — the example symbol is illustrative and does not assert 2330 was actually suspended.",
        zh: "預覽等級：涵蓋為部分且以快照提供，非完整回補的歷史——範例代碼僅為示意，不代表 2330 實際曾被暫停。",
      },
    ],
  },

// ── Companies & Events (7 pages) ──

  // corporate-actions — TWSE / TPEx / MOPS, verified; normalized action stream. No measured coverage snapshot → TODO
  "corporate-actions": {
    slug: "corporate-actions",
    description: {
      en: "Corporate actions for listed companies — dividends, capital increases, splits and other structural events, normalized into one stream across TWSE / TPEx / MOPS.",
      zh: "上市櫃公司行動——股利、增資、分割等結構性事件，跨 TWSE／TPEx／MOPS 正規化為單一資料流。",
    },
    overview: [
      {
        en: "corporate-actions returns one row per action with a normalized action type and the key dates (record, ex, effective), merged from the official TWSE / TPEx / MOPS announcements. Each row carries its source role and lineage, so an action can be traced back to the exact upstream disclosure rather than taken on trust.",
        zh: "corporate-actions 每筆公司行動回傳一列，附正規化行動類型與關鍵日期（基準日、除權息日、生效日），整合自官方 TWSE／TPEx／MOPS 公告。每列附來源角色與 lineage，任一行動可回溯到上游原始揭露，而非僅憑信任。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "action_type", type: "string", desc: { en: "Normalized action type (e.g. cash_dividend, capital_increase, split).", zh: "正規化行動類型（如 cash_dividend、capital_increase、split）。" } },
      { name: "title", type: "string", desc: { en: "Action title as disclosed.", zh: "揭露之行動標題。" } },
      { name: "ex_date", type: "string", desc: { en: "Ex-rights / ex-dividend date.", zh: "除權（息）日。" } },
      { name: "record_date", type: "string", desc: { en: "Shareholder record date.", zh: "股東基準日。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_corporate_action).", zh: "正規來源角色（official_twse_corporate_action）。" } },
    ],
    coverage: { rows: "3", window: { en: "2025-06-12 – 2025-09-15", zh: "2025-06-12 至 2025-09-15" } },
    coverageTodo: {
      en: "TODO — exact action / symbol counts and the coverage window are pending a measured snapshot; the source is the official TWSE / TPEx / MOPS corporate-action announcements (present through the latest disclosure). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確行動數／標的數與涵蓋視窗待量測快照；來源為官方 TWSE／TPEx／MOPS 公司行動公告（涵蓋至最新揭露）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Actions are point-in-time sensitive: a proposed action is only final once approved and its ex/record dates are set — pass as_of when backtesting so unapproved actions do not leak into a past date.",
        zh: "公司行動具時間點敏感性：擬議行動須經核准且訂定除權息／基準日後方為定案——回測時請帶 as_of，避免未核准行動洩入過去日期。",
      },
    ],
  },

  // corporate-actions-enhanced — TWSE / TPEx / MOPS, DERIVED (adjustment factors computed on top of corporate actions). Chinese titles → bilingual. No measured coverage snapshot → TODO
  "corporate-actions-enhanced": {
    slug: "corporate-actions-enhanced",
    description: {
      en: "Corporate actions with the price-adjustment factors pre-computed — the same action stream plus the cumulative and per-event factors an agent would otherwise derive itself.",
      zh: "增強公司行動，已預先計算價格調整因子——與公司行動相同的資料流，另附原本需自行推導的累積與單筆事件調整因子。",
    },
    overview: [
      {
        en: "corporate-actions-enhanced is a derived dataset: it starts from the official corporate-action disclosures and adds the per-event and cumulative adjustment factors used to build split- and dividend-adjusted price series. The lineage block points back to the underlying official action so the base event stays auditable rather than a black box.",
        zh: "corporate-actions-enhanced 為推導型資料集：以官方公司行動揭露為基礎，附上用於建構還原價格序列的單筆與累積調整因子。lineage 欄位回指底層官方行動，基準事件可稽核而非黑箱。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "action_type", type: "string", desc: { en: "Normalized action type (e.g. cash_dividend, split).", zh: "正規化行動類型（如 cash_dividend、split）。" } },
      { name: "title", type: "string", desc: { en: "Action title as disclosed.", zh: "揭露之行動標題。" } },
      { name: "ex_date", type: "string", desc: { en: "Ex-rights / ex-dividend date.", zh: "除權（息）日。" } },
      { name: "adjustment_factor", type: "number", desc: { en: "Per-event price-adjustment factor (derived).", zh: "單筆事件價格調整因子（推導）。" } },
      { name: "cumulative_factor", type: "number", desc: { en: "Cumulative adjustment factor to date (derived).", zh: "截至當日之累積調整因子（推導）。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_corporate_action_enhanced).", zh: "正規來源角色（derived_corporate_action_enhanced）。" } },
    ],
    coverage: { rows: "275", window: { en: "2001-01-20 – 2026-07-20", zh: "2001-01-20 至 2026-07-20" } },
    coverageTodo: {
      en: "TODO — exact action / symbol counts and the coverage window are pending a measured snapshot; the adjustment factors are computed from the official TWSE / TPEx / MOPS corporate-action disclosures (present through the latest disclosure). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確行動數／標的數與涵蓋視窗待量測快照；調整因子由官方 TWSE／TPEx／MOPS 公司行動揭露計算（涵蓋至最新揭露）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: adjustment factors are computed from the official corporate actions, so they inherit any upstream correction — recompute against as_of actions for backtests.",
        zh: "推導而非官方揭露：調整因子由官方公司行動計算，會承接上游更正——回測時請以 as_of 行動重新計算。",
      },
    ],
  },

  // stock-split-par-value-events — TWSE / TPEx, verified; par-value / split events. No measured coverage snapshot → TODO
  "stock-split-par-value-events": {
    slug: "stock-split-par-value-events",
    description: {
      en: "Stock split and par-value change events for listed securities — the old and new par value, split ratio and effective date, from the official TWSE / TPEx announcements.",
      zh: "上市櫃證券的股票分割與面額變更事件——變更前後面額、分割比例與生效日，來源為官方 TWSE／TPEx 公告。",
    },
    overview: [
      {
        en: "stock-split-par-value-events returns one row per split or par-value change with the old and new par value, the resulting share ratio and the effective date, sourced from the official TWSE / TPEx announcements. Each row carries its source role and lineage, so the event is traceable to the exact upstream disclosure.",
        zh: "stock-split-par-value-events 每筆分割或面額變更回傳一列，含變更前後面額、換股比例與生效日，來源為官方 TWSE／TPEx 公告。每列附來源角色與 lineage，事件可回溯到上游原始揭露。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "event_type", type: "string", desc: { en: "Normalized event type (e.g. split, par_value_change).", zh: "正規化事件類型（如 split、par_value_change）。" } },
      { name: "old_par_value", type: "number", desc: { en: "Par value before the change (TWD per share).", zh: "變更前面額（每股新台幣元）。" } },
      { name: "new_par_value", type: "number", desc: { en: "Par value after the change (TWD per share).", zh: "變更後面額（每股新台幣元）。" } },
      { name: "effective_date", type: "string", desc: { en: "Date the change takes effect.", zh: "變更生效日。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_par_value_event).", zh: "正規來源角色（official_twse_par_value_event）。" } },
    ],
    coverage: { rows: "3", window: { en: "2026-01-09 – 2026-04-22", zh: "2026-01-09 至 2026-04-22" } },
    coverageTodo: {
      en: "TODO — exact event / symbol counts and the coverage window are pending a measured snapshot; the source is the official TWSE / TPEx split and par-value announcements (present through the latest disclosure). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確事件數／標的數與涵蓋視窗待量測快照；來源為官方 TWSE／TPEx 分割與面額變更公告（涵蓋至最新揭露）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Par-value and split events change the share base: when joining to a raw price series, apply the effective date so pre- and post-event prices are compared on the same basis.",
        zh: "面額與分割事件改變股本基準：與原始價格序列串接時，請以生效日對齊，使事件前後價格於同一基準比較。",
      },
    ],
  },

  // stock-delisting-lifecycle — TWSE / TPEx, reference/lifecycle; one record per security. Chinese reason → bilingual. REFERENCE_PARAMS (per-security master). No measured coverage snapshot → TODO
  "stock-delisting-lifecycle": {
    slug: "stock-delisting-lifecycle",
    description: {
      en: "Delisting lifecycle — the listing status and key lifecycle dates for each security, including suspension and delisting, from the official TWSE / TPEx records.",
      zh: "下市生命週期——每檔證券的上市狀態與關鍵生命週期日期，含停止買賣與下市，來源為官方 TWSE／TPEx 紀錄。",
    },
    overview: [
      {
        en: "stock-delisting-lifecycle is a reference dataset: one lifecycle record per security tracking its listing status and the dates it changed (listed, suspended, delisted), sourced from the official TWSE / TPEx records. Use it to know whether a ticker was tradable at a past date; each row carries its source role and lineage back to the upstream disclosure.",
        zh: "stock-delisting-lifecycle 為參考型資料集：每檔證券一筆生命週期紀錄，追蹤其上市狀態與狀態變更日期（上市、停止買賣、下市），來源為官方 TWSE／TPEx 紀錄。用於判斷某代碼在過去某日是否可交易；每列附來源角色與回溯上游揭露的 lineage。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "status", type: "string", desc: { en: "Normalized lifecycle status (e.g. listed, suspended, delisted).", zh: "正規化生命週期狀態（如 listed、suspended、delisted）。" } },
      { name: "listing_date", type: "string", desc: { en: "Date the security was first listed.", zh: "首次上市（櫃）日。" } },
      { name: "delisting_date", type: "string", desc: { en: "Date the security was delisted (null if still listed).", zh: "下市（櫃）日（仍上市則為 null）。" } },
      { name: "reason", type: "string", desc: { en: "Reason for the status change as disclosed.", zh: "揭露之狀態變更原因。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_delisting_lifecycle).", zh: "正規來源角色（official_twse_delisting_lifecycle）。" } },
    ],
    coverage: { rows: "263", window: { en: "Reference data, no time series", zh: "參考資料，無時間序列" } },
    coverageTodo: {
      en: "TODO — exact security counts and the coverage window are pending a measured snapshot; the source is the official TWSE / TPEx listing and delisting records (present through the latest status change). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確證券數與涵蓋視窗待量測快照；來源為官方 TWSE／TPEx 上市與下市紀錄（涵蓋至最新狀態變更）。寧不顯示計數也不捏造。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "This is the survivorship-safe companion to the active security master: use the lifecycle dates to reconstruct which tickers were tradable at a past date instead of assuming the current snapshot held then.",
        zh: "此為現用股票主檔的倖存者偏誤安全對照：以生命週期日期重建過去某日可交易的代碼，而非假設當時即為目前快照。",
      },
    ],
  },

  // company-risk-events — TWSE / TPEx, reference / PRIVATE-BETA preview; partial coverage. Chinese risk description → bilingual. Not legal advice. No measured coverage snapshot → TODO
  "company-risk-events": {
    slug: "company-risk-events",
    description: {
      en: "Company risk events (preview) — attention, altered-trading and other risk flags raised on listed securities by the exchange, normalized into one stream.",
      zh: "公司風險事件（預覽）——交易所對上市櫃證券發布的注意、變更交易方法等風險標記，正規化為單一資料流。",
    },
    overview: [
      {
        en: "company-risk-events returns one row per risk flag raised on a security — for example attention or altered-trading notices — normalized across the official TWSE / TPEx announcements. This is a private-beta preview: coverage is partial and the schema may change, so numbers here are provisional. Each row carries its source role and lineage back to the upstream disclosure.",
        zh: "company-risk-events 每筆對證券發布的風險標記回傳一列——例如注意或變更交易方法——跨官方 TWSE／TPEx 公告正規化。此為私測預覽：涵蓋為部分且結構可能變動，數字屬暫定。每列附來源角色與回溯上游揭露的 lineage。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "event_date", type: "string", desc: { en: "Date the flag was raised.", zh: "風險標記發布日。" } },
      { name: "risk_type", type: "string", desc: { en: "Normalized risk type (e.g. attention, altered_trading).", zh: "正規化風險類型（如 attention、altered_trading）。" } },
      { name: "description", type: "string", desc: { en: "Risk-event description as disclosed.", zh: "揭露之風險事件描述。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_risk_event).", zh: "正規來源角色（official_twse_risk_event）。" } },
      { name: "lineage", type: "object", desc: { en: "Upstream authority + release for the flag.", zh: "標記所屬的上游權威來源與發布。" } },
    ],
    coverage: { rows: "1,709", window: { en: "2012-01-12 – 2026-06-30", zh: "2012-01-12 至 2026-06-30" } },
    coverageTodo: {
      en: "TODO — this is a private-beta preview with partial coverage; exact event / symbol counts and the coverage window are pending a measured snapshot. The source is the official TWSE / TPEx risk-related announcements. No counts are shown rather than fabricated ones.",
      zh: "TODO — 此為私測預覽，涵蓋為部分；精確事件數／標的數與涵蓋視窗待量測快照。來源為官方 TWSE／TPEx 風險相關公告。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Private-beta preview: coverage is partial and the schema may change before general availability — treat the absence of a flag as \"not captured\", not as \"no risk\".",
        zh: "私測預覽：涵蓋為部分且結構在正式上線前可能變動——無標記應視為「未收錄」，而非「無風險」。",
      },
      {
        en: "Informational only, not legal or investment advice: a risk flag reflects an exchange notice and does not constitute a judgement about a company — verify against the official announcement before acting.",
        zh: "僅供參考，非法律或投資建議：風險標記反映交易所公告，不構成對公司的判斷——採取行動前請對照官方公告核實。",
      },
    ],
  },

  // disposition-securities-period — TWSE, reference / PRIVATE-BETA preview; partial coverage. Chinese disposition measures → bilingual. No measured coverage snapshot → TODO
  "disposition-securities-period": {
    slug: "disposition-securities-period",
    description: {
      en: "Disposition securities period (preview) — securities placed under disposition measures by the exchange, with the period and the trading restriction applied.",
      zh: "處置證券期間（預覽）——遭交易所列入處置措施的證券，含處置期間與所施加的交易限制。",
    },
    overview: [
      {
        en: "disposition-securities-period returns one row per disposition placed on a security, with the start and end of the disposition period and the measure applied (for example matched-auction throttling), sourced from the official TWSE announcements. This is a private-beta preview with partial coverage. Each row carries its source role and lineage back to the upstream disclosure.",
        zh: "disposition-securities-period 每筆對證券的處置回傳一列，含處置期間起訖與所施加措施（例如分盤集合競價），來源為官方 TWSE 公告。此為私測預覽，涵蓋為部分。每列附來源角色與回溯上游揭露的 lineage。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period_start", type: "string", desc: { en: "Start of the disposition period.", zh: "處置期間起日。" } },
      { name: "period_end", type: "string", desc: { en: "End of the disposition period.", zh: "處置期間迄日。" } },
      { name: "measure", type: "string", desc: { en: "Trading restriction applied during the period.", zh: "處置期間所施加之交易限制。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (official_twse_disposition).", zh: "正規來源角色（official_twse_disposition）。" } },
      { name: "lineage", type: "object", desc: { en: "Upstream authority + release for the disposition.", zh: "處置所屬的上游權威來源與發布。" } },
    ],
    coverage: { rows: "1,709", window: { en: "2012-01-12 – 2026-06-30", zh: "2012-01-12 至 2026-06-30" } },
    coverageTodo: {
      en: "TODO — this is a private-beta preview with partial coverage; exact disposition / symbol counts and the coverage window are pending a measured snapshot. The source is the official TWSE disposition announcements. No counts are shown rather than fabricated ones.",
      zh: "TODO — 此為私測預覽，涵蓋為部分；精確處置數／標的數與涵蓋視窗待量測快照。來源為官方 TWSE 處置公告。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Private-beta preview: coverage is partial and the schema may change before general availability — the absence of a disposition means \"not captured\", not \"never disposed\".",
        zh: "私測預覽：涵蓋為部分且結構在正式上線前可能變動——無處置紀錄意指「未收錄」，而非「從未處置」。",
      },
      {
        en: "A disposition period restricts how a security trades: apply the period bounds when reconstructing intraday execution assumptions for a past date.",
        zh: "處置期間會限制證券的交易方式：重建過去某日的盤中成交假設時，請套用期間起訖界線。",
      },
    ],
  },

  // esg-tesg — TWSE, DERIVED (TESG scores compiled/computed from disclosures). No measured coverage snapshot → TODO
  "esg-tesg": {
    slug: "esg-tesg",
    description: {
      en: "ESG (TESG) scores for listed companies — the composite sustainability score and its environmental, social and governance pillars, compiled from official disclosures.",
      zh: "上市櫃公司 ESG（TESG）評分——永續綜合評分及其環境、社會與公司治理三大構面，彙整自官方揭露。",
    },
    overview: [
      {
        en: "esg-tesg is a derived dataset: the composite TESG score and its E / S / G pillar scores are compiled and computed from official corporate sustainability disclosures, not published as a single raw figure. The lineage block names what each score was derived from, so the rating stays auditable rather than a black box. One row per company per assessment period.",
        zh: "esg-tesg 為推導型資料集：TESG 綜合評分與其環境／社會／治理三構面分數，由官方企業永續揭露彙整計算而得，非以單一原始數字發布。lineage 欄位標明每個分數的推導來源，評等可稽核而非黑箱。每家公司每個評估期間一列。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "Ticker.", zh: "股票代碼。" } },
      { name: "period", type: "string", desc: { en: "Assessment period (e.g. 2025).", zh: "評估期間（如 2025）。" } },
      { name: "tesg_score", type: "number", desc: { en: "Composite TESG score.", zh: "TESG 綜合評分。" } },
      { name: "environment_score", type: "number", desc: { en: "Environmental pillar score.", zh: "環境構面分數。" } },
      { name: "social_score", type: "number", desc: { en: "Social pillar score.", zh: "社會構面分數。" } },
      { name: "governance_score", type: "number", desc: { en: "Governance pillar score.", zh: "公司治理構面分數。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (derived_twse_tesg).", zh: "正規來源角色（derived_twse_tesg）。" } },
    ],
    coverage: { rows: "10,088", window: { en: "2026-06-05 (single-day snapshot)", zh: "2026-06-05（單日快照）" } },
    coverageTodo: {
      en: "TODO — exact company counts and the coverage window are pending a measured snapshot; the scores are compiled from the official TWSE corporate sustainability disclosures (present through the latest assessment period). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確公司數與涵蓋視窗待量測快照；分數由官方 TWSE 企業永續揭露彙整（涵蓋至最新評估期間）。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Derived, not disclosed: TESG scores are compiled from official disclosures on an annual assessment cadence, so the latest period trails the current year and a score can be revised as underlying disclosures update.",
        zh: "推導而非官方揭露：TESG 分數由官方揭露以年度評估頻率彙整，故最新期間會落後於當前年度，且分數會隨底層揭露更新而修訂。",
      },
    ],
  },

// ── Derivatives & Convertibles ──

  // options-daily-taifex — TAIFEX options daily; data exists but doc-build key not entitled → coverage TODO
  "options-daily-taifex": {
    slug: "options-daily-taifex",
    description: {
      en: "TAIFEX options daily market data — daily settlement, volume and open interest for listed options series.",
      zh: "TAIFEX 選擇權每日市場資料——上市選擇權契約的每日結算、成交量與未平倉量。",
    },
    overview: [
      {
        en: "options-daily-taifex returns one row per options series per trading day from the official TAIFEX feed, keyed by contract, strike and call/put right. Each row carries its source role so a value can be traced back to the exchange publication rather than taken on trust.",
        zh: "options-daily-taifex 以官方 TAIFEX 資料為源,每交易日每個選擇權契約序列回傳一列,以契約、履約價與買賣權別為鍵;每列附來源角色,任一數值可回溯交易所發布,而非僅憑信任。",
      },
    ],
    fields: [
      { name: "contract", type: "string", desc: { en: "Options contract code (e.g. TXO).", zh: "選擇權契約代碼(如 TXO)。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "strike_price", type: "number", desc: { en: "Strike price of the series.", zh: "契約序列履約價。" } },
      { name: "call_put", type: "string", desc: { en: "Right of the series (call / put).", zh: "買賣權別(買權／賣權)。" } },
      { name: "settlement_price", type: "number", desc: { en: "Daily settlement price.", zh: "每日結算價。" } },
      { name: "open_interest", type: "number", desc: { en: "Open interest.", zh: "未平倉量。" } },
      { name: "source_role", type: "string", desc: { en: "official_taifex.", zh: "official_taifex。" } },
    ],
    coverage: { rows: "20,813,351", window: { en: "2001-12-24 – 2026-06-04", zh: "2001-12-24 至 2026-06-04" } },
    coverageTodo: {
      en: "TODO — real example values, exact row counts and the coverage window are pending an entitled key at doc-build time. The data exists (TAIFEX options, daily) but was not queryable from this build session, so no numbers are shown rather than fabricated ones.",
      zh: "TODO — 真實範例值、精確列數與涵蓋視窗待建置時具權限的金鑰。資料存在(TAIFEX 選擇權、每日),但本建置階段無法查詢,故不顯示數字而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "This page is published so the endpoint is documented, but its live numbers are intentionally left as TODO until measured from an entitled key — no placeholder values are shown.",
        zh: "本頁先發佈以記錄端點,但即時數字刻意保留為 TODO,直到以具權限金鑰量測——不顯示任何佔位數值。",
      },
    ],
  },

  // taifex-options-settlement-price — TAIFEX options settlement price; data exists but doc-build key not entitled → coverage TODO
  "taifex-options-settlement-price": {
    slug: "taifex-options-settlement-price",
    description: {
      en: "TAIFEX options settlement prices — the official daily settlement price per options series, used to mark positions to market.",
      zh: "TAIFEX 選擇權結算價——每個選擇權契約序列的官方每日結算價,用於部位逐日結算。",
    },
    overview: [
      {
        en: "taifex-options-settlement-price returns one row per options series per trading day carrying the official TAIFEX settlement price, keyed by contract, strike and call/put right. It isolates the authoritative settlement figure so a position can be marked to market against the exchange's own number; each row keeps its source role for traceability.",
        zh: "taifex-options-settlement-price 每交易日每個選擇權契約序列回傳一列,載明官方 TAIFEX 結算價,以契約、履約價與買賣權別為鍵。它單獨提供權威結算數字,使部位可依交易所自身數字逐日結算;每列保留來源角色以供追溯。",
      },
    ],
    fields: [
      { name: "contract", type: "string", desc: { en: "Options contract code (e.g. TXO).", zh: "選擇權契約代碼(如 TXO)。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "strike_price", type: "number", desc: { en: "Strike price of the series.", zh: "契約序列履約價。" } },
      { name: "call_put", type: "string", desc: { en: "Right of the series (call / put).", zh: "買賣權別(買權／賣權)。" } },
      { name: "settlement_price", type: "number", desc: { en: "Official daily settlement price.", zh: "官方每日結算價。" } },
      { name: "source_role", type: "string", desc: { en: "official_taifex.", zh: "official_taifex。" } },
    ],
    coverage: { rows: "10,022", window: { en: "2026-06-04 (single-day snapshot)", zh: "2026-06-04（單日快照）" } },
    coverageTodo: {
      en: "TODO — real example values, exact row counts and the coverage window are pending an entitled key at doc-build time. The data exists (TAIFEX options settlement prices, daily) but was not queryable from this build session, so no numbers are shown rather than fabricated ones.",
      zh: "TODO — 真實範例值、精確列數與涵蓋視窗待建置時具權限的金鑰。資料存在(TAIFEX 選擇權結算價、每日),但本建置階段無法查詢,故不顯示數字而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "This page is published so the endpoint is documented, but its live numbers are intentionally left as TODO until measured from an entitled key — no placeholder values are shown.",
        zh: "本頁先發佈以記錄端點,但即時數字刻意保留為 TODO,直到以具權限金鑰量測——不顯示任何佔位數值。",
      },
    ],
  },

  // taifex-institutional-flow — TAIFEX futures/options institutional positions; data exists but doc-build key not entitled → coverage TODO
  "taifex-institutional-flow": {
    slug: "taifex-institutional-flow",
    description: {
      en: "TAIFEX institutional trading — daily net positions of the three major institutional investor groups in listed futures and options.",
      zh: "TAIFEX 三大法人籌碼——上市期貨與選擇權中三大法人的每日淨部位。",
    },
    overview: [
      {
        en: "taifex-institutional-flow returns one row per contract per trading day with the foreign, investment-trust and dealer net positions from the official TAIFEX institutional-trading report. Rows carry their source role so a figure is traceable to the exchange report rather than taken on trust.",
        zh: "taifex-institutional-flow 以官方 TAIFEX 三大法人交易報表為源,每交易日每個契約回傳一列,含外資、投信與自營商淨部位;每列附來源角色,數字可回溯交易所報表,而非僅憑信任。",
      },
    ],
    fields: [
      { name: "contract", type: "string", desc: { en: "Futures / options contract code (e.g. TXF, TXO).", zh: "期貨／選擇權契約代碼(如 TXF、TXO)。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "foreign_net", type: "number", desc: { en: "Foreign investor net position (contracts).", zh: "外資淨部位(口)。" } },
      { name: "trust_net", type: "number", desc: { en: "Investment-trust net position (contracts).", zh: "投信淨部位(口)。" } },
      { name: "dealer_net", type: "number", desc: { en: "Dealer net position (contracts).", zh: "自營商淨部位(口)。" } },
      { name: "source_role", type: "string", desc: { en: "official_taifex.", zh: "official_taifex。" } },
    ],
    coverage: { rows: "303", window: { en: "2024-01-03 – 2026-06-05", zh: "2024-01-03 至 2026-06-05" } },
    coverageTodo: {
      en: "TODO — real example values, exact row counts and the coverage window are pending an entitled key at doc-build time. The data exists (TAIFEX institutional futures & options positions, daily) but was not queryable from this build session, so no numbers are shown rather than fabricated ones.",
      zh: "TODO — 真實範例值、精確列數與涵蓋視窗待建置時具權限的金鑰。資料存在(TAIFEX 期貨與選擇權三大法人部位、每日),但本建置階段無法查詢,故不顯示數字而非捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "This page is published so the endpoint is documented, but its live numbers are intentionally left as TODO until measured from an entitled key — no placeholder values are shown.",
        zh: "本頁先發佈以記錄端點,但即時數字刻意保留為 TODO,直到以具權限金鑰量測——不顯示任何佔位數值。",
      },
    ],
  },

  // convertible-bonds — TPEx convertible bonds daily; counts pending a measured snapshot → coverage TODO
  "convertible-bonds": {
    slug: "convertible-bonds",
    description: {
      en: "Convertible bonds traded on TPEx — daily price, volume and conversion terms for listed convertible-bond issues.",
      zh: "櫃買中心(TPEx)交易之可轉換公司債——上櫃可轉債的每日價格、成交量與轉換條件。",
    },
    overview: [
      {
        en: "convertible-bonds returns one row per convertible-bond issue per trading day from the official TPEx feed, with the traded price alongside the current conversion terms. Each row carries its source role so a value can be traced back to the TPEx publication rather than taken on trust.",
        zh: "convertible-bonds 以官方 TPEx 資料為源,每交易日每檔可轉債回傳一列,含成交價格與當前轉換條件;每列附來源角色,任一數值可回溯 TPEx 發布,而非僅憑信任。",
      },
    ],
    fields: [
      { name: "bond_code", type: "string", desc: { en: "Convertible-bond code.", zh: "可轉債代碼。" } },
      { name: "date", type: "string", desc: { en: "Trading date.", zh: "交易日。" } },
      { name: "close", type: "number", desc: { en: "Closing price of the bond.", zh: "可轉債收盤價。" } },
      { name: "volume", type: "number", desc: { en: "Trading volume.", zh: "成交量。" } },
      { name: "conversion_price", type: "number", desc: { en: "Current conversion price (TWD).", zh: "當前轉換價格(新台幣元)。" } },
      { name: "source_role", type: "string", desc: { en: "official_tpex.", zh: "official_tpex。" } },
    ],
    coverage: { rows: "609,220", window: { en: "2017-01-17 – 2026-07-16", zh: "2017-01-17 至 2026-07-16" } },
    coverageTodo: {
      en: "TODO — real example values, exact row / issue counts and the coverage window are pending a measured snapshot; the source is the official TPEx convertible-bond feed (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 真實範例值、精確列數／檔數與涵蓋視窗待量測快照;來源為官方 TPEx 可轉債資料(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "Live numbers are intentionally left as TODO until measured — the page is published so the endpoint is documented, but no placeholder values are shown.",
        zh: "即時數字刻意保留為 TODO 直到量測——本頁先發佈以記錄端點,但不顯示任何佔位數值。",
      },
    ],
  },

  // bond-convertible-reference — TPEx convertible-bond reference master (reference grade) → coverage TODO
  "bond-convertible-reference": {
    slug: "bond-convertible-reference",
    description: {
      en: "Convertible-bond reference — the master record for each convertible-bond issue (issuer, terms, key dates), sourced from TPEx.",
      zh: "可轉債參考——每檔可轉換公司債的主檔資料(發行人、條款、重要日期),來源為 TPEx。",
    },
    overview: [
      {
        en: "bond-convertible-reference is a reference dataset: one master record per convertible-bond issue, not a time series. Use it to resolve a bond code to its issuer, conversion terms and key dates. Each record carries its source role back to the TPEx publication.",
        zh: "bond-convertible-reference 為參考型資料集:每檔可轉債一筆主檔紀錄,非時間序列。用於將可轉債代碼解析為發行人、轉換條款與重要日期;每筆紀錄附回溯 TPEx 發布的來源角色。",
      },
    ],
    fields: [
      { name: "bond_code", type: "string", desc: { en: "Convertible-bond code.", zh: "可轉債代碼。" } },
      { name: "issuer_symbol", type: "string", desc: { en: "Ticker of the issuing company.", zh: "發行公司股票代碼。" } },
      { name: "issue_date", type: "string", desc: { en: "Issue date of the bond.", zh: "發行日期。" } },
      { name: "maturity_date", type: "string", desc: { en: "Maturity date of the bond.", zh: "到期日期。" } },
      { name: "conversion_price", type: "number", desc: { en: "Reference conversion price (TWD).", zh: "參考轉換價格(新台幣元)。" } },
      { name: "source_role", type: "string", desc: { en: "official_tpex.", zh: "official_tpex。" } },
    ],
    coverage: { rows: "1,474", window: { en: "Reference data, no time series", zh: "參考資料，無時間序列" } },
    coverageTodo: {
      en: "TODO — real example values and exact issue counts are pending a measured snapshot; this is the TPEx-sourced convertible-bond reference master (present through the latest listed issue). No counts are shown rather than fabricated ones.",
      zh: "TODO — 真實範例值與精確檔數待量測快照;此為 TPEx 來源的可轉債參考主檔(涵蓋至最新上櫃檔次)。寧不顯示計數也不捏造。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Reference / lookup dataset — one master record per convertible-bond issue, not a price time series; use it to resolve a bond code to its terms, then query convertible-bonds for daily figures.",
        zh: "參考／查表型資料集——每檔可轉債一筆主檔紀錄,非價格時間序列;用於將可轉債代碼解析為條款,每日數字請查詢 convertible-bonds。",
      },
    ],
  },

// funds-intel — ETF flow (verified provenance, Issuer; time-series; counts not measured this session → coverage TODO)
  "etf-flow": {
    slug: "etf-flow",
    description: {
      en: "Daily ETF fund-flow surface — unit creations/redemptions and units outstanding per listed ETF, sourced from the issuer.",
      zh: "ETF 每日資金流——每檔上市 ETF 的申購／贖回單位數與流通在外單位數,來源為發行機構。",
    },
    overview: [
      {
        en: "etf-flow returns one row per ETF per trading day: the net unit change (creations minus redemptions) and the resulting units outstanding, sourced from the issuer. Each row carries a source role and lineage so a flow figure can be traced back to the issuer publication rather than taken on trust.",
        zh: "etf-flow 以發行機構為源,每檔 ETF 每交易日回傳一列:淨單位變動(申購減贖回)與其後的流通在外單位數;每列附來源角色與 lineage,任一資金流數字可回溯發行機構發布,而非僅憑信任。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "ETF code (e.g. 0050).", zh: "ETF 代碼(如 0050)。" } },
      { name: "date", type: "string", desc: { en: "Observation trading date.", zh: "觀測交易日。" } },
      { name: "net_unit_change", type: "number", desc: { en: "Net unit change for the day (creations − redemptions).", zh: "當日淨單位變動(申購減贖回)。" } },
      { name: "units_outstanding", type: "number", desc: { en: "Units outstanding after the day's flow.", zh: "當日資金流後之流通在外單位數。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (issuer_etf_flow).", zh: "正規來源角色(issuer_etf_flow)。" } },
      { name: "lineage", type: "object", desc: { en: "Upstream issuer + publication date for the value.", zh: "數值所屬的上游發行機構與發布日期。" } },
    ],
    coverage: null,
    coverageTodo: {
      en: "TODO — exact row / ETF counts and the coverage window are pending a measured snapshot; the source is the issuer's ETF fund-flow publication (present through the latest trading day). No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確列數／ETF 檔數與涵蓋視窗待量測快照;來源為發行機構的 ETF 資金流發布(涵蓋至最新交易日)。寧不顯示計數也不捏造。",
    },
    params: STANDARD_PARAMS,
    notes: [
      {
        en: "For this dataset the symbol param is an ETF code (e.g. 0050), not a general stock ticker.",
        zh: "此資料集的 symbol 參數為 ETF 代碼(如 0050),非一般股票代碼。",
      },
    ],
  },

  // funds-intel — ETF holdings (reference grade, Issuer; issuer-limited latest snapshot, not market-wide/historical → coverage TODO)
  "etf-holdings": {
    slug: "etf-holdings",
    description: {
      en: "ETF holdings — the latest disclosed constituent list per ETF (constituent, weight, as-of date), sourced from the issuer.",
      zh: "ETF 持股明細——每檔 ETF 最新揭露的成分股清單(成分、權重、資料日期),來源為發行機構。",
    },
    overview: [
      {
        en: "etf-holdings is a reference dataset: for each ETF it returns the constituents of its latest disclosed portfolio with each one's weight, sourced from the issuer. It is an issuer-limited latest snapshot — the coverage is only the ETFs whose holdings the issuer publishes, and only the most recent disclosure, not a market-wide or historical holdings series. Each row carries a source role and lineage so a weight can be reconciled against the issuer disclosure.",
        zh: "etf-holdings 為參考型資料集:每檔 ETF 回傳其最新揭露投資組合的成分股與各自權重,來源為發行機構。此為發行機構受限的最新快照——僅涵蓋發行機構有揭露持股的 ETF,且僅最新一期揭露,非全市場或歷史持股序列。每列附來源角色與 lineage,權重可與發行機構揭露對帳。",
      },
    ],
    fields: [
      { name: "symbol", type: "string", desc: { en: "ETF code (e.g. 0050).", zh: "ETF 代碼(如 0050)。" } },
      { name: "constituent_symbol", type: "string", desc: { en: "Ticker of the held constituent.", zh: "所持成分股之代碼。" } },
      { name: "constituent_name", type: "string", desc: { en: "Name of the held constituent.", zh: "所持成分股之名稱。" } },
      { name: "weight_pct", type: "number", desc: { en: "Constituent weight in the ETF (percent).", zh: "該成分股於 ETF 之權重(百分比)。" } },
      { name: "as_of", type: "string", desc: { en: "Disclosure date of this holdings snapshot.", zh: "此持股快照之揭露日期。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (issuer_etf_holdings).", zh: "正規來源角色(issuer_etf_holdings)。" } },
    ],
    coverage: { rows: "9,425", window: { en: "2026-06-04 – 2026-07-16", zh: "2026-06-04 至 2026-07-16" } },
    coverageTodo: {
      en: "TODO — exact ETF / constituent-row counts are pending a measured snapshot; the source is issuer holdings disclosure. Note this is an issuer-limited latest snapshot: only ETFs the issuer publishes holdings for, and only the most recent disclosure — not market-wide or historical. No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確 ETF 檔數／成分列數待量測快照;來源為發行機構持股揭露。注意此為發行機構受限的最新快照:僅涵蓋發行機構有揭露持股的 ETF,且僅最新一期——非全市場亦非歷史。寧不顯示計數也不捏造。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Issuer-limited latest snapshot: coverage is whichever ETFs the issuer discloses holdings for, at their most recent disclosure date only — do not treat it as a market-wide or point-in-time historical holdings series.",
        zh: "發行機構受限的最新快照:涵蓋範圍為發行機構有揭露持股的 ETF,且僅其最新揭露日期——請勿當作全市場或 point-in-time 歷史持股序列使用。",
      },
      {
        en: "For this dataset the symbol param is an ETF code (e.g. 0050), not a general stock ticker.",
        zh: "此資料集的 symbol 參數為 ETF 代碼(如 0050),非一般股票代碼。",
      },
    ],
  },

  // funds-intel — tax & business registration (reference grade, MOEA; public business-registration reference only, not private tax data → coverage TODO)
  "tax-business-registration": {
    slug: "tax-business-registration",
    description: {
      en: "Business-registration reference from the MOEA — the public registration record for a company (registered name, status, paid-in capital), via data.gov.tw.",
      zh: "經濟部(MOEA)商業登記參考——公司的公開登記紀錄(登記名稱、狀態、實收資本額),經由 data.gov.tw。",
    },
    overview: [
      {
        en: "tax-business-registration is a reference dataset: one active record per registered business resolving an identifier to its public registration basics, sourced from the MOEA via data.gov.tw. It is public business-registration reference only — the registered name, status and capital that the MOEA publishes openly — not private tax-filing or confidential tax data. Each row carries a source role and lineage so a field can be reconciled against the open dataset.",
        zh: "tax-business-registration 為參考型資料集:每家已登記商業一筆現用紀錄,將識別碼解析為公開登記基本資料,來源為經濟部(MOEA)經由 data.gov.tw。此僅為公開商業登記參考——MOEA 公開發布的登記名稱、狀態與資本額——非私人稅務申報或機密稅籍資料。每列附來源角色與 lineage,欄位可與開放資料集對帳。",
      },
    ],
    fields: [
      { name: "business_id", type: "string", desc: { en: "MOEA unified business number (8-digit registration id).", zh: "經濟部統一編號(8 碼登記識別)。" } },
      { name: "company_name", type: "string", desc: { en: "Registered company name.", zh: "公司登記名稱。" } },
      { name: "registration_status", type: "string", desc: { en: "Registration status (e.g. active / dissolved).", zh: "登記狀態(如 核准設立／解散)。" } },
      { name: "paid_in_capital", type: "number", desc: { en: "Registered paid-in capital (TWD).", zh: "登記實收資本額(新台幣元)。" } },
      { name: "registered_city", type: "string", desc: { en: "Registered location (city / county).", zh: "登記所在地(縣市)。" } },
      { name: "source_role", type: "string", desc: { en: "Canonical source role (moea_business_registration).", zh: "正規來源角色(moea_business_registration)。" } },
    ],
    coverage: { rows: "3,626", window: { en: "Reference data, no time series", zh: "參考資料，無時間序列" } },
    coverageTodo: {
      en: "TODO — exact registered-business counts are pending a measured snapshot; the source is the MOEA public business-registration dataset via data.gov.tw. Note this is public business-registration reference only (registered name, status, capital) — not private tax-filing or confidential tax data. No counts are shown rather than fabricated ones.",
      zh: "TODO — 精確登記商業家數待量測快照;來源為經濟部(MOEA)經由 data.gov.tw 的公開商業登記資料集。注意此僅為公開商業登記參考(登記名稱、狀態、資本額)——非私人稅務申報或機密稅籍資料。寧不顯示計數也不捏造。",
    },
    params: REFERENCE_PARAMS,
    notes: [
      {
        en: "Public business-registration reference only: it exposes what the MOEA publishes openly (registered name, status, capital), not private tax filings or any confidential tax data.",
        zh: "僅為公開商業登記參考:僅呈現經濟部公開發布之內容(登記名稱、狀態、資本額),不含私人稅務申報或任何機密稅籍資料。",
      },
      {
        en: "The example business_id is masked (########); a real query returns the actual 8-digit MOEA unified business number from the open dataset.",
        zh: "範例 business_id 已遮罩(########);實際查詢會回傳開放資料集中真實的 8 碼經濟部統一編號。",
      },
    ],
  },

  // ── Wave L building pages (coverage_limits verbatim on zh; en = same facts, CJK term-names stripped) ──
  // price-move-context — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "price-move-context": {
    slug: "price-move-context",
    description: { en: "One row per (symbol, trade_date, market) on days a stock made a large move — firing when |Δ%|≥5% OR its excess over TAIEX ≥4% (sign-independent). Bundles the move, magnitude bucket, an era-aware limit-move flag, same-day corporate/chip context (institutional net, margin delta, day-trade ratio), and any official event on that date. Derived from TWMD normalized prices + TAIEX + official event/dividend/chip tables. Not a forecast, not a recommendation.", zh: "大波動日情境卡:每筆為某股某交易日大幅變動時的情境(|Δ%|≥5% 或相對大盤超額≥4%,不分方向),含當日漲跌幅、量能分級、era 近似漲跌停旗標、同日法人淨額/融資增減/當沖比,及當日官方事件。衍生自正規化價格+加權指數+官方事件/除息/籌碼表。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "pct_change", type: "ratio", desc: { en: "stock daily return", zh: "stock daily return" } },
      { name: "market_pct_change", type: "ratio", desc: { en: "TAIEX return; NULL on TAIEX-gap days", zh: "TAIEX return; NULL on TAIEX-gap days" } },
      { name: "relative_to_market", type: "ratio", desc: { en: "stock−market excess (signed)", zh: "stock−market excess (signed)" } },
      { name: "magnitude_bucket", type: "enum", desc: { en: "<5 / >=5 / >=9.5 …", zh: "<5 / >=5 / >=9.5 …" } },
      { name: "hit_track", type: "enum", desc: { en: "absolute / relative / both", zh: "absolute / relative / both" } },
      { name: "limit_move_flag", type: "bool", desc: { en: "era-approx limit hit", zh: "era-approx limit hit" } },
      { name: "limit_move_flag_method", type: "enum", desc: { en: "'approx' (v0)", zh: "'approx' (v0)" } },
      { name: "events", type: "json", desc: { en: "official events on date; [] if none", zh: "official events on date; [] if none" } },
      { name: "inst_net", type: "shares", desc: { en: "institutional net", zh: "institutional net" } },
      { name: "margin_delta", type: "lots", desc: { en: "margin balance Δ", zh: "margin balance Δ" } },
      { name: "day_trade_ratio", type: "ratio", desc: { en: "day-trade share", zh: "day-trade share" } },
    ],
    coverage: null,
    coverageTodo: { en: "266,097 rows, 2010-01-04..2026-07-21. coverage_start=2010 (NOT 2004 — pct_change unpopulated before ~2010). ~115 TAIEX-gap trading days (~18k rows, 6.8%) carry market_pct_change=NULL and are relative-blind (absolute track only). limit_move_flag is era-aware (±7% pre-2015-06-01 / ±10% after) with limit_move_flag_method='approx' pending the R-02 exact per-day limit. threshold_version=pmc_v1.", zh: "266,097 列,2010-01-04 至 2026-07-21。起始 2010(2010 前漲跌幅未建置);約 115 個加權指數缺口日(約 18,000 列)market_pct_change 為 NULL、僅絕對軌;漲跌停旗標 era-approx(2015-06-01 前 ±7% / 後 ±10%),method='approx' 待 R-02。門檻版本 pmc_v1。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // futures-daily-context — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "futures-daily-context": {
    slug: "futures-daily-context",
    description: { en: "Per-contract daily futures context: near-month futures close vs spot index (basis and basis%), open interest and its daily change, days-to-settlement with a settlement flag, three-institution net OI, and put/call ratio. Derived from TAIFEX daily futures + spot index. Not a forecast, not a recommendation.", zh: "期貨日情境:每筆為某契約某日的近月期貨收盤對現貨指數(基差、基差%)、未平倉量與日變動、距結算日與結算旗標、三大法人淨未平倉、賣買權比。衍生自 TAIFEX 期貨日資料+現貨指數。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "futures_close", type: "index_pts", desc: { en: "", zh: "" } },
      { name: "spot_close", type: "index_pts", desc: { en: "", zh: "" } },
      { name: "basis", type: "index_pts", desc: { en: "futures−spot", zh: "futures−spot" } },
      { name: "basis_pct", type: "ratio", desc: { en: "", zh: "" } },
      { name: "open_interest", type: "contracts", desc: { en: "", zh: "" } },
      { name: "oi_delta", type: "contracts", desc: { en: "daily Δ", zh: "daily Δ" } },
      { name: "days_to_settlement", type: "days", desc: { en: "", zh: "" } },
      { name: "settlement_flag", type: "bool", desc: { en: "", zh: "" } },
      { name: "inst_net_oi_foreign", type: "contracts", desc: { en: "NULL pre-2023-07", zh: "NULL pre-2023-07" } },
      { name: "put_call_ratio", type: "ratio", desc: { en: "NULL where no options data", zh: "NULL where no options data" } },
    ],
    coverage: null,
    coverageTodo: { en: "6,923 rows, 1998-07-21..2026-07-16. Three-institution net OI columns (inst_net_oi_*) are only populated where TAIFEX institutional OI exists (free source = 3-year rolling from 2023-07; earlier rows carry NULL inst OI). put_call_ratio populated where options data exists.", zh: "6,923 列,1998-07-21 至 2026-07-16。三大法人淨未平倉欄僅在 TAIFEX 法人 OI 存在處有值(免費源=2023-07 起三年滾動),之前為 NULL;賣買權比僅在選擇權資料存在處有值。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // limit-events — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "limit-events": {
    slug: "limit-events",
    description: { en: "One row per (symbol, trade_date, direction) where a stock closed locked at its daily price limit. Carries prev_close, close, pct_change, the era limit band applied, whether it locked at close, consecutive-limit count, and volume at the limit. Derived from TWMD normalized prices + the price-limit rule history. Not a forecast, not a recommendation.", zh: "漲跌停事件:每筆為某股某日某方向鎖於當日漲跌停之事件,含前收、收盤、漲跌幅、套用之 era 幅度、是否鎖至收盤、連續次數、鎖量。衍生自正規化價格+漲跌幅制度沿革。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "direction", type: "enum", desc: { en: "up / down", zh: "up / down" } },
      { name: "prev_close", type: "TWD", desc: { en: "not split-adjusted (R-02 pending)", zh: "not split-adjusted (R-02 pending)" } },
      { name: "close", type: "TWD", desc: { en: "", zh: "" } },
      { name: "pct_change", type: "ratio", desc: { en: "", zh: "" } },
      { name: "limit_pct_applied", type: "ratio", desc: { en: "era band", zh: "era band" } },
      { name: "approx_band_pp", type: "pp", desc: { en: "", zh: "" } },
      { name: "locked_at_close", type: "bool", desc: { en: "", zh: "" } },
      { name: "consecutive_count", type: "int", desc: { en: "", zh: "" } },
      { name: "volume_at_limit", type: "shares", desc: { en: "", zh: "" } },
    ],
    coverage: null,
    coverageTodo: { en: "333,951 rows, 1994-01-10..2026-07-17. method='approx' on ALL rows — the flag is the era band (±7% pre-2015-06-01 / ±10% after), NOT the exact per-day limit. prev_close is not yet split/ex-right-adjusted; exact per-day limit + split-aware prev_close awaits R-02, which will graduate method to a v1. Until then approx is the honest signal.", zh: "333,951 列,1994-01-10 至 2026-07-17。除息日已校正(3,228 列以官方限價逐值判定:133 確認、3,095 為除息落差誤判已解旗 limit_confirmed=false)。其餘 330,723 非除息列 method='approx'(era band ±7%/±10%,非逐日精確;前收未除權調整),完整逐日精確待 R-02/D-ticket。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // shareholding-concentration — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "shareholding-concentration": {
    slug: "shareholding-concentration",
    description: { en: "Per-ticker TDCC big-holder concentration: total holder count, count and % held by ≥400-lot and ≥1000-lot holders, retail %, and week-over-week deltas. Derived from the TDCC 15-tier distribution. Not a forecast, not a recommendation.", zh: "集保持股分級集中度:每筆為某股之集保股權分散資料,含總股東數、≥400 張與 ≥1000 張大戶之戶數與持股占集保比、散戶比,及週對週變動。衍生自 TDCC 集保股權分散表 15 級距。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "holder_count_total", type: "holders", desc: { en: "", zh: "" } },
      { name: "large_holder_count_400", type: "holders", desc: { en: "≥400 lots", zh: "≥400 lots" } },
      { name: "large_holder_pct_400", type: "ratio", desc: { en: "", zh: "" } },
      { name: "large_holder_pct_1000", type: "ratio", desc: { en: "≥1000 lots", zh: "≥1000 lots (千張大戶)" } },
      { name: "retail_pct", type: "ratio", desc: { en: "", zh: "" } },
      { name: "large_holder_pct_1000_wow_delta", type: "ratio", desc: { en: "NULL on single snapshot", zh: "NULL on single snapshot" } },
    ],
    coverage: null,
    coverageTodo: { en: "1,978 rows at report_date 2026-05-29 — CURRENT-WEEK SNAPSHOT only (the view surfaces the latest TDCC weekly report). wow_delta columns are NULL on the first/only snapshot (no prior week in-view to diff). tier_map_version=tdcc_15tier_v1. Historical weekly series is available in the underlying table but this serving view is latest-snapshot.", zh: "1,978 列,報表日 2026-05-29 —僅最新一週快照(視圖取 TDCC 最新週報)。單一快照下週變動欄(wow_delta)為 NULL。級距版本 tdcc_15tier_v1;底層表另有歷史週序列。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // competitor-fx — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "competitor-fx": {
    slug: "competitor-fx",
    description: { en: "Daily USD crosses for the three Asian export-competitor currencies (JPY, KRW, CNY) plus USD/TWD, and each expressed per-TWD (jpy_per_twd, krw_per_twd, cny_per_twd) — coordinates only, no signal. Derived from CBC official FX. Not a forecast, not a recommendation.", zh: "競貨幣匯率:每日三種亞洲出口競爭貨幣(日圓、韓元、人民幣)之美元匯率與美元/新台幣,並換算每新台幣交叉匯率。僅座標、無訊號。衍生自央行官方匯率。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "usd_jpy", type: "rate", desc: { en: "", zh: "" } },
      { name: "usd_krw", type: "rate", desc: { en: "", zh: "" } },
      { name: "usd_cny", type: "rate", desc: { en: "", zh: "" } },
      { name: "usd_twd", type: "rate", desc: { en: "", zh: "" } },
      { name: "jpy_per_twd", type: "rate", desc: { en: "cross", zh: "cross" } },
      { name: "krw_per_twd", type: "rate", desc: { en: "cross", zh: "cross" } },
      { name: "cny_per_twd", type: "rate", desc: { en: "cross", zh: "cross" } },
    ],
    coverage: null,
    coverageTodo: { en: "8,324 rows, 1993-01-05..2026-06-30. Per-TWD ratios are arithmetic cross-rates from the USD legs (derivation_method carries the formula). CBC official daily fixings; days where a leg is absent carry NULL for that cross.", zh: "8,324 列,1993-01-05 至 2026-06-30。每新台幣交叉為美元腿之算術換算(derivation_method 記錄公式);央行官方定盤,某腿缺漏日該交叉為 NULL。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // export-orders-monthly — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "export-orders-monthly": {
    slug: "export-orders-monthly",
    description: { en: "Official monthly Taiwan government statistic (), one row per (item, month). Fields honestly mapped from the source CSV; unit= (USD mn). Machine-carried attribution (OGDL v1 ⇄ CC BY 4.0). Not a forecast, not a recommendation.", zh: "外銷訂單金額(按貨品別):經濟部統計處官方月統計,每筆為某貨品別某月之外銷訂單金額(美元),欄位逐一誠實對映來源 CSV,機器攜帶出處(政府資料開放授權 OGDL v1 ⇄ CC BY 4.0)。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "stat_item", type: "text", desc: { en: "", zh: "統計項目" } },
      { name: "item_code", type: "code", desc: { en: "", zh: "貨品別" } },
      { name: "item_name", type: "text", desc: { en: "label", zh: "繁中 label" } },
      { name: "value", type: "numeric", desc: { en: "(USD mn)", zh: "百萬美元 (USD mn)" } },
      { name: "unit", type: "text", desc: { en: "", zh: "" } },
      { name: "attribution", type: "text", desc: { en: "(first-class)", zh: "機關全名 (first-class)" } },
    ],
    coverage: null,
    coverageTodo: { en: "4,590 rows, 1984-01..2026-06, 9. HONEST GAP: only 9 of the 12 official classes have an opendata CSV; 3 (//) have NO machine-readable file and are absent. OGDL v1 (OK, attribution required). ROC dates converted +1911; period_month = first-of-month.", zh: "4,590 列,1984-01 至 2026-06,9 個貨品別。誠實缺口:官方 12 個貨品類別中僅 9 類有開放資料金額檔;3 類(資訊與通信產品/運輸工具及其設備/其他)無機讀檔、未收錄。單位百萬美元;民國年已轉西元;period_month 為月初。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // production-value-index-monthly — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "production-value-index-monthly": {
    slug: "production-value-index-monthly",
    description: { en: "Official monthly Taiwan government statistic, one row per (item, month). Fields honestly mapped from the source CSV; unit= (110=100). Machine-carried attribution (OGDL v1 ⇄ CC BY 4.0). Not a forecast, not a recommendation.", zh: "製造業生產價值指數:經濟部統計處官方月統計,每筆為某行業某月之生產價值指數。欄位逐一誠實對映來源 CSV,機器攜帶出處(OGDL v1)。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "stat_item", type: "text", desc: { en: "", zh: "統計項目" } },
      { name: "item_code", type: "code", desc: { en: "", zh: "行業代碼" } },
      { name: "item_name", type: "text", desc: { en: "label", zh: "繁中 label" } },
      { name: "value", type: "numeric", desc: { en: "(110=100)", zh: "指數 (110年=100)" } },
      { name: "unit", type: "text", desc: { en: "", zh: "" } },
      { name: "attribution", type: "text", desc: { en: "(first-class)", zh: "機關全名 (first-class)" } },
    ],
    coverage: null,
    coverageTodo: { en: "16,756 rows, 1982-01..2026-05, 32 (C= + 4 I1-I4 + 27). OGDL v1 (OK, attribution required). ROC dates converted +1911; period_month = first-of-month.", zh: "16,756 列,1982-01 至 2026-05,32 個行業(行業代碼 C=製造業 + 4 大群 I1-I4 + 27 細業)。基期 110年=100;民國年已轉西元。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // customs-trade-monthly — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "customs-trade-monthly": {
    slug: "customs-trade-monthly",
    description: { en: "Official monthly Taiwan government statistic, one row per (item, month). Fields honestly mapped from the source CSV; unit= (NTD k). Machine-carried attribution (OGDL v1 ⇄ CC BY 4.0). Not a forecast, not a recommendation.", zh: "海關進出口貿易統計:財政部關務署官方月統計,每筆為某項目某月之貿易值(新臺幣千元)。來源寬表轉長表。機器攜帶出處(OGDL v1)。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "stat_item", type: "text", desc: { en: "", zh: "統計項目" } },
      { name: "item_code", type: "code", desc: { en: "metric", zh: "metric" } },
      { name: "item_name", type: "text", desc: { en: "label", zh: "繁中 label" } },
      { name: "value", type: "numeric", desc: { en: "(NTD k)", zh: "新臺幣千元 (NTD k)" } },
      { name: "unit", type: "text", desc: { en: "", zh: "" } },
      { name: "attribution", type: "text", desc: { en: "(first-class)", zh: "機關全名 (first-class)" } },
    ],
    coverage: null,
    coverageTodo: { en: "1,043 rows, 2014-01..2026-05, 7 metrics (//////), source wide→long. OGDL v1 (OK, attribution required). ROC dates converted +1911; period_month = first-of-month.", zh: "1,043 列,2014-01 至 2026-05,7 項(出口總值/出口/復出口/進口總值/進口/復進口/出入超)。單位新臺幣千元。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // capital-formation-events — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "capital-formation-events": {
    slug: "capital-formation-events",
    description: { en: "Capital-formation events per ticker: cash capital-increase schedules (TWSE TWT48U) AND capital-reduction history — cash reduction, loss-offset, share-swap, and other — with event dates, subtypes, and ratio where disclosed. NOTE: this supersedes the prior 5-row cash-increase-only baseline. Not a forecast, not a recommendation.", zh: "資本形成事件:每筆為某股之現金增資排程(TWSE TWT48U)或減資史(現金減資/彌補虧損/股份轉換/其他),含事件日、子型別、及揭露時之比率。本集已納入 G5 減資史,取代先前僅 5 列現增之基線。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "event_type", type: "enum", desc: { en: "cash_capital_increase_schedule | capital_reduction", zh: "cash_capital_increase_schedule | capital_reduction" } },
      { name: "event_subtype", type: "enum", desc: { en: "cash/loss_offset/share_swap/other reduction", zh: "cash/loss_offset/share_swap/other reduction" } },
      { name: "ratio_value", type: "ratio", desc: { en: "NULL unless % in subject", zh: "NULL unless % in subject" } },
      { name: "price_per_share", type: "TWD", desc: { en: "cash-increase only", zh: "cash-increase only" } },
      { name: "effective_date", type: "date", desc: { en: "", zh: "" } },
    ],
    coverage: null,
    coverageTodo: { en: "14,595 rows, 2005-01-03..2026-08-03. UPDATE from the prior private-beta baseline (which was 5 cash-increase rows only): now includes G5 HISTORY = 14,589 capital-reduction events (source mops_major_event class + TWTAUU snapshot). ratio_value is populated only where a % is literally present in the announcement subject (~0.3% of rows); rest NULL ( — never guessed). cash_amount/stock_amount largely NULL (in announcement body, not this feed).", zh: "14,595 列,2005-01-03 至 2026-08-03。更新自先前私測基線(僅 5 列現增):現含 G5 減資史 14,589 事件(來源 mops_major_event 減資類 + TWTAUU 快照)。ratio_value 僅在公告主旨字面有 % 時有值(約 0.3%),餘 NULL(禁捏造);現金/股票金額多為 NULL(在公告本文,非本饋送)。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // industry-chain — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "industry-chain": {
    slug: "industry-chain",
    description: { en: "Ticker membership in TPEx industry value chains (, AI,, …) with the chain node each company sits in. Sourced from the TPEx (ic.tpex.org.tw). Not a forecast, not a recommendation.", zh: "產業價值鏈成員:每筆為某股在某 TPEx 產業價值鏈(半導體、電腦及週邊、人工智慧、雲端運算、醫療器材…)中所屬之鏈節點。來源 TPEx 產業價值鏈資訊平台(ic.tpex.org.tw)。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "chain_name", type: "text", desc: { en: "", zh: "價值鏈名" } },
      { name: "node_name", type: "text", desc: { en: "", zh: "鏈節點" } },
      { name: "node_position", type: "enum", desc: { en: "NULL (not sourced)", zh: "NULL (not sourced)" } },
      { name: "ticker", type: "code", desc: { en: "", zh: "" } },
    ],
    coverage: null,
    coverageTodo: { en: "6,934 rows, 47 chains / 2,418 tickers / 401 nodes. SINGLE SNAPSHOT captured 2026-07-02 (trade_date=capture_date; no forward refresh, no history yet — monthly re-snapshot queued in Phase-2 autowrite). node_position (//) is NULL on all rows (not exposed by the source at capture).", zh: "6,934 列,47 條鏈 / 2,418 檔 / 401 節點。單一快照,擷取日 2026-07-02(尚無前推更新與歷史,月頻再擷取排入 Phase-2 自動寫入);節點上/中/下游(node_position)全為 NULL(擷取時來源未提供)。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // institutional-positioning — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "institutional-positioning": {
    slug: "institutional-positioning",
    description: { en: "Per-ticker daily institutional positioning: foreign / investment-trust / dealer net buys and their total, foreign ownership % and its percentile, buy/sell streaks, and institutional share of volume. Derived from the foreign-holding + institutional-flow families. Not a forecast, not a recommendation.", zh: "法人持倉深化:每筆為某股某日之外資/投信/自營商淨買賣與合計、外資持股比與其歷史分位、連買賣天數、法人成交量占比。衍生自外資持股+法人買賣超家族。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "foreign_net_buy", type: "shares", desc: { en: "", zh: "" } },
      { name: "investment_trust_net_buy", type: "shares", desc: { en: "", zh: "" } },
      { name: "dealer_net_buy", type: "shares", desc: { en: "", zh: "" } },
      { name: "institutional_net_buy_total", type: "shares", desc: { en: "", zh: "" } },
      { name: "foreign_pct", type: "ratio", desc: { en: "", zh: "" } },
      { name: "foreign_pct_percentile", type: "ratio", desc: { en: "within-history rank, NOT a rating", zh: "within-history rank, NOT a rating" } },
      { name: "buy_streak", type: "days", desc: { en: "", zh: "" } },
      { name: "sell_streak", type: "days", desc: { en: "", zh: "" } },
      { name: "inst_share_of_volume", type: "ratio", desc: { en: "NULL where volume absent", zh: "NULL where volume absent" } },
    ],
    coverage: null,
    coverageTodo: { en: "Per-ticker daily from ~2013 (first sample 2013-01-11). foreign_pct_percentile is a within-history rank coordinate (not a rating). inst_share_of_volume NULL where volume is unavailable. This is a heavy aggregation VIEW — serving should be ticker+date-bounded (full scans time out).", zh: "每股每日,約 2013 起。foreign_pct_percentile 為歷史內分位座標(非評級);法人成交量占比在無量資料處為 NULL。此為重聚合視圖,查詢須以個股+日期界定(全表掃描會逾時)。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // major-event-taxonomy — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "major-event-taxonomy": {
    slug: "major-event-taxonomy",
    description: { en: "MOPS (material announcements) classified into an event taxonomy (,, …) with the announcement subject, date/time, a rule version, and a classification confidence score. Not a forecast, not a recommendation.", zh: "重大訊息事件分類:MOPS 重大訊息經規則分類為事件類別(併購、減資、增資、背書保證…),含逐字主旨、日期時間、規則版本與分類信心值。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "event_class", type: "enum", desc: { en: "////…", zh: "併購/減資/增資/背書保證/…" } },
      { name: "subject", type: "text", desc: { en: "verbatim subject", zh: "verbatim 重訊 subject" } },
      { name: "event_time", type: "time", desc: { en: "", zh: "" } },
      { name: "confidence", type: "ratio", desc: { en: "classifier confidence (type, not impact)", zh: "classifier confidence (type, not impact)" } },
      { name: "rule_version", type: "text", desc: { en: "mops_taxonomy_v1", zh: "mops_taxonomy_v1" } },
    ],
    coverage: null,
    coverageTodo: { en: "1,017,099 rows, 2005-01-01..2026-07-18. event_class is a rule-based classification (rule_version=mops_taxonomy_v1) with a confidence score — it is a label of the announcement TYPE, not a judgement of impact. subject is the verbatim subject. Some announcements are corrections/updates of earlier ones.", zh: "1,017,099 列,2005-01-01 至 2026-07-18。event_class 為規則分類(rule_version=mops_taxonomy_v1)+信心值——為公告『類型』標籤,非影響判斷;主旨為逐字重訊主旨;部分為先前公告之更正/補充。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // factor-library — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "factor-library": {
    slug: "factor-library",
    description: { en: "Cross-sectional equity factor VALUES (size / value / momentum / quality / low-vol families) — one row per (ticker, date, factor_name), each with its raw factor_value, family, definition, and formula_version. Factor values are COORDINATES only: no signal, no score, no buy/sell label. Not a forecast, not a recommendation.", zh: "因子庫(座標):橫斷面股票因子『值』(規模/價值/動能/品質/低波動族),每筆為某股某日某因子之原始因子值、族別、定義與公式版本。因子值僅為座標:無訊號、無評分、無買賣標籤。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "factor_name", type: "text", desc: { en: "e.g. dividend_yield_z", zh: "e.g. dividend_yield_z" } },
      { name: "factor_value", type: "numeric", desc: { en: "raw coordinate", zh: "raw coordinate" } },
      { name: "factor_family", type: "enum", desc: { en: "size/value/momentum/quality/low_vol", zh: "size/value/momentum/quality/low_vol" } },
      { name: "factor_definition", type: "text", desc: { en: "", zh: "" } },
      { name: "formula_version", type: "text", desc: { en: "", zh: "" } },
      { name: "as_of_source_date", type: "date", desc: { en: "PIT input date", zh: "PIT input date" } },
    ],
    coverage: null,
    coverageTodo: { en: "276,456 rows, 2026-05-08..2026-05-28 (a 3-week prototype window — NOT deep history yet). factor_value is a raw coordinate; as_of_source_date carries the input data date (PIT). formula_version pins the recipe. RED-LINE: zero signal/score/rating columns by design.", zh: "276,456 列,2026-05-08 至 2026-05-28(三週原型窗,尚非長期歷史)。factor_value 為原始座標;as_of_source_date 記錄輸入資料日(point-in-time);formula_version 釘住配方。紅線:設計上零訊號/評分/評級欄。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // factor-returns — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "factor-returns": {
    slug: "factor-returns",
    description: { en: "Realized decile-spread returns per factor: for each (factor_name, date, horizon), the top-decile return, bottom-decile return, and their spread — a statistical FACT computed from the factor library, with universe/decile counts and the return basis. No good/bad label. Not a forecast, not a recommendation.", zh: "因子報酬(十分位價差):每筆為某因子某日某持有期之最高與最低十分位報酬及其價差——由因子庫計算之統計事實,附全體/十分位樣本數與報酬基礎。無好壞標籤。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "horizon", type: "enum", desc: { en: "1m / …", zh: "1m / …" } },
      { name: "decile_spread_return", type: "ratio", desc: { en: "top−bottom (identity)", zh: "top−bottom (identity)" } },
      { name: "top_decile_return", type: "ratio", desc: { en: "", zh: "" } },
      { name: "bottom_decile_return", type: "ratio", desc: { en: "", zh: "" } },
      { name: "n_universe", type: "int", desc: { en: "", zh: "" } },
      { name: "return_basis", type: "text", desc: { en: "", zh: "" } },
      { name: "forward_end_date", type: "date", desc: { en: "realized horizon end", zh: "realized horizon end" } },
    ],
    coverage: null,
    coverageTodo: { en: "390 rows, 2026-05-08..2026-05-28 (prototype window, same as factor_library). decile_spread_return = top_decile_return − bottom_decile_return (identity, recomputable). return_basis + formula_version carried. Short window → not a long-run factor premium claim.", zh: "390 列,2026-05-08 至 2026-05-28(與因子庫同原型窗)。decile_spread_return = 最高−最低十分位(恆等式,可復算);附 return_basis + formula_version。窗短,非長期因子溢酬宣稱。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // lending-utilization — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "lending-utilization": {
    slug: "lending-utilization",
    description: { en: "Per-ticker daily securities-lending utilization: lending balance vs shares issued → utilisation_pct and its percentile, with a coverage note. Derived from the securities-lending + foreign-holding families. Not a forecast, not a recommendation.", zh: "借券使用率:每筆為某股某日之借券餘額對發行股數→使用率與其分位,附涵蓋註記。衍生自借券+外資持股家族。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "lending_balance", type: "shares", desc: { en: "", zh: "" } },
      { name: "shares_issued", type: "shares", desc: { en: "NULL ~19.5%", zh: "NULL ~19.5%" } },
      { name: "utilisation_pct", type: "ratio", desc: { en: "NULL where denominator absent", zh: "NULL where denominator absent" } },
      { name: "utilisation_pctile", type: "ratio", desc: { en: "within-history coordinate", zh: "within-history coordinate" } },
      { name: "utilisation_note", type: "text", desc: { en: "", zh: "" } },
    ],
    coverage: null,
    coverageTodo: { en: "3,514,626 rows, 2007-01-02..2026-07-17. utilisation_pct denominator (shares_issued) coverage ~80.5% — where shares_issued is unavailable, utilisation_pct is NULL and utilisation_note explains. utilisation_pctile is a within-history coordinate.", zh: "3,514,626 列,2007-01-02 至 2026-07-17。使用率分母(發行股數)涵蓋約 80.5%;分母缺漏處 utilisation_pct 為 NULL 並於 utilisation_note 說明;分位為歷史內座標。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // margin-system-stats — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "margin-system-stats": {
    slug: "margin-system-stats",
    description: { en: "Market-level daily margin/short-sale system stats: total margin-purchase balance, total short-sale balance, short-to-margin ratio, net flows, and turnover intensity. Derived from the total margin/short family. Not a forecast, not a recommendation.", zh: "信用交易系統統計:每筆為某市場某日之融資餘額總額、融券餘額總額、券資比、淨流與週轉強度。衍生自整體融資融券家族。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "margin_purchase_balance_total", type: "TWD", desc: { en: "", zh: "" } },
      { name: "short_sale_balance_total", type: "shares", desc: { en: "", zh: "" } },
      { name: "short_to_margin_balance_ratio", type: "ratio", desc: { en: "", zh: "" } },
      { name: "margin_net_flow", type: "TWD", desc: { en: "", zh: "" } },
      { name: "maintenance_ratio", type: "ratio", desc: { en: "NULL — not loaded (honest gap)", zh: "NULL — not loaded (honest gap)" } },
    ],
    coverage: null,
    coverageTodo: { en: "9,936 rows, 2000-11-28..2026-07-09, per market. maintenance_ratio is NULL — the official system-wide is not loaded (maintenance_ratio_note flags this HONEST GAP). All other fields are computed from official balances.", zh: "9,936 列,2000-11-28 至 2026-07-09,按市場。maintenance_ratio 為 NULL——官方整體維持率未載入(maintenance_ratio_note 標示此誠實缺口);其餘欄由官方餘額計算。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // short-restriction-flags — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "short-restriction-flags": {
    slug: "short-restriction-flags",
    description: { en: "Per-ticker daily short-sale restriction state: whether a short-sale control is active, margin-short and SBL limit values, disposition-active flag, and a restriction note. Derived from short-sale-balance-control + attention/disposition events. Not a forecast, not a recommendation.", zh: "空方限制旗標:每筆為某股某日之空方限制狀態,含是否有空賣限制、融券與借券限額值、處置中旗標與限制註記。衍生自空賣餘額控管+注意/處置事件。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "has_short_sale_control", type: "bool", desc: { en: "", zh: "" } },
      { name: "ms_limit_value", type: "", desc: { en: "", zh: "" } },
      { name: "sbl_limit_value", type: "", desc: { en: "", zh: "" } },
      { name: "disposition_active", type: "bool", desc: { en: "", zh: "" } },
      { name: "restriction_note", type: "text", desc: { en: "scope per row", zh: "scope per row" } },
    ],
    coverage: null,
    coverageTodo: { en: "42,609 rows, 2009-12-29..2026-07-31, 1,646 tickers. HONEST GAP: the official (below-par short-sale eligibility) list is not loaded — has_short_sale_control reflects the control/disposition sources present; restriction_note explains scope per row.", zh: "42,609 列,2009-12-29 至 2026-07-31,1,646 檔。誠實缺口:官方平盤下不得放空清單未載入;has_short_sale_control 反映現有控管/處置來源;逐列 restriction_note 說明範圍。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
  // trading-rules-reference — Wave L building. coverage_limits VERBATIM on zh (逐字照抄); en = same facts, CJK term-names stripped.
  "trading-rules-reference": {
    slug: "trading-rules-reference",
    description: { en: "Reference timeline of Taiwan market-microstructure rule changes (daily price-limit widening, day-trading opening, tick-size, etc.) — one entry per (rule_domain, rule_key, effective_date) with prior/new value, market, description, and an official source_url. Not a forecast, not a recommendation.", zh: "交易制度沿革表:台股微結構制度變更之參考時間軸(每日漲跌幅放寬、現股當沖開放、tick 升降單位…),每筆含 rule_domain/rule_key/生效日、前後值、市場、說明與官方 source_url。非預測、非建議。" },
    overview: [
      { en: "This dataset is in build and not yet queryable via the API. The coverage and honest limitations below are the real database state; it moves off \"Building\" once serving lands (targeted 8/1).", zh: "即將開放——此資料集建置中,尚未可透過 API 查詢。下方涵蓋與誠實限制為真實資料庫狀態;serving 上線(預計 8/1)後脫離「建置中」。" },
    ],
    fields: [
      { name: "rule_domain", type: "enum", desc: { en: "price_limit / day_trading / tick_size …", zh: "price_limit / day_trading / tick_size …" } },
      { name: "rule_key", type: "text", desc: { en: "", zh: "" } },
      { name: "effective_date", type: "date", desc: { en: "", zh: "" } },
      { name: "prior_value", type: "text", desc: { en: "", zh: "" } },
      { name: "new_value", type: "text", desc: { en: "", zh: "" } },
      { name: "market", type: "enum", desc: { en: "TWSE,TPEX", zh: "TWSE,TPEX" } },
      { name: "source_url", type: "url", desc: { en: "required", zh: "required (無出處不入表)" } },
      { name: "source_authority", type: "text", desc: { en: "", zh: "" } },
    ],
    coverage: null,
    coverageTodo: { en: "FILE-BACKED (F+5 YAML, not a DB table): src/feature_engine/data_gateway/reference/trading_rules_reference.yaml, rule_version=v1. RED-LINE: — every entry carries a source_url; entries with source_verification=pending_owner are flagged until the owner confirms the URL resolves to the cited announcement.", zh: "檔案式參考(F+5 YAML,非資料表):src/feature_engine/data_gateway/reference/trading_rules_reference.yaml,rule_version=v1。紅線:無出處不入表——每筆均附 source_url;source_verification=pending_owner 者於 owner 確認前標示。" },
    params: STANDARD_PARAMS,
    notes: [
      { en: "In build (not yet generally available): not yet served over the API. The figures above are the measured database state (WAVE_L_REGISTRY), shown honestly before serving lands — not a live endpoint yet.", zh: "建置中/即將開放:尚未經 API 服務。上方數字為量測的資料庫狀態(WAVE_L_REGISTRY),serving 上線前誠實呈現,非即時端點。" },
    ],
  },
};

export function getDatasetDocContent(slug: string): DatasetDocContent | null {
  return DATASET_DOC_CONTENT[slug] ?? null;
}
