import type { AppLocale } from "@/src/i18n/locales";

// Projected (single-locale) shape consumed by pages/components. Field names are locale-agnostic;
// the selector fills them from either the zh source fields or the parallel *_en fields.
export type DatasetSeoEntry = {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  shortDescription: string;
  whatItIs: string;
  useCases: string[];
  whyItMatters: string;
  coverageNote: string;
  freshnessNote: string;
  sourcePolicyNote: string;
  docsHref: string;
  pricingHref: string;
  keywords: string[];
  jsonLdName: string;
  jsonLdDescription: string;
  sourceRole: string;
  provider: string;
  marketScope: "TWSE" | "TWSE_TPEX";
};

// Bilingual source record (spec §1.6): both languages live on the record; a selector projects the
// locale at render time. Non-prose fields (slug/hrefs/sourceRole/provider/marketScope) are shared.
// ANTI-FABRICATION (CLAUDE.md 鐵律 2 / spec §2): every *_en field mirrors the zh facts EXACTLY —
// same coverage windows, row counts, dates, tickers, and hedging. Translation adds tone, not facts.
export type DatasetSeoEntrySource = DatasetSeoEntry & {
  nameEn: string;
  seoTitleEn: string;
  seoDescriptionEn: string;
  shortDescriptionEn: string;
  whatItIsEn: string;
  useCasesEn: string[];
  whyItMattersEn: string;
  coverageNoteEn: string;
  freshnessNoteEn: string;
  sourcePolicyNoteEn: string;
  jsonLdNameEn: string;
  jsonLdDescriptionEn: string;
  keywordsEn: string[];
};

export const datasetSeoEntries: readonly DatasetSeoEntrySource[] = [
  {
    slug: "twse-daily-price",
    name: "TWSE 日線價格",
    nameEn: "TWSE Daily Prices",
    seoTitle: "TWSE 日線價格資料集 | TW Market Data",
    seoTitleEn: "TWSE Daily Prices Dataset | TW Market Data",
    seoDescription:
      "TWSE 日線價格資料集提供台股上市股票每日開高低收、成交量與成交金額，可用於回測、波動分析與技術指標計算。",
    seoDescriptionEn:
      "The TWSE Daily Prices dataset provides daily open/high/low/close, volume, and turnover for TWSE-listed Taiwan stocks — for backtesting, volatility analysis, and technical-indicator calculation.",
    shortDescription: "上市股票每日開高低收、成交量與成交金額的基礎價格資料。",
    shortDescriptionEn:
      "Foundational price data: daily open/high/low/close, volume, and turnover for TWSE-listed stocks.",
    whatItIs:
      "此資料集聚焦上市公司（TWSE）日線市場資料，包含 OHLCV 與成交金額，適合建立一致的台股價格分析基礎。",
    whatItIsEn:
      "This dataset focuses on daily market data for TWSE-listed companies, including OHLCV and turnover, as a consistent foundation for Taiwan-stock price analysis.",
    useCases: [
      "計算報酬率、波動率與區間價格變化",
      "建立回測資料底層與技術指標輸入",
      "提供 AI agent 研究流程中的價格證據層",
    ],
    useCasesEn: [
      "Compute returns, volatility, and range-based price changes",
      "Build the data layer for backtests and technical-indicator inputs",
      "Provide the price evidence layer in AI agent research workflows",
    ],
    whyItMatters:
      "價格資料是股票研究的共同底座。若沒有穩定且可追溯的日線資料，後續估值、風險與策略比較都難以重現。",
    whyItMattersEn:
      "Price data is the common foundation of equity research. Without stable, traceable daily data, downstream valuation, risk, and strategy comparisons are hard to reproduce.",
    coverageNote:
      "覆蓋範圍會依資料來源揭露與產品化進度持續維護，實際可用範圍請以 API 文件與 data_gaps 訊號為準。",
    coverageNoteEn:
      "Coverage is maintained continuously as source disclosures and productization progress; treat the API docs and data_gaps signals as the source of truth for what is actually available.",
    freshnessNote: "更新頻率與延遲會依官方來源節奏標示，請在使用前確認 freshness 狀態。",
    freshnessNoteEn:
      "Update cadence and latency are labeled according to the official source's rhythm; confirm the freshness status before use.",
    sourcePolicyNote:
      "採 official/public-first 原則；欄位來源與 lineage 以可追溯方式提供，不以推測資料補齊缺口。",
    sourcePolicyNoteEn:
      "Follows an official/public-first policy; field provenance and lineage are provided traceably, and gaps are not filled with inferred data.",
    docsHref: "/docs/api/market-prices/twse-daily-price",
    pricingHref: "/pricing",
    keywords: ["台股日線資料 API", "TWSE", "OHLCV", "market data"],
    keywordsEn: ["Taiwan daily price data API", "TWSE", "OHLCV", "market data"],
    jsonLdName: "TWSE 日線價格資料集",
    jsonLdNameEn: "TWSE Daily Prices Dataset",
    jsonLdDescription: "台股上市股票日線價格與成交資料，支援研究、回測與 API workflow。",
    jsonLdDescriptionEn:
      "Daily price and trading data for TWSE-listed Taiwan stocks, supporting research, backtesting, and API workflows.",
    sourceRole: "official_twse_daily_price",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "factor-library",
    name: "因子庫(座標)",
    nameEn: "Factor Library",
    seoTitle: "因子庫資料集(size / value / momentum / quality / low-vol)| TW Market Data",
    seoTitleEn: "Factor Library Dataset (size / value / momentum / quality / low-vol) | TW Market Data",
    seoDescription:
      "因子庫資料集提供台股橫斷面因子「數值座標」——size / value / momentum / quality / low-vol 家族,每列一個 (ticker, date, factor_name),附 factor_value、定義與公式版本。純座標,不含訊號、評分或買賣標籤;point-in-time 安全。",
    seoDescriptionEn:
      "The Factor Library dataset provides cross-sectional factor VALUE coordinates for Taiwan equities — size / value / momentum / quality / low-vol families — one row per (ticker, date, factor_name) with its factor_value, definition, and formula version. Coordinates only: no signal, score, or buy/sell label; point-in-time safe.",
    shortDescription: "台股橫斷面因子數值座標(五大家族),每列附定義與公式版本,純座標無訊號。",
    shortDescriptionEn:
      "Cross-sectional factor value coordinates for Taiwan equities (five families), each with definition and formula version — coordinates only, no signal.",
    whatItIs:
      "因子庫資料集每一列對應「一檔證券、一個交易日、一個因子」,欄位包含 factor_value(原始座標值)、factor_family(size / value / momentum / quality / low_vol)、factor_definition 與 formula_version,並以 as_of_source_date 標明 point-in-time 輸入日。因子值僅為【座標】——不含訊號、評分或買賣標籤;以 trade_date 為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one security, one trading day, one factor, carrying factor_value (the raw coordinate), factor_family (size / value / momentum / quality / low_vol), factor_definition, and formula_version, with as_of_source_date marking the point-in-time input date. Factor values are COORDINATES only — no signal, score, or buy/sell label. Keyed on trade_date and point-in-time safe.",
    useCases: [
      "以一致定義的因子座標建構橫斷面選股與因子模型。",
      "對齊 formula_version 與 as_of_source_date,做可重現、無未來函數的回測。",
      "結合因子報酬(factor-returns)評估各因子的歷史十分位價差。",
    ],
    useCasesEn: [
      "Build cross-sectional stock selection and factor models on consistently defined coordinates.",
      "Align formula_version and as_of_source_date for reproducible, look-ahead-free backtests.",
      "Pair with Factor Returns to assess each factor's historical decile spread.",
    ],
    whyItMatters:
      "自建因子容易在定義、口徑與 point-in-time 對齊上分歧;直接取用附定義、公式版本與輸入日的座標,可確保跨研究一致且無未來函數。",
    whyItMattersEn:
      "Home-grown factors drift in definition, convention, and point-in-time alignment; taking coordinates that carry their definition, formula version, and input date keeps research consistent and look-ahead-free.",
    coverageNote:
      "逐檔逐日逐因子,涵蓋 size / value / momentum / quality / low-vol 家族;每列附 factor_definition、formula_version 與 as_of_source_date。以 trade_date 為知識時間,point-in-time 安全。",
    coverageNoteEn:
      "Per ticker, per trading day, per factor, across the size / value / momentum / quality / low-vol families; every row carries factor_definition, formula_version, and as_of_source_date. Keyed on trade_date, point-in-time safe.",
    freshnessNote: "日頻,隨橫斷面輸入更新。",
    freshnessNoteEn: "Daily, updated with the cross-sectional inputs.",
    sourcePolicyNote:
      "由 TWSE / TPEx / MOPS 官方來源衍生;因子值為座標,非訊號、非投資建議。",
    sourcePolicyNoteEn:
      "Derived from official TWSE / TPEx / MOPS sources; factor values are coordinates, not signals, not investment advice.",
    docsHref: "/docs/api/structure-reference/factor-library",
    pricingHref: "/pricing",
    keywords: ["因子庫", "選股因子", "value momentum quality", "橫斷面因子", "台股 quant"],
    keywordsEn: ["factor library", "equity factors", "value momentum quality low-vol", "cross-sectional factors", "Taiwan quant"],
    jsonLdName: "因子庫資料集",
    jsonLdNameEn: "Factor Library Dataset",
    jsonLdDescription: "台股橫斷面因子數值座標(size/value/momentum/quality/low-vol),附定義與公式版本,point-in-time 安全。",
    jsonLdDescriptionEn:
      "Cross-sectional factor value coordinates for Taiwan equities (size/value/momentum/quality/low-vol), with definitions and formula versions, point-in-time safe.",
    sourceRole: "derived_factor_library",
    provider: "twse_official",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "monthly-revenue",
    name: "月營收",
    nameEn: "Monthly Revenue",
    seoTitle: "台股月營收資料集 | TW Market Data",
    seoTitleEn: "Taiwan Monthly Revenue Dataset | TW Market Data",
    seoDescription:
      "台股月營收資料集整理上市公司每月營業收入，可用於追蹤 YoY/MoM、營運趨勢與基本面研究流程。",
    seoDescriptionEn:
      "The Taiwan monthly revenue dataset organizes monthly operating revenue for listed companies — for tracking YoY/MoM, operating trends, and fundamental research workflows.",
    shortDescription: "整理公司每月公告營業收入的結構化資料集。",
    shortDescriptionEn: "A structured dataset of companies' monthly reported operating revenue.",
    whatItIs:
      "此資料集聚焦公司每月營收公告，提供跨公司、跨期間可查詢的營收資料，用於建立基本面時間序列。",
    whatItIsEn:
      "This dataset focuses on companies' monthly revenue announcements, providing queryable revenue data across companies and periods to build fundamental time series.",
    useCases: [
      "追蹤營收年增率（YoY）與月增率（MoM）",
      "比較產業或同業營運趨勢",
      "作為研究流程中的即時基本面訊號",
    ],
    useCasesEn: [
      "Track revenue year-over-year (YoY) and month-over-month (MoM)",
      "Compare operating trends across industries or peers",
      "Serve as a timely fundamental signal in research workflows",
    ],
    whyItMatters:
      "月營收是台股最早可取得的營運指標之一，能在季度財報前先提供公司成長與變化的訊號。",
    whyItMattersEn:
      "Monthly revenue is one of the earliest available operating indicators for Taiwan stocks, signaling company growth and change ahead of quarterly financial reports.",
    coverageNote:
      "覆蓋範圍會依公開來源可得性與資料品質逐步擴展，不代表所有標的在所有月份皆完整。",
    coverageNoteEn:
      "Coverage expands gradually as public-source availability and data quality allow; it does not imply every symbol is complete for every month.",
    freshnessNote: "更新時間請以 API 文件與回應中的 freshness/data_gaps 訊號判讀。",
    freshnessNoteEn:
      "Determine update timing from the API docs and the freshness/data_gaps signals in the response.",
    sourcePolicyNote:
      "以官方/公開揭露來源為主，欄位標準化後提供查詢，缺漏會保留為可觀測 data_gaps。",
    sourcePolicyNoteEn:
      "Primarily official/public disclosure sources; fields are standardized for querying, and gaps are preserved as observable data_gaps.",
    docsHref: "/docs/api/financial-growth/monthly-revenue",
    pricingHref: "/pricing",
    keywords: ["台股月營收 API", "營收年增率", "基本面資料"],
    keywordsEn: ["Taiwan monthly revenue API", "revenue YoY growth", "fundamental data"],
    jsonLdName: "月營收資料集",
    jsonLdNameEn: "Monthly Revenue Dataset",
    jsonLdDescription: "台股公司月營收資料，適用於成長追蹤與基本面分析。",
    jsonLdDescriptionEn:
      "Monthly revenue data for Taiwan companies, suitable for growth tracking and fundamental analysis.",
    sourceRole: "official_monthly_revenue",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "factor-returns",
    name: "因子報酬(十分位價差)",
    nameEn: "Factor Returns (decile spread)",
    seoTitle: "因子報酬資料集(十分位價差)| TW Market Data",
    seoTitleEn: "Factor Returns Dataset (decile spread) | TW Market Data",
    seoDescription:
      "因子報酬資料集提供台股各因子的已實現十分位價差報酬——每列一個 (factor_name, date, horizon),含最高十分位報酬、最低十分位報酬與其價差,以及 universe 家數與報酬口徑。純統計事實,不含好壞標籤;point-in-time 安全。",
    seoDescriptionEn:
      "The Factor Returns dataset provides realized decile-spread returns per factor for Taiwan equities — one row per (factor_name, date, horizon) with the top-decile return, bottom-decile return, and their spread, plus the universe count and return basis. A statistical fact, no good/bad label; point-in-time safe.",
    shortDescription: "各因子已實現十分位價差報酬(top−bottom),附 universe 家數與報酬口徑,純統計事實。",
    shortDescriptionEn:
      "Realized decile-spread (top−bottom) returns per factor, with universe count and return basis — a statistical fact.",
    whatItIs:
      "因子報酬資料集每一列對應「一個因子、一個交易日、一個持有期(horizon)」,欄位包含 decile_spread_return(最高−最低十分位,恆等式)、top_decile_return、bottom_decile_return、n_universe(母體家數)、return_basis(報酬口徑)與 forward_end_date(已實現持有期結束日)。此為由因子庫計算的【已實現統計事實】,不含好壞或買賣標籤;以 trade_date 為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one factor, one trading day, one horizon, carrying decile_spread_return (top minus bottom decile, an identity), top_decile_return, bottom_decile_return, n_universe (universe size), return_basis, and forward_end_date (the realized horizon end). It is a REALIZED statistical fact computed from the factor library — no good/bad or buy/sell label. Keyed on trade_date and point-in-time safe.",
    useCases: [
      "評估各因子在不同持有期的歷史十分位價差表現。",
      "以 n_universe 與 return_basis 檢視樣本廣度與報酬口徑,做穩健比較。",
      "結合因子庫(factor-library)座標,回溯因子暴露到已實現報酬的關聯。",
    ],
    useCasesEn: [
      "Assess each factor's historical decile-spread behaviour across horizons.",
      "Check breadth and return basis via n_universe and return_basis for robust comparison.",
      "Trace factor exposure (Factor Library) to realized returns.",
    ],
    whyItMatters:
      "自算因子報酬容易在十分位切法、母體與報酬口徑上不一致;直接取用附 universe 與口徑的已實現價差,可做跨因子、跨期的可比較評估,且無未來函數。",
    whyItMattersEn:
      "Computing factor returns yourself invites inconsistency in decile cuts, universe, and return basis; taking realized spreads that carry universe and basis enables comparable cross-factor, cross-horizon evaluation, look-ahead-free.",
    coverageNote:
      "逐因子逐日逐持有期,涵蓋因子庫所定義的因子;每列附 n_universe、return_basis 與 forward_end_date。以 trade_date 為知識時間,point-in-time 安全。",
    coverageNoteEn:
      "Per factor, per trading day, per horizon, across the factors defined in the Factor Library; every row carries n_universe, return_basis, and forward_end_date. Keyed on trade_date, point-in-time safe.",
    freshnessNote: "日頻,隨已實現持有期更新。",
    freshnessNoteEn: "Daily, updated as horizons realize.",
    sourcePolicyNote:
      "由 TWSE / TPEx / MOPS 官方來源經因子庫計算;為統計事實,非訊號、非投資建議。",
    sourcePolicyNoteEn:
      "Computed from the Factor Library over official TWSE / TPEx / MOPS sources; a statistical fact, not a signal, not investment advice.",
    docsHref: "/docs/api/structure-reference/factor-returns",
    pricingHref: "/pricing",
    keywords: ["因子報酬", "十分位價差", "decile spread", "因子績效", "台股 quant"],
    keywordsEn: ["factor returns", "decile spread", "top minus bottom", "factor performance", "Taiwan quant"],
    jsonLdName: "因子報酬資料集",
    jsonLdNameEn: "Factor Returns Dataset",
    jsonLdDescription: "台股各因子已實現十分位價差報酬,附 universe 與報酬口徑,point-in-time 安全。",
    jsonLdDescriptionEn:
      "Realized decile-spread returns per factor for Taiwan equities, with universe and return basis, point-in-time safe.",
    sourceRole: "derived_factor_returns",
    provider: "twse_official",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "income-statement",
    name: "損益表",
    nameEn: "Income Statement",
    seoTitle: "台股損益表資料集 | TW Market Data",
    seoTitleEn: "Taiwan Income Statement Dataset | TW Market Data",
    seoDescription:
      "台股損益表資料集提供營收、毛利、營業利益、稅後淨利與 EPS，支援獲利能力與估值研究。",
    seoDescriptionEn:
      "The Taiwan income statement dataset provides revenue, gross profit, operating income, net income after tax, and EPS — supporting profitability and valuation research.",
    shortDescription: "季度損益表欄位的標準化資料集。",
    shortDescriptionEn: "A standardized dataset of quarterly income-statement fields.",
    whatItIs:
      "此資料集提供公司季度損益表核心欄位，支援跨期間比較與獲利結構分析。",
    whatItIsEn:
      "This dataset provides companies' core quarterly income-statement fields, supporting cross-period comparison and profitability-structure analysis.",
    useCases: [
      "分析毛利率、營益率與獲利波動",
      "追蹤 EPS 與淨利變化",
      "作為估值模型與研究報告的基本面輸入",
    ],
    useCasesEn: [
      "Analyze gross margin, operating margin, and earnings volatility",
      "Track changes in EPS and net income",
      "Serve as a fundamental input for valuation models and research reports",
    ],
    whyItMatters:
      "損益表反映公司是否具備可持續獲利能力，是中長期基本面判斷與估值分析的核心來源。",
    whyItMattersEn:
      "The income statement reflects whether a company has sustainable earning power, and is a core source for medium- to long-term fundamental judgment and valuation analysis.",
    coverageNote:
      "不同公司與期間可能存在揭露差異，請以欄位可用性與 data_gaps 訊號確認可用範圍。",
    coverageNoteEn:
      "Disclosure may differ across companies and periods; confirm the available range from field availability and data_gaps signals.",
    freshnessNote: "財報更新節奏受官方揭露時點影響，請先核對最新可用季度。",
    freshnessNoteEn:
      "Financial-report update cadence depends on official disclosure timing; check the latest available quarter first.",
    sourcePolicyNote:
      "遵循 official/public-first 與欄位契約原則，不以未驗證來源補值。",
    sourcePolicyNoteEn:
      "Follows official/public-first and field-contract principles; values are not filled from unverified sources.",
    docsHref: "/docs/api/financial-growth/income-statement",
    pricingHref: "/pricing",
    keywords: ["台股損益表 API", "EPS", "財報資料"],
    keywordsEn: ["Taiwan income statement API", "EPS", "financial statement data"],
    jsonLdName: "損益表資料集",
    jsonLdNameEn: "Income Statement Dataset",
    jsonLdDescription: "台股公司季度損益表資料，支援獲利能力與估值研究。",
    jsonLdDescriptionEn:
      "Quarterly income-statement data for Taiwan companies, supporting profitability and valuation research.",
    sourceRole: "official_income_statement",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "financial-metrics",
    name: "財務比率指標",
    nameEn: "Financial Metrics",
    seoTitle: "財務比率指標資料集(ROE / ROA / 毛利率 / 負債比)| TW Market Data",
    seoTitleEn: "Financial Metrics Dataset (ROE / ROA / margins / debt ratio) | TW Market Data",
    seoDescription:
      "財務比率指標資料集提供台股上市櫃公司每季 ROE / ROA、毛利率 / 營益率與負債比等比率,由財報三表衍生,一列一個 (ticker, fiscal_year, fiscal_quarter),支援品質、獲利與選股因子。以揭露日為知識時間(非 point-in-time 安全,回測需依 disclosure_date 過濾)。",
    seoDescriptionEn:
      "The Financial Metrics dataset provides quarterly ROE / ROA, gross / operating margin, and debt ratio for Taiwan listed companies, derived from the three financial statements — one row per (ticker, fiscal_year, fiscal_quarter) — for quality, profitability, and screening factors. Keyed on the disclosure date (NOT point-in-time safe; filter by disclosure_date for backtests).",
    shortDescription: "上市櫃公司每季 ROE/ROA、毛利/營益率、負債比等財務比率,由三表衍生。",
    shortDescriptionEn:
      "Quarterly ROE/ROA, gross/operating margin, and debt ratio per listed company, derived from the three statements.",
    whatItIs:
      "財務比率指標資料集每一列對應「一家公司、一個會計年度、一個會計季度」的比率,欄位包含 roe / roa(股東/資產報酬率)、gross_margin / op_margin(毛利/營益率)與 debt_ratio(負債比)等,由損益、資產負債與現金流量三表衍生。以 disclosure_date(揭露日)為知識時間——【非 point-in-time 安全】:回測務必以揭露日過濾,避免用到當時尚未公布的財報而產生未來函數。",
    whatItIsEn:
      "Each row is one company, one fiscal year, one fiscal quarter, carrying roe / roa (return on equity / assets), gross_margin / op_margin, and debt_ratio, derived from the income, balance-sheet, and cash-flow statements. Keyed on disclosure_date — NOT point-in-time safe: backtests must filter by the disclosure date so a not-yet-published report never leaks into the past (look-ahead).",
    useCases: [
      "以 ROE / 毛利率 / 負債比等比率建構品質與獲利選股因子。",
      "免自算三表比率,直接取用一致口徑的衍生指標。",
      "依 disclosure_date 過濾,確保回測不含未公布財報的未來函數。",
    ],
    useCasesEn: [
      "Build quality and profitability factors from ROE / margins / debt ratio.",
      "Skip computing ratios yourself — take consistently derived metrics.",
      "Filter by disclosure_date to keep backtests free of unpublished-report look-ahead.",
    ],
    whyItMatters:
      "財報比率的口徑與揭露時點若處理不當,極易在回測中引入未來函數;直接取用附揭露日、口徑一致的比率,可省去計算並正確對齊 point-in-time。",
    whyItMattersEn:
      "Mishandling ratio conventions and disclosure timing easily leaks look-ahead into backtests; taking consistently defined ratios stamped with their disclosure date removes that work and aligns point-in-time correctly.",
    coverageNote:
      "逐公司逐季,涵蓋上市櫃公司;由財報三表衍生。以 disclosure_date 為知識時間,非 point-in-time 安全——回測需依揭露日過濾。",
    coverageNoteEn:
      "Per company, per quarter, across listed companies; derived from the three financial statements. Keyed on disclosure_date, NOT point-in-time safe — filter by disclosure date for backtests.",
    freshnessNote: "季頻,隨財報揭露更新(有申報落差)。",
    freshnessNoteEn: "Quarterly, updated as filings are disclosed (with a reporting lag).",
    sourcePolicyNote: "由 MOPS 官方財報三表衍生;非投資建議。",
    sourcePolicyNoteEn: "Derived from official MOPS financial statements; not investment advice.",
    docsHref: "/docs/api/financials/financial-metrics",
    pricingHref: "/pricing",
    keywords: ["財務比率", "ROE", "ROA", "毛利率", "負債比", "台股基本面因子"],
    keywordsEn: ["financial metrics", "ROE", "ROA", "gross margin", "debt ratio", "Taiwan fundamental factors"],
    jsonLdName: "財務比率指標資料集",
    jsonLdNameEn: "Financial Metrics Dataset",
    jsonLdDescription: "台股上市櫃公司每季財務比率(ROE/ROA/毛利率/負債比),由三表衍生,以揭露日為知識時間。",
    jsonLdDescriptionEn:
      "Quarterly financial ratios (ROE/ROA/margins/debt ratio) for Taiwan listed companies, derived from the three statements, keyed on disclosure date.",
    sourceRole: "derived_financial_ratios",
    provider: "twse_official",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "balance-sheet",
    name: "資產負債表",
    nameEn: "Balance Sheet",
    seoTitle: "台股資產負債表資料集 | TW Market Data",
    seoTitleEn: "Taiwan Balance Sheet Dataset | TW Market Data",
    seoDescription:
      "台股資產負債表資料集提供資產、負債與股東權益欄位，可用於評估公司體質、槓桿與財務風險。",
    seoDescriptionEn:
      "The Taiwan balance sheet dataset provides asset, liability, and shareholders' equity fields — for assessing company health, leverage, and financial risk.",
    shortDescription: "公司資產、負債與股東權益結構的季度資料集。",
    shortDescriptionEn:
      "A quarterly dataset of companies' asset, liability, and shareholders' equity structure.",
    whatItIs:
      "此資料集整理公司財務結構欄位，支援公司體質檢視、資本結構分析與風險評估。",
    whatItIsEn:
      "This dataset organizes companies' financial-structure fields, supporting company-health review, capital-structure analysis, and risk assessment.",
    useCases: [
      "觀察負債比與資本結構變化",
      "比較同業財務穩健度",
      "評估現金與流動性相關風險",
    ],
    useCasesEn: [
      "Observe changes in debt ratio and capital structure",
      "Compare financial soundness across peers",
      "Assess cash- and liquidity-related risk",
    ],
    whyItMatters:
      "資產負債表可揭示企業的抗風險能力與資本壓力，是基本面風險評估不可缺少的一環。",
    whyItMattersEn:
      "The balance sheet reveals a company's resilience to risk and capital pressure, an indispensable part of fundamental risk assessment.",
    coverageNote:
      "資料覆蓋會依揭露與標準化進度調整，請以實際欄位可用性與 data_gaps 訊號為準。",
    coverageNoteEn:
      "Coverage adjusts with disclosure and standardization progress; treat actual field availability and data_gaps signals as the source of truth.",
    freshnessNote: "財務結構資料以季度更新為主，請確認目標期間是否已揭露。",
    freshnessNoteEn:
      "Financial-structure data updates mainly quarterly; confirm whether the target period has been disclosed.",
    sourcePolicyNote:
      "來源以官方揭露資料為主，欄位映射與 lineage 保持可追溯。",
    sourcePolicyNoteEn:
      "Sourced primarily from official disclosures, with field mapping and lineage kept traceable.",
    docsHref: "/docs/api/financial-growth/balance-sheet",
    pricingHref: "/pricing",
    keywords: ["台股資產負債表 API", "財務結構", "股東權益"],
    keywordsEn: ["Taiwan balance sheet API", "financial structure", "shareholders' equity"],
    jsonLdName: "資產負債表資料集",
    jsonLdNameEn: "Balance Sheet Dataset",
    jsonLdDescription: "台股公司資產負債表資料，支援財務體質與風險分析。",
    jsonLdDescriptionEn:
      "Balance-sheet data for Taiwan companies, supporting financial-health and risk analysis.",
    sourceRole: "official_balance_sheet",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "cash-flow-statement",
    name: "現金流量表",
    nameEn: "Cash Flow Statement",
    seoTitle: "台股現金流量表資料集 | TW Market Data",
    seoTitleEn: "Taiwan Cash Flow Statement Dataset | TW Market Data",
    seoDescription:
      "台股現金流量表資料集提供營業、投資與籌資現金流欄位，支援現金品質、資本配置與財務韌性研究。",
    seoDescriptionEn:
      "The Taiwan cash flow statement dataset provides operating, investing, and financing cash-flow fields — supporting cash-quality, capital-allocation, and financial-resilience research.",
    shortDescription: "公司營業、投資與籌資現金流的季度資料集。",
    shortDescriptionEn:
      "A quarterly dataset of companies' operating, investing, and financing cash flows.",
    whatItIs:
      "此資料集整理公司季度現金流量表核心欄位，支援獲利品質、現金創造能力與資本支出結構分析。",
    whatItIsEn:
      "This dataset organizes companies' core quarterly cash-flow-statement fields, supporting analysis of earnings quality, cash-generation ability, and capital-expenditure structure.",
    useCases: [
      "檢查營業現金流與淨利的一致性",
      "分析投資與籌資活動對現金部位的影響",
      "評估公司自由現金流與資本配置壓力",
    ],
    useCasesEn: [
      "Check the consistency of operating cash flow with net income",
      "Analyze how investing and financing activities affect the cash position",
      "Assess free cash flow and capital-allocation pressure",
    ],
    whyItMatters:
      "現金流量表能補足只看損益表看不到的現金品質問題，是判斷企業財務韌性與資本效率的重要來源。",
    whyItMattersEn:
      "The cash flow statement surfaces cash-quality issues invisible from the income statement alone, an important source for judging financial resilience and capital efficiency.",
    coverageNote:
      "不同公司與季度的揭露節奏可能不同，請以欄位可用性與 data_gaps 訊號判讀實際可用範圍。",
    coverageNoteEn:
      "Disclosure cadence may differ across companies and quarters; read the actual available range from field availability and data_gaps signals.",
    freshnessNote: "財報更新受官方揭露時點影響，請先確認最新可用季度。",
    freshnessNoteEn:
      "Financial-report updates depend on official disclosure timing; confirm the latest available quarter first.",
    sourcePolicyNote:
      "遵循 official/public-first 與可追溯欄位契約，不以未驗證來源補齊缺漏。",
    sourcePolicyNoteEn:
      "Follows official/public-first principles and a traceable field contract; gaps are not filled from unverified sources.",
    docsHref: "/docs/api/financial-growth/cash-flow-statement",
    pricingHref: "/pricing",
    keywords: ["台股現金流量表 API", "營業現金流", "自由現金流", "財報資料"],
    keywordsEn: [
      "Taiwan cash flow statement API",
      "operating cash flow",
      "free cash flow",
      "financial statement data",
    ],
    jsonLdName: "現金流量表資料集",
    jsonLdNameEn: "Cash Flow Statement Dataset",
    jsonLdDescription: "台股公司季度現金流量表資料，支援現金品質與財務韌性分析。",
    jsonLdDescriptionEn:
      "Quarterly cash-flow-statement data for Taiwan companies, supporting cash-quality and financial-resilience analysis.",
    sourceRole: "official_cash_flow_statement",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "institutional-flow",
    name: "三大法人買賣超",
    nameEn: "Institutional Net Buy/Sell",
    seoTitle: "三大法人買賣超資料集 | TW Market Data",
    seoTitleEn: "Institutional Net Buy/Sell Dataset | TW Market Data",
    seoDescription:
      "三大法人買賣超資料集提供外資、投信、自營商每日買賣超，支援籌碼與資金流向分析。",
    seoDescriptionEn:
      "The institutional net buy/sell dataset provides daily net buy/sell for foreign investors, investment trusts, and dealers — supporting positioning and fund-flow analysis.",
    shortDescription: "外資、投信、自營商每日買賣超的台股籌碼資料集。",
    shortDescriptionEn:
      "A Taiwan-stock positioning dataset of daily net buy/sell for foreign investors, investment trusts, and dealers.",
    whatItIs:
      "此資料集整理三大法人在台股市場的日別買賣超資料，適合做籌碼面與資金流向觀察。",
    whatItIsEn:
      "This dataset organizes daily net buy/sell data for the three major institutional investors in the Taiwan market, suited to positioning and fund-flow observation.",
    useCases: [
      "觀察外資、投信、自營商資金方向",
      "搭配價格資料分析籌碼與行情關係",
      "建立研究流程中的資金流事件訊號",
    ],
    useCasesEn: [
      "Observe the fund direction of foreign investors, investment trusts, and dealers",
      "Combine with price data to analyze the relationship between positioning and price action",
      "Build fund-flow event signals in research workflows",
    ],
    whyItMatters:
      "法人資金流向常影響短中期價格結構，可補充純價格與財報資料對市場行為的解釋能力。",
    whyItMattersEn:
      "Institutional fund flows often shape short- to medium-term price structure, adding explanatory power for market behavior beyond price and financial data alone.",
    coverageNote:
      "目前公開驗證 coverage 為 2023-06-01..2026-05-28，且僅限 TWSE-only；不宣稱 TPEx 或 full-market 完整覆蓋。",
    coverageNoteEn:
      "Publicly verified coverage is currently 2023-06-01..2026-05-28 and TWSE-only; no claim of TPEx or full-market completeness.",
    freshnessNote:
      "更新節奏與可用日期受官方來源供給影響，請以回應 metadata 與 data_gaps 為準；若看到 legacy market='TW'，不得解讀為 TPEx coverage。",
    freshnessNoteEn:
      "Update cadence and available dates depend on official-source supply; rely on the response metadata and data_gaps. A legacy market='TW' value must not be read as TPEx coverage.",
    sourcePolicyNote:
      "僅納入官方/公開來源；缺漏與來源異常會顯式標記，不以推估值補齊。",
    sourcePolicyNoteEn:
      "Includes only official/public sources; gaps and source anomalies are marked explicitly, and are not filled with estimated values.",
    docsHref: "/docs/api/capital-flow/institutional-flow",
    pricingHref: "/pricing",
    keywords: ["三大法人買賣超 API", "外資投信自營商", "台股籌碼資料"],
    keywordsEn: [
      "institutional net buy/sell API",
      "foreign investors investment trusts dealers",
      "Taiwan positioning data",
    ],
    jsonLdName: "三大法人買賣超資料集",
    jsonLdNameEn: "Institutional Net Buy/Sell Dataset",
    jsonLdDescription: "台股外資、投信、自營商每日買賣超資料，支援籌碼與資金流向研究。",
    jsonLdDescriptionEn:
      "Daily net buy/sell data for Taiwan foreign investors, investment trusts, and dealers, supporting positioning and fund-flow research.",
    sourceRole: "official_twse_t86",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "securities-lending",
    name: "借券資料",
    nameEn: "Securities Lending",
    seoTitle: "借券資料集 | TW Market Data",
    seoTitleEn: "Securities Lending Dataset | TW Market Data",
    seoDescription:
      "借券資料集提供 TWSE official TWT72U 借券餘額、借入、還券與資料缺口訊號，適合做借券供給與券源壓力研究。",
    seoDescriptionEn:
      "The securities lending dataset provides TWSE official TWT72U lending balance, borrows, returns, and data-gap signals — suited to research on lending supply and borrow-source pressure.",
    shortDescription: "TWSE-only 借券資料集，提供借券餘額、借入、還券、close price 與資料缺口訊號。",
    shortDescriptionEn:
      "A TWSE-only securities lending dataset providing lending balance, borrows, returns, close price, and data-gap signals.",
    whatItIs:
      "此資料集整理 TWSE official TWT72U 借券日資料，保留借券餘額、借入、還券、market value、來源血緣與 data_gaps，適合做券源供給與借券壓力觀察。",
    whatItIsEn:
      "This dataset organizes TWSE official TWT72U daily lending data, retaining lending balance, borrows, returns, market value, source lineage, and data_gaps — suited to observing borrow-source supply and lending pressure.",
    useCases: [
      "觀察個股借券餘額與借入/還券變化。",
      "識別可能的券源壓力與市場擁擠訊號。",
      "在研究流程中保留 source_lineage 與 known gaps 做可追溯判讀。",
    ],
    useCasesEn: [
      "Observe per-stock lending balance and borrow/return changes.",
      "Identify potential borrow-source pressure and market-crowding signals.",
      "Preserve source_lineage and known gaps for traceable interpretation in research workflows.",
    ],
    whyItMatters:
      "借券資料可補充價格、法人與信用交易之外的券源供給資訊，對觀察放空壓力、交易擁擠度與市場結構很有幫助。",
    whyItMattersEn:
      "Securities lending data adds borrow-source supply information beyond price, institutional, and margin data, helping observe short-selling pressure, trading crowdedness, and market structure.",
    coverageNote:
      "目前公開驗證 coverage 為 2020-01-02..2026-06-04，共 1,629,223 rows、1,292 檔 TWSE 標的；不宣稱 TPEx 或 full-market 覆蓋。",
    coverageNoteEn:
      "Publicly verified coverage is currently 2020-01-02..2026-06-04, totaling 1,629,223 rows across 1,292 TWSE symbols; no claim of TPEx or full-market coverage.",
    freshnessNote:
      "更新節奏與可用日期受官方來源供給影響，known source gaps 會保留在回應與文案中，不會用推估值補齊。",
    freshnessNoteEn:
      "Update cadence and available dates depend on official-source supply; known source gaps are preserved in the response and copy, and are not filled with estimated values.",
    sourcePolicyNote:
      "遵循 official-first 與 explicit lineage/data_gaps 原則；僅宣稱 TWSE-only、保留 known source gaps，不暴露 raw/full body。",
    sourcePolicyNoteEn:
      "Follows official-first and explicit lineage/data_gaps principles; claims TWSE-only, preserves known source gaps, and does not expose the raw/full body.",
    docsHref: "/docs/api/capital-flow/securities-lending",
    pricingHref: "/pricing",
    keywords: ["借券 API", "securities lending", "台股借券資料", "借券餘額"],
    keywordsEn: [
      "securities lending API",
      "securities lending",
      "Taiwan securities lending data",
      "lending balance",
    ],
    jsonLdName: "借券資料集",
    jsonLdNameEn: "Securities Lending Dataset",
    jsonLdDescription: "TWSE-only 借券資料，支援券源供給、借券壓力與市場結構研究。",
    jsonLdDescriptionEn:
      "TWSE-only securities lending data, supporting research on borrow-source supply, lending pressure, and market structure.",
    sourceRole: "official_twse_twt72u",
    provider: "twse_official",
    marketScope: "TWSE",
  },
  {
    slug: "margin-short",
    name: "融資融券",
    nameEn: "Margin Trading & Short Selling",
    seoTitle: "融資融券資料集 | TW Market Data",
    seoTitleEn: "Margin Trading & Short Selling Dataset | TW Market Data",
    seoDescription:
      "融資融券資料集提供 TWSE private beta 的信用交易欄位，涵蓋融資/融券買賣、餘額、來源血緣與 data_gaps。",
    seoDescriptionEn:
      "The margin trading & short selling dataset provides TWSE private-beta margin-credit fields, covering margin/short buys and sells, balances, source lineage, and data_gaps.",
    shortDescription: "TWSE private beta 融資融券資料集，提供信用交易餘額、買賣與資料血緣。",
    shortDescriptionEn:
      "A TWSE private-beta margin trading & short selling dataset providing margin-credit balances, buys/sells, and data lineage.",
    whatItIs:
      "此資料集聚焦 TWSE 官方優先來源的融資融券資料，適合做市場槓桿、散戶情緒與籌碼擁擠度觀察；目前仍為 private beta。",
    whatItIsEn:
      "This dataset focuses on TWSE official-first margin trading & short selling data, suited to observing market leverage, retail sentiment, and positioning crowdedness; it remains in private beta.",
    useCases: [
      "觀察融資與融券餘額的變化與壓力。",
      "與三大法人買賣超交叉分析信用交易風險。",
      "在研究流程中保留 source_lineage 與 data_gaps 做可追溯判讀。",
    ],
    useCasesEn: [
      "Observe changes and pressure in margin and short balances.",
      "Cross-analyze margin-credit risk with institutional net buy/sell.",
      "Preserve source_lineage and data_gaps for traceable interpretation in research workflows.",
    ],
    whyItMatters:
      "融資融券可補充單看價格與法人流向看不到的市場槓桿與擁擠度訊號，對短中期風險監控特別重要。",
    whyItMattersEn:
      "Margin and short data add market-leverage and crowdedness signals invisible from price and institutional flows alone, especially important for short- to medium-term risk monitoring.",
    coverageNote:
      "目前驗證 coverage 為 2026-03-10..2026-05-28，共 16,475 rows、1,272 檔 TWSE 標的；不宣稱 TPEx 或全市場覆蓋。",
    coverageNoteEn:
      "Verified coverage is currently 2026-03-10..2026-05-28, totaling 16,475 rows across 1,272 TWSE symbols; no claim of TPEx or full-market coverage.",
    freshnessNote: "目前以 private beta 方式提供，請在使用時保留 data_gaps、source_lineage 與 beta 限制說明。",
    freshnessNoteEn:
      "Currently offered as private beta; retain the data_gaps, source_lineage, and beta-limitation notes when using it.",
    sourcePolicyNote:
      "遵循 official-first 與 explicit lineage/data_gaps 原則；不暴露 raw/full body，不宣稱 securities lending 已納入同一契約。",
    sourcePolicyNoteEn:
      "Follows official-first and explicit lineage/data_gaps principles; does not expose the raw/full body and does not claim securities lending is included in the same contract.",
    docsHref: "/docs/api/capital-flow/margin-short",
    pricingHref: "/pricing",
    keywords: ["融資融券 API", "信用交易資料", "台股籌碼資料", "margin short"],
    keywordsEn: [
      "margin trading short selling API",
      "margin-credit data",
      "Taiwan positioning data",
      "margin short",
    ],
    jsonLdName: "融資融券資料集",
    jsonLdNameEn: "Margin Trading & Short Selling Dataset",
    jsonLdDescription: "TWSE private beta 融資融券資料，支援信用交易與籌碼風險研究。",
    jsonLdDescriptionEn:
      "TWSE private-beta margin trading & short selling data, supporting margin-credit and positioning-risk research.",
    sourceRole: "official_twse_mi_margn",
    provider: "twse_official",
    marketScope: "TWSE",
  },
  {
    slug: "total-margin-short",
    name: "整體融資融券",
    nameEn: "Aggregate Margin & Short",
    seoTitle: "整體融資融券資料集 | TW Market Data",
    seoTitleEn: "Aggregate Margin & Short Dataset | TW Market Data",
    seoDescription:
      "TWSE 市場層級融資融券匯總資料（Private Beta，種子資料）摘要，提供整體市場買賣與餘額視角。",
    seoDescriptionEn:
      "A summary of TWSE market-level aggregate margin & short data (private beta, seed data), providing a whole-market view of buys/sells and balances.",
    shortDescription: "TWSE private beta 台股市場總體融資融券彙總資料，含總值欄位與資料血緣。",
    shortDescriptionEn:
      "A TWSE private-beta market-wide aggregate margin & short dataset, including total-value fields and data lineage.",
    whatItIs:
      "本資料集提供 TWSE 官方優先來源的總體融資融券匯總欄位，觀察市場信用資金規模、整體槓桿與市場壓力。",
    whatItIsEn:
      "This dataset provides TWSE official-first aggregate margin & short summary fields, for observing market-wide margin-credit scale, overall leverage, and market pressure.",
    useCases: [
      "觀察市場層級融資/融券總額變化趨勢。",
      "作為籌碼風險監控的總量背景參考。",
      "在研究流程中搭配個券資料與法人資料做市場結構判讀。",
    ],
    useCasesEn: [
      "Observe trends in market-level total margin/short amounts.",
      "Serve as an aggregate backdrop for positioning-risk monitoring.",
      "Combine with per-stock and institutional data to interpret market structure in research workflows.",
    ],
    whyItMatters:
      "總量視角可避免只看個別標的而誤判市場風險，能提供更穩健的資金面背景資訊。",
    whyItMattersEn:
      "An aggregate view avoids misjudging market risk from individual symbols alone, providing more robust fund-side context.",
    coverageNote:
      "目前為 private beta seeded scope：2026-03-10、2026-04-10、2026-05-14 共 3 筆；不宣稱 full-market or TPEx 全量覆蓋。",
    coverageNoteEn:
      "Currently a private-beta seeded scope: 2026-03-10, 2026-04-10, and 2026-05-14 — 3 records in total; no claim of full-market or TPEx complete coverage.",
    freshnessNote: "目前採 private beta 種子供應，請以 API 回應中的 data_gaps 與返回範圍為判讀依據。",
    freshnessNoteEn:
      "Currently supplied as a private-beta seed; base interpretation on the data_gaps and returned range in the API response.",
    sourcePolicyNote:
      "官方來源優先，僅保留可驗證欄位；明確保留 source_lineage 與 data_gaps，不宣稱未證實的 cron 寫入。",
    sourcePolicyNoteEn:
      "Official sources first, retaining only verifiable fields; source_lineage and data_gaps are preserved explicitly, with no claim of an unproven cron write.",
    docsHref: "/docs/api/capital-flow/total-margin-short",
    pricingHref: "/pricing",
    keywords: [
      "整體融資融券 API",
      "TWSE 融資融券 匯總",
      "市場層級信貸彙總",
      "margin short total",
    ],
    keywordsEn: [
      "aggregate margin short API",
      "TWSE margin short summary",
      "market-level credit aggregate",
      "margin short total",
    ],
    jsonLdName: "整體融資融券資料集",
    jsonLdNameEn: "Aggregate Margin & Short Dataset",
    jsonLdDescription: "TWSE private beta 種子範圍的總體融資融券匯總資料，含來源血緣與缺口欄位。",
    jsonLdDescriptionEn:
      "TWSE private-beta seed-scope aggregate margin & short data, including source-lineage and gap fields.",
    sourceRole: "official_twse_mi_margn_summary",
    provider: "twse_official",
    marketScope: "TWSE",
  },
  {
    slug: "market-breadth",
    name: "市場廣度",
    nameEn: "Market Breadth",
    seoTitle: "市場廣度資料集 | TW Market Data",
    seoTitleEn: "Market Breadth Dataset | TW Market Data",
    seoDescription:
      "TWSE 市場廣度資料集（日）提供漲跌家數、漲跌停家數與市場結構欄位，為 2026-05 私有測試種子資料。",
    seoDescriptionEn:
      "The TWSE market breadth dataset (daily) provides advancer/decliner counts, limit-up/limit-down counts, and market-structure fields; it is 2026-05 private-beta seed data.",
    shortDescription: "TWSE 市場廣度（Private Beta）日資料，含漲跌/漲跌停與市場總量欄位。",
    shortDescriptionEn:
      "TWSE market breadth (private beta) daily data, including advancer/decliner, limit-up/limit-down, and market-total fields.",
    whatItIs:
      "此資料集聚焦 TWSE 官方來源的市場廣度衍生指標，提供每日漲跌家數與總成交數據，適合觀察盤勢結構與風險脈絡。",
    whatItIsEn:
      "This dataset focuses on TWSE official-source market-breadth derived indicators, providing daily advancer/decliner counts and total trading figures, suited to observing market structure and risk context.",
    useCases: [
      "追蹤市場日內整體偏弱 / 偏強信號。",
      "搭配大盤指數與技術指標做盤勢監控。",
      "在研究流程中保留 source_lineage 與 data_gaps 做可追溯判讀。",
    ],
    useCasesEn: [
      "Track overall intraday weak/strong signals across the market.",
      "Combine with the benchmark index and technical indicators for market monitoring.",
      "Preserve source_lineage and data_gaps for traceable interpretation in research workflows.",
    ],
    whyItMatters:
      "市場廣度資料能補充個股訊號，補強「價格/成交」之外的市場總體結構判讀；對風險管理與策略濾網有直接參考價值。",
    whyItMattersEn:
      "Market breadth data complements single-stock signals and strengthens whole-market structural interpretation beyond price/volume; it has direct value for risk management and strategy filters.",
    coverageNote:
      "當前 coverage 為 2026-05-04 到 2026-05-27，共 18 筆種子資料，且為 TWSE-only。",
    coverageNoteEn:
      "Current coverage is 2026-05-04 to 2026-05-27 — 18 seed records in total, and TWSE-only.",
    freshnessNote: "以 private beta 程度同步更新，請以回應中的 freshness 或 data_gaps 判讀即時可用性。",
    freshnessNoteEn:
      "Updated at a private-beta level; read real-time availability from the freshness or data_gaps in the response.",
    sourcePolicyNote:
      "採 official-first 與可追溯欄位標記，資料僅保留官方可驗證來源，不含 raw/body；不宣稱 TPEx/full-market 或每日 cron 已啟用。",
    sourcePolicyNoteEn:
      "Follows official-first with traceable field labeling, retaining only officially verifiable sources and excluding the raw/body; no claim of TPEx/full-market or an enabled daily cron.",
    docsHref: "/docs/api/market-prices/market-breadth",
    pricingHref: "/pricing",
    keywords: ["市場廣度 API", "TWSE 市場廣度", "漲跌家數", "漲跌停 觀測"],
    keywordsEn: [
      "market breadth API",
      "TWSE market breadth",
      "advancer decliner counts",
      "limit-up limit-down observation",
    ],
    jsonLdName: "市場廣度資料集",
    jsonLdNameEn: "Market Breadth Dataset",
    jsonLdDescription: "TWSE-only 市場廣度日資料，含 source_lineage、data_gaps 與 private beta 說明。",
    jsonLdDescriptionEn:
      "TWSE-only daily market-breadth data, including source_lineage, data_gaps, and private-beta notes.",
    sourceRole: "derived_market_breadth",
    provider: "twse_official",
    marketScope: "TWSE",
  },
  {
    slug: "technical-indicators",
    name: "技術指標",
    nameEn: "Technical Indicators",
    seoTitle: "技術指標資料集(MA / RSI / MACD)| TW Market Data",
    seoTitleEn: "Technical Indicators Dataset (MA / RSI / MACD) | TW Market Data",
    seoDescription:
      "技術指標資料集提供台股個股每日移動平均(MA 5 / 20 / 60)、RSI(14)與 MACD(line / signal / hist),由官方日線價格衍生,point-in-time 安全,適合動能、趨勢跟隨與均值回歸研究。",
    seoDescriptionEn:
      "The Technical Indicators dataset provides daily moving averages (MA 5 / 20 / 60), RSI (14), and MACD (line / signal / hist) for Taiwan stocks, derived from official daily prices and point-in-time safe — for momentum, trend-following, and mean-reversion research.",
    shortDescription: "個股每日 MA / RSI / MACD 技術指標,由日線價格衍生,標明還原/未還原基準。",
    shortDescriptionEn:
      "Daily MA / RSI / MACD technical indicators per stock, derived from daily prices, with the adjusted/unadjusted basis labeled.",
    whatItIs:
      "技術指標資料集每一列對應「一檔證券、一個交易日、一個計算基準」的指標值,欄位包含移動平均(ma_5 / ma_20 / ma_60)、相對強弱(rsi_14)與 MACD(macd_line / macd_signal / macd_hist),並以 indicator_basis 標明採用還原(close)或未還原(close_unadjusted)收盤價。指標由 equity_daily_prices 日線價格衍生;序列起點會有 warmup 期的 null(屬正常)。以 trade_date 為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one security on one trading day for one calculation basis, carrying moving averages (ma_5 / ma_20 / ma_60), relative strength (rsi_14), and MACD (macd_line / macd_signal / macd_hist), with indicator_basis marking whether the adjusted (close) or unadjusted (close_unadjusted) close was used. Indicators are derived from equity_daily_prices; the series start carries warmup nulls (expected). Keyed on trade_date and point-in-time safe.",
    useCases: [
      "以 MA 交叉、RSI 超買超賣讀取趨勢與動能。",
      "回測動能、趨勢跟隨與均值回歸策略。",
      "確保還原/未還原基準一致,避免除權息造成的指標失真。",
    ],
    useCasesEn: [
      "Read trend and momentum from MA crossovers and RSI overbought/oversold.",
      "Backtest momentum, trend-following, and mean-reversion strategies.",
      "Keep the adjusted/unadjusted basis consistent to avoid ex-rights distortion.",
    ],
    whyItMatters:
      "自算技術指標容易在還原價、warmup 與參數上出錯;直接取用一致口徑、point-in-time 安全的指標,可省去計算並確保回測不含未來函數。",
    whyItMattersEn:
      "Computing indicators yourself invites errors in price adjustment, warmup, and parameters; taking a consistent, point-in-time-safe series removes that work and keeps backtests free of look-ahead.",
    coverageNote:
      "逐檔逐日,涵蓋 TWSE / TPEx 上市櫃個股;每列標明計算基準(還原/未還原)。以 trade_date 為知識時間,point-in-time 安全;序列起點有 warmup null。",
    coverageNoteEn:
      "Per ticker, per trading day, across TWSE / TPEx listed stocks; every row states its calculation basis (adjusted / unadjusted). Keyed on trade_date, point-in-time safe; warmup nulls at series start.",
    freshnessNote: "日頻,隨日線價格更新。",
    freshnessNoteEn: "Daily, updated alongside daily prices.",
    sourcePolicyNote: "由官方 TWSE / TPEx 日線價格衍生;非投資建議。",
    sourcePolicyNoteEn: "Derived from official TWSE / TPEx daily prices; not investment advice.",
    docsHref: "/docs/api/market-prices/technical-indicators",
    pricingHref: "/pricing",
    keywords: ["技術指標 API", "移動平均", "RSI", "MACD", "台股動能", "技術分析"],
    keywordsEn: ["technical indicators API", "moving average", "RSI", "MACD", "Taiwan momentum", "technical analysis"],
    jsonLdName: "技術指標資料集",
    jsonLdNameEn: "Technical Indicators Dataset",
    jsonLdDescription: "台股個股每日 MA / RSI / MACD 技術指標,由官方日線價格衍生,point-in-time 安全。",
    jsonLdDescriptionEn:
      "Daily MA / RSI / MACD technical indicators for Taiwan stocks, derived from official daily prices, point-in-time safe.",
    sourceRole: "derived_technical_indicators",
    provider: "twse_official",
    marketScope: "TWSE_TPEX",
  },
] as const;

export const datasetSlugSet = new Set(datasetSeoEntries.map((item) => item.slug));

// Project a bilingual source record down to a single locale (spec §1.6, mirrors mega-menu-links.ts).
// Output uses the ORIGINAL field names, filled from the *_en source for `en` and the zh source
// otherwise. Non-prose fields (slug/hrefs/sourceRole/provider/marketScope) are shared.
function projectDatasetEntry(entry: DatasetSeoEntrySource, locale: AppLocale): DatasetSeoEntry {
  const en = locale === "en";
  return {
    slug: entry.slug,
    name: en ? entry.nameEn : entry.name,
    seoTitle: en ? entry.seoTitleEn : entry.seoTitle,
    seoDescription: en ? entry.seoDescriptionEn : entry.seoDescription,
    shortDescription: en ? entry.shortDescriptionEn : entry.shortDescription,
    whatItIs: en ? entry.whatItIsEn : entry.whatItIs,
    useCases: en ? entry.useCasesEn : entry.useCases,
    whyItMatters: en ? entry.whyItMattersEn : entry.whyItMatters,
    coverageNote: en ? entry.coverageNoteEn : entry.coverageNote,
    freshnessNote: en ? entry.freshnessNoteEn : entry.freshnessNote,
    sourcePolicyNote: en ? entry.sourcePolicyNoteEn : entry.sourcePolicyNote,
    docsHref: entry.docsHref,
    pricingHref: entry.pricingHref,
    keywords: en ? entry.keywordsEn : entry.keywords,
    jsonLdName: en ? entry.jsonLdNameEn : entry.jsonLdName,
    jsonLdDescription: en ? entry.jsonLdDescriptionEn : entry.jsonLdDescription,
    sourceRole: entry.sourceRole,
    provider: entry.provider,
    marketScope: entry.marketScope,
  };
}

// Locale-projected catalog (all datasets), for the datasets list / JSON-LD callers.
export function getDatasetSeoEntries(locale: AppLocale): DatasetSeoEntry[] {
  return datasetSeoEntries.map((entry) => projectDatasetEntry(entry, locale));
}

// Locale-projected single dataset by slug, for the /datasets/[slug] page body.
export function getDatasetSeoEntry(slug: string, locale: AppLocale): DatasetSeoEntry | undefined {
  const entry = datasetSeoEntries.find((item) => item.slug === slug);
  return entry ? projectDatasetEntry(entry, locale) : undefined;
}
