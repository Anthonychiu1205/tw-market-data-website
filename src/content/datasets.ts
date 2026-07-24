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
    slug: "taifex-atm-iv",
    name: "台指 ATM 隱含波動率",
    nameEn: "TAIEX ATM Implied Volatility",
    seoTitle: "台指 ATM 隱含波動率資料集(derived)| TW Market Data",
    seoTitleEn: "TAIEX ATM Implied Volatility Dataset (derived) | TW Market Data",
    seoDescription:
      "台指 ATM 隱含波動率資料集提供每日 TAIEX 價平(ATM)隱含波動率,以 Black-Scholes 由官方 TXO 選擇權價與 TAIEX 現貨反推,一日一列(含 atm_iv、現貨、價平履約價、到期日、納入選擇權數)。derivation_verified,非官方 VIX;point-in-time 安全。",
    seoDescriptionEn:
      "The TAIEX ATM Implied Volatility dataset provides daily at-the-money implied volatility for the TAIEX, reverse-engineered via Black-Scholes from official TXO option prices and the TAIEX spot — one row per day (atm_iv, spot, ATM strike, expiry, number of options included). Derivation-verified, not the official VIX; point-in-time safe.",
    shortDescription: "每日 TAIEX 價平隱含波動率,由官方選擇權價 + 現貨以 BS 反推(非官方 VIX)。",
    shortDescriptionEn:
      "Daily TAIEX at-the-money implied volatility, reverse-engineered via Black-Scholes from official option prices + spot (not the official VIX).",
    whatItIs:
      "台指 ATM 隱含波動率資料集每一列對應「一個交易日」的 TAIEX 價平隱含波動率,欄位包含 atm_iv(年化小數)、spot(TAIEX 現貨)、atm_strike(價平履約價)、expiry_date(到期日)與 n_options(納入計算的選擇權數)。數值由 Black-Scholes 從官方 TXO 選擇權價與 TAIEX 現貨反推(derivation_verified,引擎忠實重現官方輸入),為波動率的衍生指標,非官方 VIX(官方 VIX 為付費)。到期日 dte≤1 時 BS T→0 會放大,屬正常非壞值;以 trade_date 為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one trading day of TAIEX at-the-money implied volatility, carrying atm_iv (annualized decimal), spot (TAIEX spot), atm_strike, expiry_date, and n_options (options included in the calculation). Values are reverse-engineered via Black-Scholes from official TXO option prices and the TAIEX spot (derivation-verified — the engine faithfully reproduces official inputs); it is a derived volatility measure, NOT the official VIX (which is paid). Near expiry (dte ≤ 1) BS T→0 amplifies the value — expected, not a bad reading. Keyed on trade_date and point-in-time safe.",
    useCases: [
      "以 ATM 隱含波動率判讀市場波動率環境(高/低波動)。",
      "作為 VIX 代理觀察情緒與避險成本變化。",
      "結合選擇權與現貨,分析波動率結構與到期效應。",
    ],
    useCasesEn: [
      "Read the market volatility regime (high/low vol) from ATM implied volatility.",
      "Use as a VIX proxy to watch sentiment and hedging-cost changes.",
      "Analyze volatility structure and expiry effects alongside options and spot.",
    ],
    whyItMatters:
      "官方 VIX 為付費;此資料集以官方選擇權價 derivation-verified 反推價平隱含波動率,提供可追溯、point-in-time 安全的波動率環境指標,免自行反推的計算與口徑風險。",
    whyItMattersEn:
      "The official VIX is paid; this dataset derivation-verifies ATM implied volatility from official option prices, giving a traceable, point-in-time-safe volatility-regime indicator without the burden and convention risk of reverse-engineering it yourself.",
    coverageNote:
      "逐交易日一列,標的為 TAIEX;含 atm_iv / spot / atm_strike / expiry_date / n_options。以 trade_date 為知識時間,point-in-time 安全;dte≤1 的放大屬正常。",
    coverageNoteEn:
      "One row per trading day for the TAIEX; includes atm_iv / spot / atm_strike / expiry_date / n_options. Keyed on trade_date, point-in-time safe; the near-expiry (dte ≤ 1) amplification is expected.",
    freshnessNote: "日頻,隨官方選擇權與現貨更新。",
    freshnessNoteEn: "Daily, updated with official options and spot.",
    sourcePolicyNote:
      "由官方 TAIFEX TXO 選擇權價 + TAIEX 現貨 derivation-verified 反推;為衍生指標,非官方 VIX,非投資建議。",
    sourcePolicyNoteEn:
      "Derivation-verified from official TAIFEX TXO option prices + TAIEX spot; a derived measure, not the official VIX, not investment advice.",
    docsHref: "/docs/api/derivatives/taifex-atm-iv",
    pricingHref: "/pricing",
    keywords: ["台指隱含波動率", "ATM IV", "VIX 代理", "波動率環境", "台股選擇權"],
    keywordsEn: ["TAIEX implied volatility", "ATM IV", "VIX proxy", "volatility regime", "Taiwan options"],
    jsonLdName: "台指 ATM 隱含波動率資料集",
    jsonLdNameEn: "TAIEX ATM Implied Volatility Dataset",
    jsonLdDescription: "每日 TAIEX 價平隱含波動率,由官方選擇權價 derivation-verified 反推,point-in-time 安全(非官方 VIX)。",
    jsonLdDescriptionEn:
      "Daily TAIEX at-the-money implied volatility, derivation-verified from official option prices, point-in-time safe (not the official VIX).",
    sourceRole: "derived_taifex_atm_iv",
    provider: "taifex",
    marketScope: "TWSE",
  },
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
    slug: "taifex-options-delta",
    name: "選擇權每日 Delta",
    nameEn: "Options Daily Delta",
    seoTitle: "台指選擇權每日 Delta 資料集 | TW Market Data",
    seoTitleEn: "TAIFEX Options Daily Delta Dataset | TW Market Data",
    seoDescription:
      "台指選擇權每日 Delta 資料集提供期交所各選擇權契約 / 買賣權 / 到期 / 履約價的每日 Delta(避險比率),一列一個序列一交易日,Delta 加權即部位方向暴露。point-in-time 安全。",
    seoDescriptionEn:
      "The TAIFEX Options Daily Delta dataset provides the daily Delta (hedge ratio) for each option series — contract / call-put / expiry / strike — one row per series per trading day; Delta-weighted, it is directional position exposure. Point-in-time safe.",
    shortDescription: "各選擇權契約 / 買賣權 / 到期 / 履約價的每日 Delta(避險比率)。",
    shortDescriptionEn:
      "Daily Delta (hedge ratio) per option contract / call-put / expiry / strike.",
    whatItIs:
      "選擇權每日 Delta 資料集每一列對應「一個選擇權序列(contract / call_put / contract_month_week / strike_price)、一個交易日」的 delta 值(避險比率)。資料為期交所各選擇權契約的每日 Delta;Delta 加權即部位的方向暴露。以 trade_date 為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one option series (contract / call_put / contract_month_week / strike_price) on one trading day, carrying its delta (hedge ratio). Values are the daily Delta for each TAIFEX option contract; Delta-weighted, they express directional position exposure. Keyed on trade_date and point-in-time safe.",
    useCases: [
      "以 Delta 判讀選擇權部位的方向暴露與避險比率。",
      "計算 Delta 加權部位、估算 gamma exposure。",
      "結合選擇權行情做 greeks 與避險分析。",
    ],
    useCasesEn: [
      "Read directional exposure and hedge ratio from option Deltas.",
      "Compute Delta-weighted positions and gamma exposure.",
      "Do greeks and hedging analysis alongside option quotes.",
    ],
    whyItMatters:
      "自算 Delta 需選擇權定價模型與一致參數;直接取用期交所口徑的每日 Delta,可省去計算並確保跨序列一致、point-in-time 安全。",
    whyItMattersEn:
      "Computing Delta yourself needs an option-pricing model and consistent parameters; taking the daily Delta on the TAIFEX basis removes that work and keeps it consistent across series and point-in-time safe.",
    coverageNote:
      "逐選擇權序列逐日一列,涵蓋期交所選擇權契約(買賣權 / 到期 / 履約價)。以 trade_date 為知識時間,point-in-time 安全。",
    coverageNoteEn:
      "One row per option series per day, across TAIFEX option contracts (call-put / expiry / strike). Keyed on trade_date, point-in-time safe.",
    freshnessNote: "日頻,隨期交所選擇權更新。",
    freshnessNoteEn: "Daily, updated with TAIFEX options.",
    sourcePolicyNote: "由官方 TAIFEX 選擇權資料提供;非投資建議。",
    sourcePolicyNoteEn: "From official TAIFEX options data; not investment advice.",
    docsHref: "/docs/api/derivatives/taifex-options-delta",
    pricingHref: "/pricing",
    keywords: ["選擇權 Delta", "避險比率", "greeks", "gamma exposure", "台指選擇權"],
    keywordsEn: ["options Delta", "hedge ratio", "greeks", "gamma exposure", "TAIFEX options"],
    jsonLdName: "選擇權每日 Delta 資料集",
    jsonLdNameEn: "Options Daily Delta Dataset",
    jsonLdDescription: "期交所各選擇權契約每日 Delta(避險比率),point-in-time 安全。",
    jsonLdDescriptionEn:
      "Daily Delta (hedge ratio) per TAIFEX option contract, point-in-time safe.",
    sourceRole: "official_taifex_options_delta",
    provider: "taifex",
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
    slug: "taifex-put-call-ratio",
    name: "選擇權 Put/Call Ratio",
    nameEn: "Options Put/Call Ratio",
    seoTitle: "台指選擇權 Put/Call Ratio 資料集 | TW Market Data",
    seoTitleEn: "TAIFEX Options Put/Call Ratio Dataset | TW Market Data",
    seoDescription:
      "台指選擇權 Put/Call Ratio 資料集提供期交所每日選擇權成交量 Put/Call 比與未平倉 Put/Call 比,含賣權 / 買權成交量,一日一列。市場級情緒指標(常作反向觀察),point-in-time 安全。",
    seoDescriptionEn:
      "The TAIFEX Options Put/Call Ratio dataset provides the daily volume and open-interest put/call ratios plus put and call volumes — one row per day. A market-level sentiment indicator (often read contrarian); point-in-time safe.",
    shortDescription: "每日選擇權成交量與未平倉 Put/Call 比(市場情緒指標)。",
    shortDescriptionEn:
      "Daily options volume and open-interest put/call ratios (a sentiment indicator).",
    whatItIs:
      "選擇權 Put/Call Ratio 資料集每一列對應「一個交易日」全市場的選擇權 Put/Call 情緒,欄位包含 put_call_volume_ratio(成交量比)、put_call_oi_ratio(未平倉比)、put_volume(賣權成交量)與 call_volume(買權成交量)。為市場級情緒指標,PCR 偏高常視為偏空(且常作反向觀察);以 trade_date 為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one trading day of market-wide option put/call sentiment, carrying put_call_volume_ratio, put_call_oi_ratio, put_volume, and call_volume. It is a market-level sentiment indicator — a high PCR is typically read as bearish (and often contrarian). Keyed on trade_date and point-in-time safe.",
    useCases: [
      "以 PCR 判讀市場情緒與極端偏空 / 偏多。",
      "作為反向指標觀察情緒轉折。",
      "結合大盤與波動率做情緒面濾網。",
    ],
    useCasesEn: [
      "Read market sentiment and bearish/bullish extremes from the PCR.",
      "Use as a contrarian indicator for sentiment turns.",
      "Layer sentiment onto the index and volatility as a filter.",
    ],
    whyItMatters:
      "PCR 的成交量比與未平倉比口徑若不一致,情緒判讀會失真;直接取用期交所口徑的每日 PCR,可做一致、point-in-time 安全的情緒面分析。",
    whyItMattersEn:
      "Inconsistent volume vs open-interest conventions distort PCR-based sentiment; taking the daily PCR on the TAIFEX basis gives consistent, point-in-time-safe sentiment analysis.",
    coverageNote:
      "逐交易日一列,含成交量比 / 未平倉比與賣買權成交量。以 trade_date 為知識時間,point-in-time 安全。",
    coverageNoteEn:
      "One row per trading day, with volume and open-interest ratios and put/call volumes. Keyed on trade_date, point-in-time safe.",
    freshnessNote: "日頻,隨期交所選擇權更新。",
    freshnessNoteEn: "Daily, updated with TAIFEX options.",
    sourcePolicyNote: "由官方 TAIFEX 選擇權資料提供;為情緒指標,非投資建議。",
    sourcePolicyNoteEn: "From official TAIFEX options data; a sentiment indicator, not investment advice.",
    docsHref: "/docs/api/derivatives/taifex-put-call-ratio",
    pricingHref: "/pricing",
    keywords: ["Put Call Ratio", "PCR", "市場情緒", "反向指標", "台指選擇權"],
    keywordsEn: ["put call ratio", "PCR", "market sentiment", "contrarian indicator", "TAIFEX options"],
    jsonLdName: "選擇權 Put/Call Ratio 資料集",
    jsonLdNameEn: "Options Put/Call Ratio Dataset",
    jsonLdDescription: "期交所每日選擇權 Put/Call 成交量比與未平倉比,point-in-time 安全。",
    jsonLdDescriptionEn:
      "Daily TAIFEX options put/call volume and open-interest ratios, point-in-time safe.",
    sourceRole: "official_taifex_put_call_ratio",
    provider: "taifex",
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
    slug: "convertible-bond-overview",
    name: "可轉債總覽",
    nameEn: "Convertible Bond Overview",
    seoTitle: "台股可轉債總覽資料集(條款 / 轉換價 / 參考價)| TW Market Data",
    seoTitleEn: "Taiwan Convertible Bond Overview Dataset (terms / conversion price) | TW Market Data",
    seoDescription:
      "台股可轉債總覽資料集提供上櫃可轉債每日條款看板:轉換價、參考價、標的股價、流通餘額與票面利率,一檔一日一列。轉換價值 = 標的股價 / 轉換價 × 面額;point-in-time 安全。",
    seoDescriptionEn:
      "The Taiwan Convertible Bond Overview dataset provides a daily terms board for TPEx convertible bonds: conversion price, reference price, underlying stock price, outstanding amount, and coupon rate — one row per bond per day. Conversion value = underlying / conversion price × par; point-in-time safe.",
    shortDescription: "上櫃可轉債每日條款:轉換價 / 參考價 / 標的股價 / 流通餘額 / 票面利率。",
    shortDescriptionEn:
      "Daily TPEx convertible-bond terms: conversion / reference price, underlying, outstanding, coupon.",
    whatItIs:
      "可轉債總覽資料集每一列對應「一檔可轉債(cb_id)、一個交易日」的條款看板,欄位包含 cb_name(名稱)、conversion_price(轉換價)、reference_price(參考價)、underlying_stock_price(標的股價)、outstanding_amount(流通餘額)與 coupon_rate(票面利率)。標的為上櫃可轉債;轉換價值 = 標的股價 / 轉換價 × 面額。以 trade_date 為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one convertible bond (cb_id) on one trading day, a terms board carrying cb_name, conversion_price, reference_price, underlying_stock_price, outstanding_amount, and coupon_rate. Bonds are TPEx-listed; conversion value = underlying / conversion price × par. Keyed on trade_date and point-in-time safe.",
    useCases: [
      "以轉換價與標的股價估算轉換價值與溢價。",
      "篩選 CB 套利與可轉債籌資訊號。",
      "結合法人買賣(可轉債法人買賣)分析籌碼。",
    ],
    useCasesEn: [
      "Estimate conversion value and premium from conversion price and underlying.",
      "Screen for CB arbitrage and financing signals.",
      "Analyze positioning alongside convertible-bond institutional flow.",
    ],
    whyItMatters:
      "可轉債條款分散且口徑不一;直接取用每日條款看板(轉換價 / 參考價 / 流通餘額),可一致計算溢價與轉換價值,且 point-in-time 安全。",
    whyItMattersEn:
      "Convertible-bond terms are scattered and inconsistently defined; a daily terms board (conversion / reference price, outstanding) lets you compute premium and conversion value consistently and point-in-time safe.",
    coverageNote:
      "逐可轉債逐日一列,標的為上櫃可轉債;含轉換價 / 參考價 / 標的股價 / 流通餘額 / 票面利率。以 trade_date 為知識時間,point-in-time 安全。",
    coverageNoteEn:
      "One row per convertible bond per day, TPEx-listed; includes conversion / reference price, underlying, outstanding, and coupon. Keyed on trade_date, point-in-time safe.",
    freshnessNote: "日頻,隨上櫃可轉債更新。",
    freshnessNoteEn: "Daily, updated with TPEx convertible bonds.",
    sourcePolicyNote: "由官方 TPEx 上櫃可轉債資料提供;非投資建議。",
    sourcePolicyNoteEn: "From official TPEx convertible-bond data; not investment advice.",
    docsHref: "/docs/api/derivatives/convertible-bond-overview",
    pricingHref: "/pricing",
    keywords: ["可轉債", "轉換價", "CB 套利", "可轉債總覽", "上櫃可轉債"],
    keywordsEn: ["convertible bond", "conversion price", "CB arbitrage", "convertible overview", "TPEx convertibles"],
    jsonLdName: "可轉債總覽資料集",
    jsonLdNameEn: "Convertible Bond Overview Dataset",
    jsonLdDescription: "上櫃可轉債每日條款(轉換價 / 參考價 / 標的股價 / 流通餘額 / 票面利率),point-in-time 安全。",
    jsonLdDescriptionEn:
      "Daily TPEx convertible-bond terms (conversion / reference price, underlying, outstanding, coupon), point-in-time safe.",
    sourceRole: "official_convertible_bond_overview",
    provider: "tpex",
    marketScope: "TWSE_TPEX",
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
    slug: "convertible-bond-institutional",
    name: "可轉債法人買賣",
    nameEn: "Convertible Bond Institutional Flow",
    seoTitle: "台股可轉債法人買賣資料集(外資 / 投信 / 自營)| TW Market Data",
    seoTitleEn: "Taiwan Convertible Bond Institutional Flow Dataset | TW Market Data",
    seoDescription:
      "台股可轉債法人買賣資料集提供上櫃可轉債每日外資 / 投信 / 自營商買賣超淨額與三大法人合計,一檔一日一列。連續買超常視為看多轉換;point-in-time 安全。",
    seoDescriptionEn:
      "The Taiwan Convertible Bond Institutional Flow dataset provides daily foreign / trust / dealer net buys and their total for TPEx convertible bonds — one row per bond per day. Sustained net buying is often read as bullish on conversion; point-in-time safe.",
    shortDescription: "上櫃可轉債每日外資 / 投信 / 自營商買賣超與三大法人合計。",
    shortDescriptionEn:
      "Daily foreign / trust / dealer net buys and the total for TPEx convertible bonds.",
    whatItIs:
      "可轉債法人買賣資料集每一列對應「一檔可轉債(cb_id)、一個交易日」的三大法人買賣超,欄位包含 foreign_net(外資淨額)、trust_net(投信淨額)、dealer_net(自營商淨額)與 total_net(三大法人合計淨額)。標的為上櫃可轉債;連續買超常視為看多轉換。以 trade_date 為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one convertible bond (cb_id) on one trading day of institutional net buys, carrying foreign_net, trust_net, dealer_net, and total_net. Bonds are TPEx-listed; sustained net buying is often read as bullish on conversion. Keyed on trade_date and point-in-time safe.",
    useCases: [
      "追蹤可轉債的法人籌碼與買賣動向。",
      "以連續買超觀察對轉換的偏多訊號。",
      "結合可轉債總覽的條款分析籌碼與價格。",
    ],
    useCasesEn: [
      "Track institutional positioning and flow in convertible bonds.",
      "Watch sustained net buying as a bullish conversion signal.",
      "Combine with the overview's terms to analyze positioning and price.",
    ],
    whyItMatters:
      "可轉債籌碼分散難追;直接取用每日三大法人買賣超,可一致觀察法人動向,且 point-in-time 安全。",
    whyItMattersEn:
      "Convertible-bond positioning is hard to track; daily institutional net buys give a consistent view of flow, point-in-time safe.",
    coverageNote:
      "逐可轉債逐日一列,標的為上櫃可轉債;含外資 / 投信 / 自營淨額與合計。以 trade_date 為知識時間,point-in-time 安全。",
    coverageNoteEn:
      "One row per convertible bond per day, TPEx-listed; foreign / trust / dealer nets and total. Keyed on trade_date, point-in-time safe.",
    freshnessNote: "日頻,隨上櫃可轉債更新。",
    freshnessNoteEn: "Daily, updated with TPEx convertible bonds.",
    sourcePolicyNote: "由官方 TPEx 上櫃可轉債資料提供;非投資建議。",
    sourcePolicyNoteEn: "From official TPEx convertible-bond data; not investment advice.",
    docsHref: "/docs/api/derivatives/convertible-bond-institutional",
    pricingHref: "/pricing",
    keywords: ["可轉債法人", "可轉債籌碼", "外資投信自營", "可轉債買賣超", "上櫃可轉債"],
    keywordsEn: ["convertible bond institutional", "CB positioning", "foreign trust dealer", "CB net buys", "TPEx convertibles"],
    jsonLdName: "可轉債法人買賣資料集",
    jsonLdNameEn: "Convertible Bond Institutional Flow Dataset",
    jsonLdDescription: "上櫃可轉債每日三大法人買賣超,point-in-time 安全。",
    jsonLdDescriptionEn:
      "Daily institutional net buys for TPEx convertible bonds, point-in-time safe.",
    sourceRole: "official_convertible_bond_institutional",
    provider: "tpex",
    marketScope: "TWSE_TPEX",
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
    slug: "convertible-bond-monthly",
    name: "可轉債集保月報",
    nameEn: "Convertible Bond Custody (Monthly)",
    seoTitle: "台股可轉債集保月報資料集(TDCC 庫存 / 帳戶)| TW Market Data",
    seoTitleEn: "Taiwan Convertible Bond Custody Monthly Dataset (TDCC) | TW Market Data",
    seoDescription:
      "台股可轉債集保月報資料集提供 TDCC 每月可轉債集保庫存餘額、當月異動與集保帳戶數,一檔一月一列。月頻、次月上旬揭露有落差——非 point-in-time 安全,回測需依 as_of 對齊。",
    seoDescriptionEn:
      "The Taiwan Convertible Bond Custody Monthly dataset provides TDCC monthly custody balance, monthly change, and custody-account count for convertible bonds — one row per bond per month. Monthly with an early-next-month disclosure lag — NOT point-in-time safe; align by as_of for backtests.",
    shortDescription: "TDCC 每月可轉債集保庫存餘額 / 異動 / 集保帳戶數。",
    shortDescriptionEn:
      "TDCC monthly convertible-bond custody balance / change / account count.",
    whatItIs:
      "可轉債集保月報資料集每一列對應「一檔可轉債(cb_id)、一個資料年月(data_month)」的集保分布,欄位包含 custody_balance(集保庫存餘額)、change_amount(當月異動)與 custody_accounts(集保帳戶數),來源 TDCC。月頻、次月上旬揭露有落差——以 data_month 為知識時間,【非 point-in-time 安全】:回測務必依 as_of 對齊,避免用到當時尚未揭露的月報。",
    whatItIsEn:
      "Each row is one convertible bond (cb_id) for one data month (data_month), carrying custody_balance, change_amount, and custody_accounts, sourced from TDCC. Monthly with an early-next-month disclosure lag — keyed on data_month and NOT point-in-time safe: align by as_of so a not-yet-disclosed monthly report never leaks into the past.",
    useCases: [
      "觀察可轉債集保庫存與帳戶數的月度變化。",
      "追蹤籌碼分布趨勢與持有結構。",
      "依 as_of 對齊,確保回測不含未揭露月報的未來函數。",
    ],
    useCasesEn: [
      "Watch monthly changes in convertible-bond custody balance and account count.",
      "Track positioning-distribution trends and holding structure.",
      "Align by as_of to keep backtests free of undisclosed-report look-ahead.",
    ],
    whyItMatters:
      "月報有揭露落差,誤用揭露時點易引入未來函數;直接取用附 data_month 的集保庫存,可正確對齊 point-in-time。",
    whyItMattersEn:
      "Monthly reports have a disclosure lag; mishandling timing leaks look-ahead — taking custody balances stamped with data_month aligns point-in-time correctly.",
    coverageNote:
      "逐可轉債逐月一列,來源 TDCC;含集保庫存餘額 / 當月異動 / 集保帳戶數。以 data_month 為知識時間,非 point-in-time 安全——回測需依 as_of 對齊。",
    coverageNoteEn:
      "One row per convertible bond per month from TDCC; custody balance / monthly change / account count. Keyed on data_month, NOT point-in-time safe — align by as_of for backtests.",
    freshnessNote: "月頻,次月上旬揭露(有落差)。",
    freshnessNoteEn: "Monthly, disclosed early the following month (with a lag).",
    sourcePolicyNote: "由官方 TDCC 集保資料提供;非投資建議。",
    sourcePolicyNoteEn: "From official TDCC custody data; not investment advice.",
    docsHref: "/docs/api/derivatives/convertible-bond-monthly",
    pricingHref: "/pricing",
    keywords: ["可轉債集保", "TDCC 月報", "集保庫存", "可轉債籌碼分布", "上櫃可轉債"],
    keywordsEn: ["convertible bond custody", "TDCC monthly", "custody balance", "CB distribution", "TPEx convertibles"],
    jsonLdName: "可轉債集保月報資料集",
    jsonLdNameEn: "Convertible Bond Custody Monthly Dataset",
    jsonLdDescription: "TDCC 每月可轉債集保庫存 / 異動 / 帳戶數,以 data_month 為知識時間(非 PIT-safe)。",
    jsonLdDescriptionEn:
      "TDCC monthly convertible-bond custody balance / change / accounts, keyed on data_month (not PIT-safe).",
    sourceRole: "official_convertible_bond_monthly",
    provider: "tdcc",
    marketScope: "TWSE_TPEX",
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
    slug: "customs-trade-monthly",
    name: "海關進出口貿易統計(月)",
    nameEn: "Customs Trade Statistics (monthly)",
    seoTitle: "台股宏觀:海關進出口貿易統計(月)資料集 | TW Market Data",
    seoTitleEn: "Taiwan Macro: Customs Trade Statistics (monthly) Dataset | TW Market Data",
    seoDescription:
      "官方每月海關進出口貿易統計,每個統計項目一列,欄位含 stat_item / item_code / item_name / value / unit / attribution;數值以新臺幣千元計,來源財政部關務署。grade=official、point-in-time 安全。",
    seoDescriptionEn:
      "Official monthly Taiwan statistic on customs import/export trade — one row per statistical item, with fields stat_item / item_code / item_name / value / unit / attribution; values in NT$ thousand, sourced from the Customs Administration, Ministry of Finance. grade=official, point-in-time safe.",
    shortDescription: "官方每月海關進出口貿易統計,逐項目值與單位、來源財政部關務署。",
    shortDescriptionEn: "Official monthly customs import/export trade statistic — per-item values and units, sourced from the Customs Administration, Ministry of Finance.",
    whatItIs:
      "海關進出口貿易統計(月)資料集每一列對應一個統計項目,欄位包含 stat_item(統計表)、item_code(項目代碼)、item_name(項目名稱)、value(數值)、unit(單位,新臺幣千元)與 attribution(來源:財政部關務署)。為官方政府統計(grade=official),回傳最新月份的逐項目值(如出口 / 復出口 等貿易項目);以揭露為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one statistical item, carrying stat_item, item_code, item_name, value, unit (NT$ thousand), and attribution (source: Customs Administration, Ministry of Finance). It is an official government statistic (grade=official) returning the latest month's per-item values (e.g. trade items such as exports and re-exports); point-in-time safe.",
    useCases: [
      "追蹤海關進出口貿易的最新官方月統計。",
      "作為總經與產業研究的官方數據層。",
      "以 attribution 與 item_code 對齊來源、可追溯判讀。",
    ],
    useCasesEn: [
      "Track the latest official monthly figures for customs import/export trade.",
      "Use as an official data layer for macro and industry research.",
      "Align to source via attribution and item_code for traceable interpretation.",
    ],
    whyItMatters:
      "官方月統計分散於各部會網站、格式不一;此資料集以一致結構(項目/值/單位/來源)提供海關進出口貿易的官方數據,免逐一抓取解析,且 point-in-time 安全。",
    whyItMattersEn:
      "Official monthly statistics are scattered across ministry sites in inconsistent formats; this dataset serves customs import/export trade in one consistent shape (item / value / unit / source), removing the scrape-and-parse work — point-in-time safe.",
    coverageNote:
      "官方每月海關進出口貿易統計(grade=official),每個統計項目一列,數值以新臺幣千元計,來源財政部關務署;回傳最新月份的逐項目值,以揭露為知識時間,point-in-time 安全。(後端 meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Official monthly customs import/export trade statistic (grade=official); one row per statistical item, values in NT$ thousand, sourced from the Customs Administration, Ministry of Finance; returns the latest month's per-item values, point-in-time safe. (The backend meta provides no coverage window, so none is stated.)",
    freshnessNote: "月頻,隨官方月統計發布更新(有申報落差)。",
    freshnessNoteEn: "Monthly, updated as the official statistic is released (with a reporting lag).",
    sourcePolicyNote: "官方政府統計,來源財政部關務署(grade=official);非投資建議。",
    sourcePolicyNoteEn: "Official government statistic, sourced from the Customs Administration, Ministry of Finance (grade=official); not investment advice.",
    docsHref: "/docs/api/macro/customs-trade-monthly",
    pricingHref: "/pricing",
    keywords: ["海關進出口貿易", "台灣官方統計", "月統計", "總經數據", "財政部關務署"],
    keywordsEn: ["customs import/export trade", "Taiwan official statistics", "monthly statistic", "macro data", "government statistics"],
    jsonLdName: "海關進出口貿易統計(月)資料集",
    jsonLdNameEn: "Customs Trade Statistics (monthly) Dataset",
    jsonLdDescription: "官方每月海關進出口貿易統計,逐項目值與單位,來源財政部關務署,point-in-time 安全。",
    jsonLdDescriptionEn: "Official monthly customs import/export trade statistic — per-item values and units from the Customs Administration, Ministry of Finance, point-in-time safe.",
    sourceRole: "official_customs_trade_monthly",
    provider: "gov",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "export-orders-monthly",
    name: "外銷訂單金額(按貨品別,月)",
    nameEn: "Export Orders by Product (monthly)",
    seoTitle: "台股宏觀:外銷訂單金額(按貨品別,月)資料集 | TW Market Data",
    seoTitleEn: "Taiwan Macro: Export Orders by Product (monthly) Dataset | TW Market Data",
    seoDescription:
      "官方每月外銷訂單金額(按貨品別)統計,每個統計項目一列,欄位含 stat_item / item_code / item_name / value / unit / attribution;數值以百萬美元計,來源經濟部統計處。grade=official、point-in-time 安全。",
    seoDescriptionEn:
      "Official monthly Taiwan statistic on export orders by product — one row per statistical item, with fields stat_item / item_code / item_name / value / unit / attribution; values in US$ million, sourced from the Department of Statistics, Ministry of Economic Affairs. grade=official, point-in-time safe.",
    shortDescription: "官方每月外銷訂單金額(按貨品別)統計,逐項目值與單位、來源經濟部統計處。",
    shortDescriptionEn: "Official monthly export orders by product statistic — per-item values and units, sourced from the Department of Statistics, Ministry of Economic Affairs.",
    whatItIs:
      "外銷訂單金額(按貨品別,月)資料集每一列對應一個統計項目,欄位包含 stat_item(統計表)、item_code(項目代碼)、item_name(項目名稱)、value(數值)、unit(單位,百萬美元)與 attribution(來源:經濟部統計處)。為官方政府統計(grade=official),回傳最新月份的逐項目值(如電子產品 等貨品別);以揭露為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one statistical item, carrying stat_item, item_code, item_name, value, unit (US$ million), and attribution (source: Department of Statistics, Ministry of Economic Affairs). It is an official government statistic (grade=official) returning the latest month's per-item values (e.g. product categories such as electronics); point-in-time safe.",
    useCases: [
      "追蹤外銷訂單金額(按貨品別)的最新官方月統計。",
      "作為總經與產業研究的官方數據層。",
      "以 attribution 與 item_code 對齊來源、可追溯判讀。",
    ],
    useCasesEn: [
      "Track the latest official monthly figures for export orders by product.",
      "Use as an official data layer for macro and industry research.",
      "Align to source via attribution and item_code for traceable interpretation.",
    ],
    whyItMatters:
      "官方月統計分散於各部會網站、格式不一;此資料集以一致結構(項目/值/單位/來源)提供外銷訂單金額(按貨品別)的官方數據,免逐一抓取解析,且 point-in-time 安全。",
    whyItMattersEn:
      "Official monthly statistics are scattered across ministry sites in inconsistent formats; this dataset serves export orders by product in one consistent shape (item / value / unit / source), removing the scrape-and-parse work — point-in-time safe.",
    coverageNote:
      "官方每月外銷訂單金額(按貨品別)統計(grade=official),每個統計項目一列,數值以百萬美元計,來源經濟部統計處;回傳最新月份的逐項目值,以揭露為知識時間,point-in-time 安全。(後端 meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Official monthly export orders by product statistic (grade=official); one row per statistical item, values in US$ million, sourced from the Department of Statistics, Ministry of Economic Affairs; returns the latest month's per-item values, point-in-time safe. (The backend meta provides no coverage window, so none is stated.)",
    freshnessNote: "月頻,隨官方月統計發布更新(有申報落差)。",
    freshnessNoteEn: "Monthly, updated as the official statistic is released (with a reporting lag).",
    sourcePolicyNote: "官方政府統計,來源經濟部統計處(grade=official);非投資建議。",
    sourcePolicyNoteEn: "Official government statistic, sourced from the Department of Statistics, Ministry of Economic Affairs (grade=official); not investment advice.",
    docsHref: "/docs/api/macro/export-orders-monthly",
    pricingHref: "/pricing",
    keywords: ["外銷訂單金額(按貨品別)", "台灣官方統計", "月統計", "總經數據", "經濟部統計處"],
    keywordsEn: ["export orders by product", "Taiwan official statistics", "monthly statistic", "macro data", "government statistics"],
    jsonLdName: "外銷訂單金額(按貨品別,月)資料集",
    jsonLdNameEn: "Export Orders by Product (monthly) Dataset",
    jsonLdDescription: "官方每月外銷訂單金額(按貨品別)統計,逐項目值與單位,來源經濟部統計處,point-in-time 安全。",
    jsonLdDescriptionEn: "Official monthly export orders by product statistic — per-item values and units from the Department of Statistics, Ministry of Economic Affairs, point-in-time safe.",
    sourceRole: "official_export_orders_monthly",
    provider: "gov",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "production-value-index-monthly",
    name: "製造業生產價值指數(月)",
    nameEn: "Manufacturing Production Value Index (monthly)",
    seoTitle: "台股宏觀:製造業生產價值指數(月)資料集 | TW Market Data",
    seoTitleEn: "Taiwan Macro: Manufacturing Production Value Index (monthly) Dataset | TW Market Data",
    seoDescription:
      "官方每月製造業生產價值指數統計,每個統計項目一列,欄位含 stat_item / item_code / item_name / value / unit / attribution;數值以指數(110 年=100)計,來源經濟部統計處。grade=official、point-in-time 安全。",
    seoDescriptionEn:
      "Official monthly Taiwan statistic on the manufacturing production-value index — one row per statistical item, with fields stat_item / item_code / item_name / value / unit / attribution; values in index (2021 = 100), sourced from the Department of Statistics, Ministry of Economic Affairs. grade=official, point-in-time safe.",
    shortDescription: "官方每月製造業生產價值指數統計,逐項目值與單位、來源經濟部統計處。",
    shortDescriptionEn: "Official monthly the manufacturing production-value index statistic — per-item values and units, sourced from the Department of Statistics, Ministry of Economic Affairs.",
    whatItIs:
      "製造業生產價值指數(月)資料集每一列對應一個統計項目,欄位包含 stat_item(統計表)、item_code(項目代碼)、item_name(項目名稱)、value(數值)、unit(單位,指數(110 年=100))與 attribution(來源:經濟部統計處)。為官方政府統計(grade=official),回傳最新月份的逐項目值(如其他製造業 等行業別);以揭露為知識時間,point-in-time 安全。",
    whatItIsEn:
      "Each row is one statistical item, carrying stat_item, item_code, item_name, value, unit (index (2021 = 100)), and attribution (source: Department of Statistics, Ministry of Economic Affairs). It is an official government statistic (grade=official) returning the latest month's per-item values (e.g. industry categories such as other manufacturing); point-in-time safe.",
    useCases: [
      "追蹤製造業生產價值指數的最新官方月統計。",
      "作為總經與產業研究的官方數據層。",
      "以 attribution 與 item_code 對齊來源、可追溯判讀。",
    ],
    useCasesEn: [
      "Track the latest official monthly figures for the manufacturing production-value index.",
      "Use as an official data layer for macro and industry research.",
      "Align to source via attribution and item_code for traceable interpretation.",
    ],
    whyItMatters:
      "官方月統計分散於各部會網站、格式不一;此資料集以一致結構(項目/值/單位/來源)提供製造業生產價值指數的官方數據,免逐一抓取解析,且 point-in-time 安全。",
    whyItMattersEn:
      "Official monthly statistics are scattered across ministry sites in inconsistent formats; this dataset serves the manufacturing production-value index in one consistent shape (item / value / unit / source), removing the scrape-and-parse work — point-in-time safe.",
    coverageNote:
      "官方每月製造業生產價值指數統計(grade=official),每個統計項目一列,數值以指數(110 年=100)計,來源經濟部統計處;回傳最新月份的逐項目值,以揭露為知識時間,point-in-time 安全。(後端 meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Official monthly the manufacturing production-value index statistic (grade=official); one row per statistical item, values in index (2021 = 100), sourced from the Department of Statistics, Ministry of Economic Affairs; returns the latest month's per-item values, point-in-time safe. (The backend meta provides no coverage window, so none is stated.)",
    freshnessNote: "月頻,隨官方月統計發布更新(有申報落差)。",
    freshnessNoteEn: "Monthly, updated as the official statistic is released (with a reporting lag).",
    sourcePolicyNote: "官方政府統計,來源經濟部統計處(grade=official);非投資建議。",
    sourcePolicyNoteEn: "Official government statistic, sourced from the Department of Statistics, Ministry of Economic Affairs (grade=official); not investment advice.",
    docsHref: "/docs/api/macro/production-value-index-monthly",
    pricingHref: "/pricing",
    keywords: ["製造業生產價值指數", "台灣官方統計", "月統計", "總經數據", "經濟部統計處"],
    keywordsEn: ["the manufacturing production-value index", "Taiwan official statistics", "monthly statistic", "macro data", "government statistics"],
    jsonLdName: "製造業生產價值指數(月)資料集",
    jsonLdNameEn: "Manufacturing Production Value Index (monthly) Dataset",
    jsonLdDescription: "官方每月製造業生產價值指數統計,逐項目值與單位,來源經濟部統計處,point-in-time 安全。",
    jsonLdDescriptionEn: "Official monthly the manufacturing production-value index statistic — per-item values and units from the Department of Statistics, Ministry of Economic Affairs, point-in-time safe.",
    sourceRole: "official_production_value_index_monthly",
    provider: "gov",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "bond-convertible-reference",
    name: "可轉債參考主檔",
    nameEn: "Convertible-Bond Reference (master)",
    seoTitle: "可轉債參考主檔資料集(reference)| TW Market Data",
    seoTitleEn: "Convertible-Bond Reference (master) Dataset (reference) | TW Market Data",
    seoDescription:
      "可轉債參考主檔資料集提供可轉換公司債參考主檔,每列對應一檔可轉債,欄位含 bond_code / market / bond_name / issuer / bond_type / issue_date;資料來源櫃買中心(TPEx)(參考／主檔型)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Convertible-Bond Reference (master) dataset provides convertible-bond reference master — one row per convertible bond, with fields bond_code / market / bond_name / issuer / bond_type / issue_date; sourced from the Taipei Exchange (TPEx) (reference / master). Coverage taken verbatim from the backend meta.",
    shortDescription: "可轉換公司債參考主檔,逐列 債券代碼、市場、債券名稱、發行人、券種、發行日、到期日與票面利率;來源櫃買中心(TPEx)。",
    shortDescriptionEn: "Convertible-bond reference master — per row: bond code, market, bond name, issuer, bond type, issue date, maturity date, and coupon rate; sourced from the Taipei Exchange (TPEx).",
    whatItIs:
      "可轉債參考主檔資料集每一列對應一檔可轉債,欄位包含 bond_code / market / bond_name / issuer / bond_type / issue_date / maturity_date / coupon_rate(債券代碼、市場、債券名稱、發行人、券種、發行日、到期日與票面利率)。資料來源為櫃買中心(TPEx),分級 參考／主檔型。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one convertible bond, carrying bond_code / market / bond_name / issuer / bond_type / issue_date / maturity_date / coupon_rate (bond code, market, bond name, issuer, bond type, issue date, maturity date, and coupon rate). Sourced from the Taipei Exchange (TPEx), graded reference / master. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "以 bond_code 建立可轉債的靜態主檔對照。",
      "串接發行人、到期日與票面利率做條款分析。",
      "作為可轉債價量/法人資料的參考維度表。",
    ],
    useCasesEn: [
      "Build a static master lookup for convertibles keyed on bond_code.",
      "Join issuer, maturity, and coupon for terms analysis.",
      "Use as the reference dimension for convertible price/flow data.",
    ],
    whyItMatters:
      "可轉債條款分散於各次發行公告;此主檔以一致欄位提供代碼、發行人、到期與票息,免逐檔翻查公開說明書。",
    whyItMattersEn:
      "Convertible-bond terms are scattered across per-issue filings; this master serves code, issuer, maturity, and coupon in one consistent shape, removing prospectus lookups.",
    coverageNote:
      "可轉換公司債參考主檔,每列 一檔可轉債,欄位 bond_code / market / bond_name / issuer / bond_type / issue_date;來源櫃買中心(TPEx)(分級 參考／主檔型)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Convertible-bond reference master; one row per convertible bond, fields bond_code / market / bond_name / issuer / bond_type / issue_date; sourced from the Taipei Exchange (TPEx) (graded reference / master). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源櫃買中心(TPEx)(分級 參考／主檔型);非投資建議。",
    sourcePolicyNoteEn: "Sourced from the Taipei Exchange (TPEx) (graded reference / master); not investment advice.",
    docsHref: "/docs/api/derivatives/bond-convertible-reference",
    pricingHref: "/pricing",
    keywords: [
      "可轉債參考主檔",
      "台股資料集",
      "可轉換公司債參考主檔",
      "櫃買中心(TPEx)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Convertible-Bond Reference (master)",
      "Taiwan stock dataset",
      "convertible-bond reference master",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "可轉債參考主檔資料集",
    jsonLdNameEn: "Convertible-Bond Reference (master) Dataset",
    jsonLdDescription: "可轉換公司債參考主檔,來源櫃買中心(TPEx)(參考／主檔型)。",
    jsonLdDescriptionEn: "Convertible-bond reference master, sourced from the Taipei Exchange (TPEx) (reference / master).",
    sourceRole: "reference_bond_convertible_reference",
    provider: "tpex",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "broker-branch-reference",
    name: "券商分點參考主檔",
    nameEn: "Broker-Branch Reference (master)",
    seoTitle: "券商分點參考主檔資料集(reference)| TW Market Data",
    seoTitleEn: "Broker-Branch Reference (master) Dataset (reference) | TW Market Data",
    seoDescription:
      "券商分點參考主檔資料集提供券商總公司與分點對照,每列對應一個券商分點,欄位含 parent_broker_code / parent_broker_name / branch_code / branch_name / market / address;資料來源證交所(TWSE)(參考／主檔型)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Broker-Branch Reference (master) dataset provides broker head-office and branch reference — one row per broker branch, with fields parent_broker_code / parent_broker_name / branch_code / branch_name / market / address; sourced from the TWSE (reference / master). Coverage taken verbatim from the backend meta.",
    shortDescription: "券商總公司與分點對照,逐列 母券商代碼／名稱、分點代碼／名稱、市場、地址與來源標記;來源證交所(TWSE)。",
    shortDescriptionEn: "Broker head-office and branch reference — per row: parent broker code/name, branch code/name, market, address, and source tags; sourced from the TWSE.",
    whatItIs:
      "券商分點參考主檔資料集每一列對應一個券商分點,欄位包含 parent_broker_code / parent_broker_name / branch_code / branch_name / market / address / source_provider / source_role(母券商代碼／名稱、分點代碼／名稱、市場、地址與來源標記)。資料來源為證交所(TWSE),分級 參考／主檔型。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one broker branch, carrying parent_broker_code / parent_broker_name / branch_code / branch_name / market / address / source_provider / source_role (parent broker code/name, branch code/name, market, address, and source tags). Sourced from the TWSE, graded reference / master. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "將分點代碼還原為券商總公司與分點名稱。",
      "作為分點進出(broker-branch)資料的對照維度。",
      "建立券商地理分布與分點清單。",
    ],
    useCasesEn: [
      "Resolve a branch code to its parent broker and branch name.",
      "Use as the dimension table for broker-branch flow data.",
      "Build a broker geographic and branch inventory.",
    ],
    whyItMatters:
      "分點資料只有代碼難以判讀;此主檔提供母券商、分點名稱與地址對照,是分點籌碼分析的必要參考層。",
    whyItMattersEn:
      "Branch data ships only as codes; this master maps parent broker, branch name, and address — the reference layer broker-branch flow analysis needs.",
    coverageNote:
      "券商總公司與分點對照,每列 一個券商分點,欄位 parent_broker_code / parent_broker_name / branch_code / branch_name / market / address;來源證交所(TWSE)(分級 參考／主檔型)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Broker head-office and branch reference; one row per broker branch, fields parent_broker_code / parent_broker_name / branch_code / branch_name / market / address; sourced from the TWSE (graded reference / master). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源證交所(TWSE)(分級 參考／主檔型);非投資建議。",
    sourcePolicyNoteEn: "Sourced from the TWSE (graded reference / master); not investment advice.",
    docsHref: "/docs/api/structure-reference/broker-branch-reference",
    pricingHref: "/pricing",
    keywords: [
      "券商分點參考主檔",
      "台股資料集",
      "券商總公司與分點對照",
      "證交所(TWSE)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Broker-Branch Reference (master)",
      "Taiwan stock dataset",
      "broker head-office and branch reference",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "券商分點參考主檔資料集",
    jsonLdNameEn: "Broker-Branch Reference (master) Dataset",
    jsonLdDescription: "券商總公司與分點對照,來源證交所(TWSE)(參考／主檔型)。",
    jsonLdDescriptionEn: "Broker head-office and branch reference, sourced from the TWSE (reference / master).",
    sourceRole: "reference_broker_branch_reference",
    provider: "twse",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "business-indicator-monthly",
    name: "景氣指標(月)",
    nameEn: "Business Indicator (monthly)",
    seoTitle: "景氣指標(月)資料集(verified)| TW Market Data",
    seoTitleEn: "Business Indicator (monthly) Dataset (verified) | TW Market Data",
    seoDescription:
      "景氣指標(月)資料集提供景氣對策信號與領先／同時指標,每列對應一個月份的一項景氣指標,欄位含 indicator_month / indicator_code / indicator_name / value / value_text / value_numeric;資料來源國家發展委員會(NDC)(官方已驗證)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Business Indicator (monthly) dataset provides the business cycle signal and leading/coincident indicators — one row per business indicator for month, with fields indicator_month / indicator_code / indicator_name / value / value_text / value_numeric; sourced from the National Development Council (NDC) (official, verified). Coverage taken verbatim from the backend meta.",
    shortDescription: "景氣對策信號與領先／同時指標,逐列 指標月份、指標代碼／名稱、數值、文字值、燈號(signal_light)與單位;來源國家發展委員會(NDC)。",
    shortDescriptionEn: "The business cycle signal and leading/coincident indicators — per row: indicator month, indicator code/name, value, text value, signal light, and unit; sourced from the National Development Council (NDC).",
    whatItIs:
      "景氣指標(月)資料集每一列對應一個月份的一項景氣指標,欄位包含 indicator_month / indicator_code / indicator_name / value / value_text / value_numeric / signal_light / unit(指標月份、指標代碼／名稱、數值、文字值、燈號(signal_light)與單位)。資料來源為國家發展委員會(NDC),分級 官方已驗證。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one business indicator for one month, carrying indicator_month / indicator_code / indicator_name / value / value_text / value_numeric / signal_light / unit (indicator month, indicator code/name, value, text value, signal light, and unit). Sourced from the National Development Council (NDC), graded official, verified. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "追蹤景氣對策信號燈號(藍／黃藍／綠／黃紅／紅)。",
      "以領先／同時指標判讀景氣循環位置。",
      "作為總經研究的官方景氣數據層。",
    ],
    useCasesEn: [
      "Track the monitoring-indicator signal light (blue/yellow-blue/green/yellow-red/red).",
      "Read the cycle position from leading/coincident indicators.",
      "Use as the official business-cycle layer for macro research.",
    ],
    whyItMatters:
      "景氣燈號與指標是官方景氣判讀基準;此資料集以結構化欄位提供 NDC 月度指標,免抓官網 PDF。",
    whyItMattersEn:
      "The signal light and indicators are Taiwan's official cycle read; this dataset serves NDC's monthly figures in structured fields, no PDF scraping.",
    coverageNote:
      "景氣對策信號與領先／同時指標,每列 一個月份的一項景氣指標,欄位 indicator_month / indicator_code / indicator_name / value / value_text / value_numeric;來源國家發展委員會(NDC)(分級 官方已驗證)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "The business cycle signal and leading/coincident indicators; one row per business indicator for month, fields indicator_month / indicator_code / indicator_name / value / value_text / value_numeric; sourced from the National Development Council (NDC) (graded official, verified). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源國家發展委員會(NDC)(分級 官方已驗證);非投資建議。",
    sourcePolicyNoteEn: "Sourced from the National Development Council (NDC) (graded official, verified); not investment advice.",
    docsHref: "/docs/api/macro/business-indicator-monthly",
    pricingHref: "/pricing",
    keywords: [
      "景氣指標(月)",
      "台股資料集",
      "景氣對策信號與領先／同時指標",
      "國家發展委員會(NDC)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Business Indicator (monthly)",
      "Taiwan stock dataset",
      "the business cycle signal and leading/coincident indicators",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "景氣指標(月)資料集",
    jsonLdNameEn: "Business Indicator (monthly) Dataset",
    jsonLdDescription: "景氣對策信號與領先／同時指標,來源國家發展委員會(NDC)(官方已驗證)。",
    jsonLdDescriptionEn: "The business cycle signal and leading/coincident indicators, sourced from the National Development Council (NDC) (official, verified).",
    sourceRole: "verified_business_indicator_monthly",
    provider: "ndc",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "capital-formation-events",
    name: "資本形成事件(增／減資)",
    nameEn: "Capital Formation Events",
    seoTitle: "資本形成事件(增／減資)資料集(verified)| TW Market Data",
    seoTitleEn: "Capital Formation Events Dataset (verified) | TW Market Data",
    seoDescription:
      "資本形成事件(增／減資)資料集提供現金增資、減資等資本形成事件,每列對應一個資本形成事件,欄位含 ticker / market / event_date / event_type / event_subtype / announcement_date;資料來源證交所／公開資訊觀測站(TWSE／MOPS)(官方已驗證)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Capital Formation Events dataset provides capital-raising and reduction events — one row per capital-formation event, with fields ticker / market / event_date / event_type / event_subtype / announcement_date; sourced from the TWSE / MOPS (official, verified). Coverage taken verbatim from the backend meta.",
    shortDescription: "現金增資、減資等資本形成事件,逐列 代碼、市場、事件日、事件型別／子型別、公告日、生效日與金額;來源證交所／公開資訊觀測站(TWSE／MOPS)。",
    shortDescriptionEn: "Capital-raising and reduction events — per row: ticker, market, event date, event type/subtype, announcement date, effective date, and amount; sourced from the TWSE / MOPS.",
    whatItIs:
      "資本形成事件(增／減資)資料集每一列對應一個資本形成事件,欄位包含 ticker / market / event_date / event_type / event_subtype / announcement_date / effective_date / cash_amount(代碼、市場、事件日、事件型別／子型別、公告日、生效日與金額)。資料來源為證交所／公開資訊觀測站(TWSE／MOPS),分級 官方已驗證。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one capital-formation event, carrying ticker / market / event_date / event_type / event_subtype / announcement_date / effective_date / cash_amount (ticker, market, event date, event type/subtype, announcement date, effective date, and amount). Sourced from the TWSE / MOPS, graded official, verified. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "追蹤增資／減資事件與生效時程。",
      "以 announcement_date 對齊事件的知識時間做回測。",
      "監控股本變動對每股數據的影響。",
    ],
    useCasesEn: [
      "Track capital increase/reduction events and their effective timeline.",
      "Align backtests to announcement_date as the event's knowledge time.",
      "Monitor share-count changes affecting per-share figures.",
    ],
    whyItMatters:
      "資本形成事件改變股本與每股基準;此資料集以事件型別、公告日與生效日一致呈現,免逐則重大訊息解析。",
    whyItMattersEn:
      "Capital-formation events reset share count and per-share bases; this dataset presents type, announcement, and effective dates consistently, no filing-by-filing parsing.",
    coverageNote:
      "現金增資、減資等資本形成事件,每列 一個資本形成事件,欄位 ticker / market / event_date / event_type / event_subtype / announcement_date;來源證交所／公開資訊觀測站(TWSE／MOPS)(分級 官方已驗證)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Capital-raising and reduction events; one row per capital-formation event, fields ticker / market / event_date / event_type / event_subtype / announcement_date; sourced from the TWSE / MOPS (graded official, verified). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源證交所／公開資訊觀測站(TWSE／MOPS)(分級 官方已驗證);非投資建議。",
    sourcePolicyNoteEn: "Sourced from the TWSE / MOPS (graded official, verified); not investment advice.",
    docsHref: "/docs/api/companies-events/capital-formation-events",
    pricingHref: "/pricing",
    keywords: [
      "資本形成事件(增／減資)",
      "台股資料集",
      "現金增資、減資等資本形成事件",
      "證交所／公開資訊觀測站(TWSE／MOPS)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Capital Formation Events",
      "Taiwan stock dataset",
      "capital-raising and reduction events",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "資本形成事件(增／減資)資料集",
    jsonLdNameEn: "Capital Formation Events Dataset",
    jsonLdDescription: "現金增資、減資等資本形成事件,來源證交所／公開資訊觀測站(TWSE／MOPS)(官方已驗證)。",
    jsonLdDescriptionEn: "Capital-raising and reduction events, sourced from the TWSE / MOPS (official, verified).",
    sourceRole: "verified_capital_formation_events",
    provider: "twse_mops",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "company-risk-events",
    name: "公司風險事件",
    nameEn: "Company Risk Events",
    seoTitle: "公司風險事件資料集(reference)| TW Market Data",
    seoTitleEn: "Company Risk Events Dataset (reference) | TW Market Data",
    seoDescription:
      "公司風險事件資料集提供處置、警示、裁罰等公司風險事件,每列對應一個公司風險事件,欄位含 ticker / market / event_date / event_type / event_subtype / authority;資料來源證交所／櫃買(TWSE／TPEx)(參考／主檔型)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Company Risk Events dataset provides disposition, alert, and penalty risk events — one row per company risk event, with fields ticker / market / event_date / event_type / event_subtype / authority; sourced from the TWSE / TPEx (reference / master). Coverage taken verbatim from the backend meta.",
    shortDescription: "處置、警示、裁罰等公司風險事件,逐列 代碼、市場、事件日、事件型別／子型別、主管機關、摘要與裁罰金額;來源證交所／櫃買(TWSE／TPEx)。",
    shortDescriptionEn: "Disposition, alert, and penalty risk events — per row: ticker, market, event date, event type/subtype, authority, summary, and penalty amount; sourced from the TWSE / TPEx.",
    whatItIs:
      "公司風險事件資料集每一列對應一個公司風險事件,欄位包含 ticker / market / event_date / event_type / event_subtype / authority / summary / penalty_amount(代碼、市場、事件日、事件型別／子型別、主管機關、摘要與裁罰金額)。資料來源為證交所／櫃買(TWSE／TPEx),分級 參考／主檔型。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one company risk event, carrying ticker / market / event_date / event_type / event_subtype / authority / summary / penalty_amount (ticker, market, event date, event type/subtype, authority, summary, and penalty amount). Sourced from the TWSE / TPEx, graded reference / master. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "建立個股風險事件的時間軸與型別分布。",
      "以 authority 與 penalty_amount 評估監理風險。",
      "作為風控與盡職調查的事件資料層。",
    ],
    useCasesEn: [
      "Build a per-stock risk-event timeline and type distribution.",
      "Assess regulatory risk via authority and penalty_amount.",
      "Use as the event layer for risk control and due diligence.",
    ],
    whyItMatters:
      "處置／裁罰資訊散落各公告;此資料集以一致型別與主管機關欄位彙整風險事件,便於風控篩選。",
    whyItMattersEn:
      "Disposition/penalty notices are scattered; this dataset consolidates risk events with consistent type and authority fields for risk screening.",
    coverageNote:
      "處置、警示、裁罰等公司風險事件,每列 一個公司風險事件,欄位 ticker / market / event_date / event_type / event_subtype / authority;來源證交所／櫃買(TWSE／TPEx)(分級 參考／主檔型)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Disposition, alert, and penalty risk events; one row per company risk event, fields ticker / market / event_date / event_type / event_subtype / authority; sourced from the TWSE / TPEx (graded reference / master). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源證交所／櫃買(TWSE／TPEx)(分級 參考／主檔型);非投資建議。",
    sourcePolicyNoteEn: "Sourced from the TWSE / TPEx (graded reference / master); not investment advice.",
    docsHref: "/docs/api/companies-events/company-risk-events",
    pricingHref: "/pricing",
    keywords: [
      "公司風險事件",
      "台股資料集",
      "處置、警示、裁罰等公司風險事件",
      "證交所／櫃買(TWSE／TPEx)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Company Risk Events",
      "Taiwan stock dataset",
      "disposition, alert, and penalty risk events",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "公司風險事件資料集",
    jsonLdNameEn: "Company Risk Events Dataset",
    jsonLdDescription: "處置、警示、裁罰等公司風險事件,來源證交所／櫃買(TWSE／TPEx)(參考／主檔型)。",
    jsonLdDescriptionEn: "Disposition, alert, and penalty risk events, sourced from the TWSE / TPEx (reference / master).",
    sourceRole: "reference_company_risk_events",
    provider: "twse_tpex",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "competitor-fx",
    name: "競貨幣匯率(JPY／KRW／CNY vs TWD)",
    nameEn: "Competitor FX (vs TWD)",
    seoTitle: "競貨幣匯率(JPY／KRW／CNY vs TWD)資料集(derived)| TW Market Data",
    seoTitleEn: "Competitor FX (vs TWD) Dataset (derived) | TW Market Data",
    seoDescription:
      "競貨幣匯率(JPY／KRW／CNY vs TWD)資料集提供日圓／韓元／人民幣對美元及對新臺幣匯率,每列對應一個交易日的競貨幣匯率,欄位含 usd_jpy / usd_krw / usd_cny / usd_twd / jpy_per_twd / krw_per_twd;資料來源中央銀行(CBC)(推導型(由官方資料計算))。以資料基準日為知識時間,point-in-time 安全;coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Competitor FX (vs TWD) dataset provides JPY/KRW/CNY rates vs USD and vs TWD — one row per trading day of competitor FX, with fields usd_jpy / usd_krw / usd_cny / usd_twd / jpy_per_twd / krw_per_twd; sourced from the Central Bank (CBC) (derived (computed from official data)). Keyed on the data as-of date and point-in-time safe; Coverage taken verbatim from the backend meta.",
    shortDescription: "日圓／韓元／人民幣對美元及對新臺幣匯率,逐列 usd_jpy／usd_krw／usd_cny／usd_twd 與換算後的 jpy_per_twd／krw_per_twd／cny_per_twd;來源中央銀行(CBC)。",
    shortDescriptionEn: "Jpy/krw/cny rates vs usd and vs twd — per row: usd_jpy / usd_krw / usd_cny / usd_twd and the derived jpy_per_twd / krw_per_twd / cny_per_twd; sourced from the Central Bank (CBC).",
    whatItIs:
      "競貨幣匯率(JPY／KRW／CNY vs TWD)資料集每一列對應一個交易日的競貨幣匯率,欄位包含 usd_jpy / usd_krw / usd_cny / usd_twd / jpy_per_twd / krw_per_twd / cny_per_twd(usd_jpy／usd_krw／usd_cny／usd_twd 與換算後的 jpy_per_twd／krw_per_twd／cny_per_twd)。資料來源為中央銀行(CBC),分級 推導型(由官方資料計算)。以資料基準日為知識時間,point-in-time 安全;後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one trading day of competitor FX, carrying usd_jpy / usd_krw / usd_cny / usd_twd / jpy_per_twd / krw_per_twd / cny_per_twd (usd_jpy / usd_krw / usd_cny / usd_twd and the derived jpy_per_twd / krw_per_twd / cny_per_twd). Sourced from the Central Bank (CBC), graded derived (computed from official data). Keyed on the data as-of date and point-in-time safe; The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "比較台幣與日韓貨幣的相對強弱(出口競爭力)。",
      "以競貨幣交叉匯率觀察區域競貶壓力。",
      "作為出口導向產業研究的匯率環境層。",
    ],
    useCasesEn: [
      "Compare TWD strength against JPY/KRW (export competitiveness).",
      "Watch regional competitive-devaluation pressure via cross rates.",
      "Use as the FX layer for export-oriented industry research.",
    ],
    whyItMatters:
      "台股出口鏈對競貨幣匯率敏感;此資料集以官方匯率提供競貨幣對台幣交叉匯率,point-in-time 安全,免自行換算。",
    whyItMattersEn:
      "Taiwan's export chain is sensitive to competitor FX; this dataset serves official cross rates vs TWD, point-in-time safe, with no manual conversion.",
    coverageNote:
      "日圓／韓元／人民幣對美元及對新臺幣匯率,每列 一個交易日的競貨幣匯率,欄位 usd_jpy / usd_krw / usd_cny / usd_twd / jpy_per_twd / krw_per_twd;來源中央銀行(CBC)(分級 推導型(由官方資料計算))。以資料基準日為知識時間,point-in-time 安全;(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Jpy/krw/cny rates vs usd and vs twd; one row per trading day of competitor FX, fields usd_jpy / usd_krw / usd_cny / usd_twd / jpy_per_twd / krw_per_twd; sourced from the Central Bank (CBC) (graded derived (computed from official data)). Keyed on the data as-of date and point-in-time safe; (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源中央銀行(CBC)(分級 推導型(由官方資料計算));非投資建議。",
    sourcePolicyNoteEn: "Sourced from the Central Bank (CBC) (graded derived (computed from official data)); not investment advice.",
    docsHref: "/docs/api/macro/competitor-fx",
    pricingHref: "/pricing",
    keywords: [
      "競貨幣匯率(JPY／KRW／CNY vs TWD)",
      "台股資料集",
      "日圓／韓元／人民幣對美元及對新臺幣匯率",
      "中央銀行(CBC)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Competitor FX (vs TWD)",
      "Taiwan stock dataset",
      "JPY/KRW/CNY rates vs USD and vs TWD",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "競貨幣匯率(JPY／KRW／CNY vs TWD)資料集",
    jsonLdNameEn: "Competitor FX (vs TWD) Dataset",
    jsonLdDescription: "日圓／韓元／人民幣對美元及對新臺幣匯率,來源中央銀行(CBC)(推導型(由官方資料計算))。",
    jsonLdDescriptionEn: "Jpy/krw/cny rates vs usd and vs twd, sourced from the Central Bank (CBC) (derived (computed from official data)).",
    sourceRole: "derived_competitor_fx",
    provider: "cbc",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "day-trading-suspension",
    name: "現股當沖暫停",
    nameEn: "Day-Trading Suspension",
    seoTitle: "現股當沖暫停資料集(reference)| TW Market Data",
    seoTitleEn: "Day-Trading Suspension Dataset (reference) | TW Market Data",
    seoDescription:
      "現股當沖暫停資料集提供個股現股當沖暫停期間,每列對應一段當沖暫停期間,欄位含 ticker / market / security_name / suspension_start_date / suspension_end_date / event_indicator;資料來源證交所(TWSE)(參考／主檔型)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Day-Trading Suspension dataset provides per-stock day-trading suspension periods — one row per day-trading suspension period, with fields ticker / market / security_name / suspension_start_date / suspension_end_date / event_indicator; sourced from the TWSE (reference / master). Coverage taken verbatim from the backend meta.",
    shortDescription: "個股現股當沖暫停期間,逐列 代碼、市場、證券名稱、暫停起／迄日、事件旗標與事件名稱;來源證交所(TWSE)。",
    shortDescriptionEn: "Per-stock day-trading suspension periods — per row: ticker, market, security name, suspension start/end date, event indicator, and event name; sourced from the TWSE.",
    whatItIs:
      "現股當沖暫停資料集每一列對應一段當沖暫停期間,欄位包含 ticker / market / security_name / suspension_start_date / suspension_end_date / event_indicator / event_name / source_family(代碼、市場、證券名稱、暫停起／迄日、事件旗標與事件名稱)。資料來源為證交所(TWSE),分級 參考／主檔型。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one day-trading suspension period, carrying ticker / market / security_name / suspension_start_date / suspension_end_date / event_indicator / event_name / source_family (ticker, market, security name, suspension start/end date, event indicator, and event name). Sourced from the TWSE, graded reference / master. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "判斷個股某日是否處於當沖暫停期間。",
      "將當沖暫停納入交易性策略的可交易性過濾。",
      "監控被列入處置／暫停名單的個股。",
    ],
    useCasesEn: [
      "Determine whether a stock was under day-trading suspension on a date.",
      "Add suspension as a tradability filter to intraday strategies.",
      "Monitor stocks placed on disposition/suspension lists.",
    ],
    whyItMatters:
      "當沖暫停直接影響策略可交易性;此資料集以起迄期間一致呈現,免逐日比對處置公告。",
    whyItMattersEn:
      "Suspension directly gates strategy tradability; this dataset presents start/end periods consistently, no daily cross-check of disposition notices.",
    coverageNote:
      "個股現股當沖暫停期間,每列 一段當沖暫停期間,欄位 ticker / market / security_name / suspension_start_date / suspension_end_date / event_indicator;來源證交所(TWSE)(分級 參考／主檔型)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Per-stock day-trading suspension periods; one row per day-trading suspension period, fields ticker / market / security_name / suspension_start_date / suspension_end_date / event_indicator; sourced from the TWSE (graded reference / master). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源證交所(TWSE)(分級 參考／主檔型);非投資建議。",
    sourcePolicyNoteEn: "Sourced from the TWSE (graded reference / master); not investment advice.",
    docsHref: "/docs/api/capital-flows/day-trading-suspension",
    pricingHref: "/pricing",
    keywords: [
      "現股當沖暫停",
      "台股資料集",
      "個股現股當沖暫停期間",
      "證交所(TWSE)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Day-Trading Suspension",
      "Taiwan stock dataset",
      "per-stock day-trading suspension periods",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "現股當沖暫停資料集",
    jsonLdNameEn: "Day-Trading Suspension Dataset",
    jsonLdDescription: "個股現股當沖暫停期間,來源證交所(TWSE)(參考／主檔型)。",
    jsonLdDescriptionEn: "Per-stock day-trading suspension periods, sourced from the TWSE (reference / master).",
    sourceRole: "reference_day_trading_suspension",
    provider: "twse",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "etf-holdings",
    name: "ETF 持股明細",
    nameEn: "ETF Holdings",
    seoTitle: "ETF 持股明細資料集(reference)| TW Market Data",
    seoTitleEn: "ETF Holdings Dataset (reference) | TW Market Data",
    seoDescription:
      "ETF 持股明細資料集提供ETF 成分持股與權重,每列對應一檔 ETF 的一筆持股,欄位含 etf_code / etf_name / issuer / market / as_of_date / holding_ticker;資料來源各 ETF 發行人(參考／主檔型)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The ETF Holdings dataset provides ETF constituent holdings and weights — one row per holding of ETF, with fields etf_code / etf_name / issuer / market / as_of_date / holding_ticker; sourced from ETF issuers (reference / master). Coverage taken verbatim from the backend meta.",
    shortDescription: "ETF 成分持股與權重,逐列 ETF 代碼／名稱、發行人、市場、資料基準日、持股代碼／名稱與權重;來源各 ETF 發行人。",
    shortDescriptionEn: "Etf constituent holdings and weights — per row: ETF code/name, issuer, market, as-of date, holding ticker/name, and weight; sourced from ETF issuers.",
    whatItIs:
      "ETF 持股明細資料集每一列對應一檔 ETF 的一筆持股,欄位包含 etf_code / etf_name / issuer / market / as_of_date / holding_ticker / holding_name / holding_weight(ETF 代碼／名稱、發行人、市場、資料基準日、持股代碼／名稱與權重)。資料來源為各 ETF 發行人,分級 參考／主檔型。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one holding of one ETF, carrying etf_code / etf_name / issuer / market / as_of_date / holding_ticker / holding_name / holding_weight (ETF code/name, issuer, market, as-of date, holding ticker/name, and weight). Sourced from ETF issuers, graded reference / master. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "拆解 ETF 的成分持股與權重分布。",
      "以 holding_ticker 反查個股被哪些 ETF 持有。",
      "建立 ETF 重疊度與集中度分析。",
    ],
    useCasesEn: [
      "Decompose an ETF into its constituent holdings and weights.",
      "Reverse-look which ETFs hold a given stock via holding_ticker.",
      "Build ETF overlap and concentration analysis.",
    ],
    whyItMatters:
      "ETF 持股揭露格式各發行人不一;此資料集以一致欄位(as_of_date + 權重)提供成分明細,免逐家發行人抓檔。",
    whyItMattersEn:
      "ETF holdings disclosures vary by issuer; this dataset serves constituents in one shape (as_of_date + weight), no per-issuer scraping.",
    coverageNote:
      "ETF 成分持股與權重,每列 一檔 ETF 的一筆持股,欄位 etf_code / etf_name / issuer / market / as_of_date / holding_ticker;來源各 ETF 發行人(分級 參考／主檔型)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Etf constituent holdings and weights; one row per holding of ETF, fields etf_code / etf_name / issuer / market / as_of_date / holding_ticker; sourced from ETF issuers (graded reference / master). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源各 ETF 發行人(分級 參考／主檔型);非投資建議。",
    sourcePolicyNoteEn: "Sourced from ETF issuers (graded reference / master); not investment advice.",
    docsHref: "/docs/api/funds-intel/etf-holdings",
    pricingHref: "/pricing",
    keywords: [
      "ETF 持股明細",
      "台股資料集",
      "ETF 成分持股與權重",
      "各 ETF 發行人",
      "TW Market Data",
    ],
    keywordsEn: [
      "ETF Holdings",
      "Taiwan stock dataset",
      "ETF constituent holdings and weights",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "ETF 持股明細資料集",
    jsonLdNameEn: "ETF Holdings Dataset",
    jsonLdDescription: "ETF 成分持股與權重,來源各 ETF 發行人(參考／主檔型)。",
    jsonLdDescriptionEn: "Etf constituent holdings and weights, sourced from ETF issuers (reference / master).",
    sourceRole: "reference_etf_holdings",
    provider: "issuer",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "fund-etf-metadata",
    name: "基金／ETF 主檔",
    nameEn: "Fund / ETF Metadata",
    seoTitle: "基金／ETF 主檔資料集(reference)| TW Market Data",
    seoTitleEn: "Fund / ETF Metadata Dataset (reference) | TW Market Data",
    seoDescription:
      "基金／ETF 主檔資料集提供基金與 ETF 的靜態主檔,每列對應一檔基金／ETF,欄位含 fund_code / market / fund_name / issuer / listing_date / fund_type;資料來源各基金／ETF 發行人(參考／主檔型)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Fund / ETF Metadata dataset provides the fund and ETF static master — one row per fund / ETF, with fields fund_code / market / fund_name / issuer / listing_date / fund_type; sourced from fund / ETF issuers (reference / master). Coverage taken verbatim from the backend meta.",
    shortDescription: "基金與 ETF 的靜態主檔,逐列 基金代碼、市場、名稱、發行人、上市日、基金型別、追蹤指數與計價幣別;來源各基金／ETF 發行人。",
    shortDescriptionEn: "The fund and etf static master — per row: fund code, market, name, issuer, listing date, fund type, underlying index, and currency; sourced from fund / ETF issuers.",
    whatItIs:
      "基金／ETF 主檔資料集每一列對應一檔基金／ETF,欄位包含 fund_code / market / fund_name / issuer / listing_date / fund_type / underlying_index / currency(基金代碼、市場、名稱、發行人、上市日、基金型別、追蹤指數與計價幣別)。資料來源為各基金／ETF 發行人,分級 參考／主檔型。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one fund / ETF, carrying fund_code / market / fund_name / issuer / listing_date / fund_type / underlying_index / currency (fund code, market, name, issuer, listing date, fund type, underlying index, and currency). Sourced from fund / ETF issuers, graded reference / master. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "以 fund_code 建立基金／ETF 的靜態對照。",
      "依 fund_type 與 underlying_index 篩選標的。",
      "作為 ETF 持股／淨值資料的主檔維度。",
    ],
    useCasesEn: [
      "Build a static fund/ETF lookup keyed on fund_code.",
      "Filter by fund_type and underlying_index.",
      "Use as the master dimension for ETF holdings/NAV data.",
    ],
    whyItMatters:
      "基金／ETF 屬性分散各發行人;此主檔以一致欄位提供型別、追蹤指數與幣別,是基金分析的參考層。",
    whyItMattersEn:
      "Fund/ETF attributes are spread across issuers; this master serves type, index, and currency consistently — the reference layer for fund analysis.",
    coverageNote:
      "基金與 ETF 的靜態主檔,每列 一檔基金／ETF,欄位 fund_code / market / fund_name / issuer / listing_date / fund_type;來源各基金／ETF 發行人(分級 參考／主檔型)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "The fund and etf static master; one row per fund / ETF, fields fund_code / market / fund_name / issuer / listing_date / fund_type; sourced from fund / ETF issuers (graded reference / master). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源各基金／ETF 發行人(分級 參考／主檔型);非投資建議。",
    sourcePolicyNoteEn: "Sourced from fund / ETF issuers (graded reference / master); not investment advice.",
    docsHref: "/docs/api/funds-intel/fund-etf-metadata",
    pricingHref: "/pricing",
    keywords: [
      "基金／ETF 主檔",
      "台股資料集",
      "基金與 ETF 的靜態主檔",
      "各基金／ETF 發行人",
      "TW Market Data",
    ],
    keywordsEn: [
      "Fund / ETF Metadata",
      "Taiwan stock dataset",
      "the fund and ETF static master",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "基金／ETF 主檔資料集",
    jsonLdNameEn: "Fund / ETF Metadata Dataset",
    jsonLdDescription: "基金與 ETF 的靜態主檔,來源各基金／ETF 發行人(參考／主檔型)。",
    jsonLdDescriptionEn: "The fund and etf static master, sourced from fund / ETF issuers (reference / master).",
    sourceRole: "reference_fund_etf_metadata",
    provider: "issuer",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "futures-daily-context",
    name: "期貨日情境(基差／近月／法人 OI)",
    nameEn: "Futures Daily Context",
    seoTitle: "期貨日情境(基差／近月／法人 OI)資料集(derived)| TW Market Data",
    seoTitleEn: "Futures Daily Context Dataset (derived) | TW Market Data",
    seoDescription:
      "期貨日情境(基差／近月／法人 OI)資料集提供期貨收盤、現貨、基差與未平倉的每日情境,每列對應一個交易日的期貨情境,欄位含 futures_close / spot_close / basis / basis_pct / open_interest / oi_delta;資料來源期交所(TAIFEX)(推導型(由官方資料計算))。以資料基準日為知識時間,point-in-time 安全;coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Futures Daily Context dataset provides daily futures close, spot, basis, and open-interest context — one row per trading day of futures context, with fields futures_close / spot_close / basis / basis_pct / open_interest / oi_delta; sourced from the TAIFEX (derived (computed from official data)). Keyed on the data as-of date and point-in-time safe; Coverage taken verbatim from the backend meta.",
    shortDescription: "期貨收盤、現貨、基差與未平倉的每日情境,逐列 期貨收盤、現貨收盤、基差、基差百分比、未平倉、OI 變動、距結算天數與結算旗標;來源期交所(TAIFEX)。",
    shortDescriptionEn: "Daily futures close, spot, basis, and open-interest context — per row: futures close, spot close, basis, basis %, open interest, OI change, days-to-settlement, and settlement flag; sourced from the TAIFEX.",
    whatItIs:
      "期貨日情境(基差／近月／法人 OI)資料集每一列對應一個交易日的期貨情境,欄位包含 futures_close / spot_close / basis / basis_pct / open_interest / oi_delta / days_to_settlement / settlement_flag(期貨收盤、現貨收盤、基差、基差百分比、未平倉、OI 變動、距結算天數與結算旗標)。資料來源為期交所(TAIFEX),分級 推導型(由官方資料計算)。以資料基準日為知識時間,point-in-time 安全;後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one trading day of futures context, carrying futures_close / spot_close / basis / basis_pct / open_interest / oi_delta / days_to_settlement / settlement_flag (futures close, spot close, basis, basis %, open interest, OI change, days-to-settlement, and settlement flag). Sourced from the TAIFEX, graded derived (computed from official data). Keyed on the data as-of date and point-in-time safe; The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "以基差(basis／basis_pct)判讀多空與轉倉成本。",
      "結合 OI 變動觀察部位堆疊與結算效應。",
      "將距結算天數納入到期日附近的策略。",
    ],
    useCasesEn: [
      "Read positioning and roll cost via basis / basis_pct.",
      "Watch position build-up and settlement effects via OI change.",
      "Factor days-to-settlement into expiry-window strategies.",
    ],
    whyItMatters:
      "基差與 OI 分散於多份期交所報表;此資料集以一日一列彙整期貨情境,point-in-time 安全,免自行對齊多源。",
    whyItMattersEn:
      "Basis and OI live across multiple TAIFEX reports; this dataset consolidates futures context one row per day, point-in-time safe.",
    coverageNote:
      "期貨收盤、現貨、基差與未平倉的每日情境,每列 一個交易日的期貨情境,欄位 futures_close / spot_close / basis / basis_pct / open_interest / oi_delta;來源期交所(TAIFEX)(分級 推導型(由官方資料計算))。以資料基準日為知識時間,point-in-time 安全;(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Daily futures close, spot, basis, and open-interest context; one row per trading day of futures context, fields futures_close / spot_close / basis / basis_pct / open_interest / oi_delta; sourced from the TAIFEX (graded derived (computed from official data)). Keyed on the data as-of date and point-in-time safe; (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源期交所(TAIFEX)(分級 推導型(由官方資料計算));非投資建議。",
    sourcePolicyNoteEn: "Sourced from the TAIFEX (graded derived (computed from official data)); not investment advice.",
    docsHref: "/docs/api/derivatives/futures-daily-context",
    pricingHref: "/pricing",
    keywords: [
      "期貨日情境(基差／近月／法人 OI)",
      "台股資料集",
      "期貨收盤、現貨、基差與未平倉的每日情境",
      "期交所(TAIFEX)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Futures Daily Context",
      "Taiwan stock dataset",
      "daily futures close, spot, basis, and open-interest context",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "期貨日情境(基差／近月／法人 OI)資料集",
    jsonLdNameEn: "Futures Daily Context Dataset",
    jsonLdDescription: "期貨收盤、現貨、基差與未平倉的每日情境,來源期交所(TAIFEX)(推導型(由官方資料計算))。",
    jsonLdDescriptionEn: "Daily futures close, spot, basis, and open-interest context, sourced from the TAIFEX (derived (computed from official data)).",
    sourceRole: "derived_futures_daily_context",
    provider: "taifex",
    marketScope: "TWSE",
  },
  {
    slug: "industry-chain",
    name: "產業價值鏈成員",
    nameEn: "Industry Value-Chain Membership",
    seoTitle: "產業價值鏈成員資料集(reference)| TW Market Data",
    seoTitleEn: "Industry Value-Chain Membership Dataset (reference) | TW Market Data",
    seoDescription:
      "產業價值鏈成員資料集提供個股在產業價值鏈中的節點歸屬,每列對應一個個股-鏈節點歸屬,欄位含 ticker / chain_name / node_name / node_position / market / capture_date;資料來源櫃買中心(TPEx)產業價值鏈(參考／主檔型)。以資料基準日為知識時間,point-in-time 安全;coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Industry Value-Chain Membership dataset provides a stock's node membership in industry value chains — one row per stock-to-chain-node membership, with fields ticker / chain_name / node_name / node_position / market / capture_date; sourced from the TPEx industry value-chain (reference / master). Keyed on the data as-of date and point-in-time safe; Coverage taken verbatim from the backend meta.",
    shortDescription: "個股在產業價值鏈中的節點歸屬,逐列 代碼、價值鏈名稱、節點名稱、節點位置(上／中／下游)、市場與擷取日;來源櫃買中心(TPEx)產業價值鏈。",
    shortDescriptionEn: "A stock's node membership in industry value chains — per row: ticker, chain name, node name, node position (up/mid/downstream), market, and capture date; sourced from the TPEx industry value-chain.",
    whatItIs:
      "產業價值鏈成員資料集每一列對應一個個股-鏈節點歸屬,欄位包含 ticker / chain_name / node_name / node_position / market / capture_date(代碼、價值鏈名稱、節點名稱、節點位置(上／中／下游)、市場與擷取日)。資料來源為櫃買中心(TPEx)產業價值鏈,分級 參考／主檔型。以資料基準日為知識時間,point-in-time 安全;後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one stock-to-chain-node membership, carrying ticker / chain_name / node_name / node_position / market / capture_date (ticker, chain name, node name, node position (up/mid/downstream), market, and capture date). Sourced from the TPEx industry value-chain, graded reference / master. Keyed on the data as-of date and point-in-time safe; The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "以價值鏈節點建立產業上中下游對照。",
      "反查某節點(如晶圓代工)的成員個股。",
      "做供應鏈與題材輪動的結構分析。",
    ],
    useCasesEn: [
      "Map upstream/mid/downstream via value-chain nodes.",
      "Reverse-look member stocks of a node (e.g. foundry).",
      "Analyze supply chains and thematic rotation structurally.",
    ],
    whyItMatters:
      "產業鏈歸屬是題材與供應鏈分析的骨架;此資料集以節點位置一致呈現成員關係,point-in-time 安全。",
    whyItMattersEn:
      "Value-chain membership is the backbone of thematic and supply-chain work; this dataset presents node positions consistently, point-in-time safe.",
    coverageNote:
      "個股在產業價值鏈中的節點歸屬,每列 一個個股-鏈節點歸屬,欄位 ticker / chain_name / node_name / node_position / market / capture_date;來源櫃買中心(TPEx)產業價值鏈(分級 參考／主檔型)。以資料基準日為知識時間,point-in-time 安全;(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "A stock's node membership in industry value chains; one row per stock-to-chain-node membership, fields ticker / chain_name / node_name / node_position / market / capture_date; sourced from the TPEx industry value-chain (graded reference / master). Keyed on the data as-of date and point-in-time safe; (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源櫃買中心(TPEx)產業價值鏈(分級 參考／主檔型);非投資建議。",
    sourcePolicyNoteEn: "Sourced from the TPEx industry value-chain (graded reference / master); not investment advice.",
    docsHref: "/docs/api/structure-reference/industry-chain",
    pricingHref: "/pricing",
    keywords: [
      "產業價值鏈成員",
      "台股資料集",
      "個股在產業價值鏈中的節點歸屬",
      "櫃買中心(TPEx)產業價值鏈",
      "TW Market Data",
    ],
    keywordsEn: [
      "Industry Value-Chain Membership",
      "Taiwan stock dataset",
      "a stock's node membership in industry value chains",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "產業價值鏈成員資料集",
    jsonLdNameEn: "Industry Value-Chain Membership Dataset",
    jsonLdDescription: "個股在產業價值鏈中的節點歸屬,來源櫃買中心(TPEx)產業價值鏈(參考／主檔型)。",
    jsonLdDescriptionEn: "A stock's node membership in industry value chains, sourced from the TPEx industry value-chain (reference / master).",
    sourceRole: "reference_industry_chain",
    provider: "tpex",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "insider-director-holdings",
    name: "董監持股",
    nameEn: "Insider & Director Holdings",
    seoTitle: "董監持股資料集(verified)| TW Market Data",
    seoTitleEn: "Insider & Director Holdings Dataset (verified) | TW Market Data",
    seoDescription:
      "董監持股資料集提供董事、監察人與內部人持股,每列對應一位持有人的一筆持股揭露,欄位含 ticker / market / source_as_of_date / holder_name / holder_role / holder_category;資料來源公開資訊觀測站(MOPS)(官方已驗證)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Insider & Director Holdings dataset provides director, supervisor, and insider holdings — one row per holder's holdings disclosure, with fields ticker / market / source_as_of_date / holder_name / holder_role / holder_category; sourced from MOPS (official, verified). Coverage taken verbatim from the backend meta.",
    shortDescription: "董事、監察人與內部人持股,逐列 代碼、市場、資料基準日、持有人姓名、角色、類別、持股數與持股比率;來源公開資訊觀測站(MOPS)。",
    shortDescriptionEn: "Director, supervisor, and insider holdings — per row: ticker, market, as-of date, holder name, role, category, holding shares, and holding ratio; sourced from MOPS.",
    whatItIs:
      "董監持股資料集每一列對應一位持有人的一筆持股揭露,欄位包含 ticker / market / source_as_of_date / holder_name / holder_role / holder_category / holding_shares / holding_ratio(代碼、市場、資料基準日、持有人姓名、角色、類別、持股數與持股比率)。資料來源為公開資訊觀測站(MOPS),分級 官方已驗證。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one holder's holdings disclosure, carrying ticker / market / source_as_of_date / holder_name / holder_role / holder_category / holding_shares / holding_ratio (ticker, market, as-of date, holder name, role, category, holding shares, and holding ratio). Sourced from MOPS, graded official, verified. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "追蹤董監與內部人持股比率變化。",
      "以 holder_role 區分董事／監察人／經理人持股。",
      "監控內部人持股集中度與質押觀察前置。",
    ],
    useCasesEn: [
      "Track director/insider holding-ratio changes.",
      "Split holdings by holder_role (director/supervisor/manager).",
      "Monitor insider concentration as a governance signal.",
    ],
    whyItMatters:
      "董監持股是治理與內部人訊號的核心;此資料集以基準日與比率一致呈現,免逐月抓 MOPS 申報。",
    whyItMattersEn:
      "Insider holdings are a core governance signal; this dataset presents as-of date and ratio consistently, no monthly MOPS scraping.",
    coverageNote:
      "董事、監察人與內部人持股,每列 一位持有人的一筆持股揭露,欄位 ticker / market / source_as_of_date / holder_name / holder_role / holder_category;來源公開資訊觀測站(MOPS)(分級 官方已驗證)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Director, supervisor, and insider holdings; one row per holder's holdings disclosure, fields ticker / market / source_as_of_date / holder_name / holder_role / holder_category; sourced from MOPS (graded official, verified). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源公開資訊觀測站(MOPS)(分級 官方已驗證);非投資建議。",
    sourcePolicyNoteEn: "Sourced from MOPS (graded official, verified); not investment advice.",
    docsHref: "/docs/api/capital-flows/insider-director-holdings",
    pricingHref: "/pricing",
    keywords: [
      "董監持股",
      "台股資料集",
      "董事、監察人與內部人持股",
      "公開資訊觀測站(MOPS)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Insider & Director Holdings",
      "Taiwan stock dataset",
      "director, supervisor, and insider holdings",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "董監持股資料集",
    jsonLdNameEn: "Insider & Director Holdings Dataset",
    jsonLdDescription: "董事、監察人與內部人持股,來源公開資訊觀測站(MOPS)(官方已驗證)。",
    jsonLdDescriptionEn: "Director, supervisor, and insider holdings, sourced from MOPS (official, verified).",
    sourceRole: "verified_insider_director_holdings",
    provider: "mops",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "macro-global",
    name: "全球總經",
    nameEn: "Global Macro",
    seoTitle: "全球總經資料集(verified)| TW Market Data",
    seoTitleEn: "Global Macro Dataset (verified) | TW Market Data",
    seoDescription:
      "全球總經資料集提供全球利率、匯率、物價等總經時間序列,每列對應一個序列的一個觀測值,欄位含 series_id / series_name / obs_date / value / unit / freq;資料來源國際官方統計來源(如 FRED)(官方已驗證)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Global Macro dataset provides global rate, FX, and price macro series — one row per observation of series, with fields series_id / series_name / obs_date / value / unit / freq; sourced from official international sources (e.g. FRED) (official, verified). Coverage taken verbatim from the backend meta.",
    shortDescription: "全球利率、匯率、物價等總經時間序列,逐列 序列代碼／名稱、觀測日、數值、單位、頻率、來源群組與釋出角色;來源國際官方統計來源(如 FRED)。",
    shortDescriptionEn: "Global rate, fx, and price macro series — per row: series id/name, observation date, value, unit, frequency, source group, and release role; sourced from official international sources (e.g. FRED).",
    whatItIs:
      "全球總經資料集每一列對應一個序列的一個觀測值,欄位包含 series_id / series_name / obs_date / value / unit / freq / source_group / release_role(序列代碼／名稱、觀測日、數值、單位、頻率、來源群組與釋出角色)。資料來源為國際官方統計來源(如 FRED),分級 官方已驗證。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one observation of one series, carrying series_id / series_name / obs_date / value / unit / freq / source_group / release_role (series id/name, observation date, value, unit, frequency, source group, and release role). Sourced from official international sources (e.g. FRED), graded official, verified. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "以 series_id 取全球總經序列(利率／匯率／物價)。",
      "對齊 obs_date 做跨國總經比較。",
      "作為台股總經連動分析的外部變數層。",
    ],
    useCasesEn: [
      "Pull global macro series (rates/FX/prices) by series_id.",
      "Align on obs_date for cross-country macro comparison.",
      "Use as the external-variable layer for macro linkage.",
    ],
    whyItMatters:
      "全球總經序列來源與頻率不一;此資料集以一致 series 結構彙整,免各官網逐一抓取解析。",
    whyItMattersEn:
      "Global macro series vary by source and frequency; this dataset unifies them in one series shape, no site-by-site scraping.",
    coverageNote:
      "全球利率、匯率、物價等總經時間序列,每列 一個序列的一個觀測值,欄位 series_id / series_name / obs_date / value / unit / freq;來源國際官方統計來源(如 FRED)(分級 官方已驗證)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Global rate, fx, and price macro series; one row per observation of series, fields series_id / series_name / obs_date / value / unit / freq; sourced from official international sources (e.g. FRED) (graded official, verified). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源國際官方統計來源(如 FRED)(分級 官方已驗證);非投資建議。",
    sourcePolicyNoteEn: "Sourced from official international sources (e.g. FRED) (graded official, verified); not investment advice.",
    docsHref: "/docs/api/macro/macro-global",
    pricingHref: "/pricing",
    keywords: [
      "全球總經",
      "台股資料集",
      "全球利率、匯率、物價等總經時間序列",
      "國際官方統計來源(如 FRED)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Global Macro",
      "Taiwan stock dataset",
      "global rate, FX, and price macro series",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "全球總經資料集",
    jsonLdNameEn: "Global Macro Dataset",
    jsonLdDescription: "全球利率、匯率、物價等總經時間序列,來源國際官方統計來源(如 FRED)(官方已驗證)。",
    jsonLdDescriptionEn: "Global rate, fx, and price macro series, sourced from official international sources (e.g. FRED) (official, verified).",
    sourceRole: "verified_macro_global",
    provider: "intl",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "macro-worldbank",
    name: "世界銀行總經",
    nameEn: "World Bank Macro",
    seoTitle: "世界銀行總經資料集(verified)| TW Market Data",
    seoTitleEn: "World Bank Macro Dataset (verified) | TW Market Data",
    seoDescription:
      "世界銀行總經資料集提供世界銀行各國年度總經指標,每列對應一國一指標一年的觀測值,欄位含 country_iso / country_name / indicator_code / indicator_name / year / value;資料來源世界銀行(World Bank)(官方已驗證)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The World Bank Macro dataset provides World Bank annual macro indicators by country — one row per country-indicator-year observation, with fields country_iso / country_name / indicator_code / indicator_name / year / value; sourced from the World Bank (official, verified). Coverage taken verbatim from the backend meta.",
    shortDescription: "世界銀行各國年度總經指標,逐列 國別 ISO／名稱、指標代碼／名稱、年度、數值、來源群組與授權;來源世界銀行(World Bank)。",
    shortDescriptionEn: "World bank annual macro indicators by country — per row: country ISO/name, indicator code/name, year, value, source group, and license; sourced from the World Bank.",
    whatItIs:
      "世界銀行總經資料集每一列對應一國一指標一年的觀測值,欄位包含 country_iso / country_name / indicator_code / indicator_name / year / value / source_group / license(國別 ISO／名稱、指標代碼／名稱、年度、數值、來源群組與授權)。資料來源為世界銀行(World Bank),分級 官方已驗證。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one country-indicator-year observation, carrying country_iso / country_name / indicator_code / indicator_name / year / value / source_group / license (country ISO/name, indicator code/name, year, value, source group, and license). Sourced from the World Bank, graded official, verified. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "以指標代碼取各國年度總經數據做跨國比較。",
      "建立台灣 vs 競爭國的長期結構對照。",
      "作為總經研究的官方跨國資料層。",
    ],
    useCasesEn: [
      "Pull annual country indicators by code for cross-country comparison.",
      "Build long-run Taiwan-vs-peers structural views.",
      "Use as the official cross-country layer for macro research.",
    ],
    whyItMatters:
      "世界銀行資料 API 分散;此資料集以一致國別-指標-年度結構提供,附授權欄位,免自行整併。",
    whyItMattersEn:
      "World Bank data spans many API calls; this dataset serves it in one country-indicator-year shape with license fields, no manual assembly.",
    coverageNote:
      "世界銀行各國年度總經指標,每列 一國一指標一年的觀測值,欄位 country_iso / country_name / indicator_code / indicator_name / year / value;來源世界銀行(World Bank)(分級 官方已驗證)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "World bank annual macro indicators by country; one row per country-indicator-year observation, fields country_iso / country_name / indicator_code / indicator_name / year / value; sourced from the World Bank (graded official, verified). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源世界銀行(World Bank)(分級 官方已驗證);非投資建議。",
    sourcePolicyNoteEn: "Sourced from the World Bank (graded official, verified); not investment advice.",
    docsHref: "/docs/api/macro/macro-worldbank",
    pricingHref: "/pricing",
    keywords: [
      "世界銀行總經",
      "台股資料集",
      "世界銀行各國年度總經指標",
      "世界銀行(World Bank)",
      "TW Market Data",
    ],
    keywordsEn: [
      "World Bank Macro",
      "Taiwan stock dataset",
      "World Bank annual macro indicators by country",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "世界銀行總經資料集",
    jsonLdNameEn: "World Bank Macro Dataset",
    jsonLdDescription: "世界銀行各國年度總經指標,來源世界銀行(World Bank)(官方已驗證)。",
    jsonLdDescriptionEn: "World bank annual macro indicators by country, sourced from the World Bank (official, verified).",
    sourceRole: "verified_macro_worldbank",
    provider: "worldbank",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "major-event-taxonomy",
    name: "重大訊息事件分類",
    nameEn: "Major Event Taxonomy",
    seoTitle: "重大訊息事件分類資料集(reference)| TW Market Data",
    seoTitleEn: "Major Event Taxonomy Dataset (reference) | TW Market Data",
    seoDescription:
      "重大訊息事件分類資料集提供重大訊息的事件分類標記,每列對應一則被分類的重大訊息,欄位含 event_class / subject / event_time / confidence / rule_version;資料來源公開資訊觀測站(MOPS)重大訊息(參考／主檔型)。以資料基準日為知識時間,point-in-time 安全;coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Major Event Taxonomy dataset provides a classification taxonomy over material announcements — one row per classified material announcement, with fields event_class / subject / event_time / confidence / rule_version; sourced from MOPS material announcements (reference / master). Keyed on the data as-of date and point-in-time safe; Coverage taken verbatim from the backend meta.",
    shortDescription: "重大訊息的事件分類標記,逐列 事件類別、主體、事件時間、信心值(confidence)與規則版本(rule_version);來源公開資訊觀測站(MOPS)重大訊息。",
    shortDescriptionEn: "A classification taxonomy over material announcements — per row: event class, subject, event time, confidence, and rule version; sourced from MOPS material announcements.",
    whatItIs:
      "重大訊息事件分類資料集每一列對應一則被分類的重大訊息,欄位包含 event_class / subject / event_time / confidence / rule_version(事件類別、主體、事件時間、信心值(confidence)與規則版本(rule_version))。資料來源為公開資訊觀測站(MOPS)重大訊息,分級 參考／主檔型。以資料基準日為知識時間,point-in-time 安全;後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one classified material announcement, carrying event_class / subject / event_time / confidence / rule_version (event class, subject, event time, confidence, and rule version). Sourced from MOPS material announcements, graded reference / master. Keyed on the data as-of date and point-in-time safe; The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "以 event_class 將重大訊息歸類成可分析事件流。",
      "用 confidence 過濾分類可信度。",
      "以 rule_version 追蹤分類規則沿革做可重現分析。",
    ],
    useCasesEn: [
      "Group material announcements into an analyzable event stream via event_class.",
      "Filter by confidence for classification reliability.",
      "Track rule_version for reproducible, versioned classification.",
    ],
    whyItMatters:
      "重大訊息是自由文字難以彙總;此資料集以規則化分類(附信心值與規則版本)結構化事件,point-in-time 安全。",
    whyItMattersEn:
      "Material announcements are free text; this dataset structures them via a versioned taxonomy with confidence, point-in-time safe.",
    coverageNote:
      "重大訊息的事件分類標記,每列 一則被分類的重大訊息,欄位 event_class / subject / event_time / confidence / rule_version;來源公開資訊觀測站(MOPS)重大訊息(分級 參考／主檔型)。以資料基準日為知識時間,point-in-time 安全;(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "A classification taxonomy over material announcements; one row per classified material announcement, fields event_class / subject / event_time / confidence / rule_version; sourced from MOPS material announcements (graded reference / master). Keyed on the data as-of date and point-in-time safe; (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源公開資訊觀測站(MOPS)重大訊息(分級 參考／主檔型);非投資建議。",
    sourcePolicyNoteEn: "Sourced from MOPS material announcements (graded reference / master); not investment advice.",
    docsHref: "/docs/api/companies-events/major-event-taxonomy",
    pricingHref: "/pricing",
    keywords: [
      "重大訊息事件分類",
      "台股資料集",
      "重大訊息的事件分類標記",
      "公開資訊觀測站(MOPS)重大訊息",
      "TW Market Data",
    ],
    keywordsEn: [
      "Major Event Taxonomy",
      "Taiwan stock dataset",
      "a classification taxonomy over material announcements",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "重大訊息事件分類資料集",
    jsonLdNameEn: "Major Event Taxonomy Dataset",
    jsonLdDescription: "重大訊息的事件分類標記,來源公開資訊觀測站(MOPS)重大訊息(參考／主檔型)。",
    jsonLdDescriptionEn: "A classification taxonomy over material announcements, sourced from MOPS material announcements (reference / master).",
    sourceRole: "reference_major_event_taxonomy",
    provider: "mops",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "margin-system-stats",
    name: "信用交易系統統計",
    nameEn: "Margin System Statistics",
    seoTitle: "信用交易系統統計資料集(derived)| TW Market Data",
    seoTitleEn: "Margin System Statistics Dataset (derived) | TW Market Data",
    seoDescription:
      "信用交易系統統計資料集提供全市場融資融券系統彙總統計,每列對應一個交易日的系統統計,欄位含 margin_purchase_balance_total / short_sale_balance_total / short_to_margin_balance_ratio / margin_net_flow / maintenance_ratio;資料來源證交所(TWSE)(推導型(由官方資料計算))。以資料基準日為知識時間,point-in-time 安全;coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Margin System Statistics dataset provides market-wide margin and short-sale system statistics — one row per trading day of system statistics, with fields margin_purchase_balance_total / short_sale_balance_total / short_to_margin_balance_ratio / margin_net_flow / maintenance_ratio; sourced from the TWSE (derived (computed from official data)). Keyed on the data as-of date and point-in-time safe; Coverage taken verbatim from the backend meta.",
    shortDescription: "全市場融資融券系統彙總統計,逐列 融資餘額總額、融券餘額總額、券資比、融資淨流與整體維持率;來源證交所(TWSE)。",
    shortDescriptionEn: "Market-wide margin and short-sale system statistics — per row: total margin balance, total short balance, short-to-margin ratio, margin net flow, and maintenance ratio; sourced from the TWSE.",
    whatItIs:
      "信用交易系統統計資料集每一列對應一個交易日的系統統計,欄位包含 margin_purchase_balance_total / short_sale_balance_total / short_to_margin_balance_ratio / margin_net_flow / maintenance_ratio(融資餘額總額、融券餘額總額、券資比、融資淨流與整體維持率)。資料來源為證交所(TWSE),分級 推導型(由官方資料計算)。以資料基準日為知識時間,point-in-time 安全;後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one trading day of system statistics, carrying margin_purchase_balance_total / short_sale_balance_total / short_to_margin_balance_ratio / margin_net_flow / maintenance_ratio (total margin balance, total short balance, short-to-margin ratio, margin net flow, and maintenance ratio). Sourced from the TWSE, graded derived (computed from official data). Keyed on the data as-of date and point-in-time safe; The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "以券資比與維持率觀察全市場槓桿與斷頭風險。",
      "追蹤融資淨流判讀散戶槓桿情緒。",
      "作為信用交易系統性風險的監控層。",
    ],
    useCasesEn: [
      "Watch market leverage and margin-call risk via short-to-margin and maintenance ratios.",
      "Track margin net flow as a retail-leverage sentiment read.",
      "Use as the systemic-risk monitor for margin trading.",
    ],
    whyItMatters:
      "融資融券系統統計分散於多份日報;此資料集以一日一列彙整槓桿指標(含維持率),point-in-time 安全。",
    whyItMattersEn:
      "Margin/short system stats span several daily reports; this dataset consolidates leverage metrics (incl. maintenance ratio) one row per day, point-in-time safe.",
    coverageNote:
      "全市場融資融券系統彙總統計,每列 一個交易日的系統統計,欄位 margin_purchase_balance_total / short_sale_balance_total / short_to_margin_balance_ratio / margin_net_flow / maintenance_ratio;來源證交所(TWSE)(分級 推導型(由官方資料計算))。以資料基準日為知識時間,point-in-time 安全;(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Market-wide margin and short-sale system statistics; one row per trading day of system statistics, fields margin_purchase_balance_total / short_sale_balance_total / short_to_margin_balance_ratio / margin_net_flow / maintenance_ratio; sourced from the TWSE (graded derived (computed from official data)). Keyed on the data as-of date and point-in-time safe; (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源證交所(TWSE)(分級 推導型(由官方資料計算));非投資建議。",
    sourcePolicyNoteEn: "Sourced from the TWSE (graded derived (computed from official data)); not investment advice.",
    docsHref: "/docs/api/capital-flows/margin-system-stats",
    pricingHref: "/pricing",
    keywords: [
      "信用交易系統統計",
      "台股資料集",
      "全市場融資融券系統彙總統計",
      "證交所(TWSE)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Margin System Statistics",
      "Taiwan stock dataset",
      "market-wide margin and short-sale system statistics",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "信用交易系統統計資料集",
    jsonLdNameEn: "Margin System Statistics Dataset",
    jsonLdDescription: "全市場融資融券系統彙總統計,來源證交所(TWSE)(推導型(由官方資料計算))。",
    jsonLdDescriptionEn: "Market-wide margin and short-sale system statistics, sourced from the TWSE (derived (computed from official data)).",
    sourceRole: "derived_margin_system_stats",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "market-overview-snapshots",
    name: "市場概況快照",
    nameEn: "Market Overview Snapshots",
    seoTitle: "市場概況快照資料集(reference)| TW Market Data",
    seoTitleEn: "Market Overview Snapshots Dataset (reference) | TW Market Data",
    seoDescription:
      "市場概況快照資料集提供全市場指數與漲跌家數的每日快照,每列對應一個市場一日的概況快照,欄位含 market_code / as_of_date / index_level / index_change / index_change_pct / advancers;資料來源證交所(TWSE)(參考／主檔型)。coverage 逐字帶後端 meta。",
    seoDescriptionEn:
      "The Market Overview Snapshots dataset provides daily market-wide index and advance/decline snapshots — one row per market's daily overview snapshot, with fields market_code / as_of_date / index_level / index_change / index_change_pct / advancers; sourced from the TWSE (reference / master). Coverage taken verbatim from the backend meta.",
    shortDescription: "全市場指數與漲跌家數的每日快照,逐列 市場代碼、基準日、指數點位、漲跌點、漲跌幅、上漲／下跌／平盤家數;來源證交所(TWSE)。",
    shortDescriptionEn: "Daily market-wide index and advance/decline snapshots — per row: market code, as-of date, index level, index change, change %, advancers, decliners, and unchanged; sourced from the TWSE.",
    whatItIs:
      "市場概況快照資料集每一列對應一個市場一日的概況快照,欄位包含 market_code / as_of_date / index_level / index_change / index_change_pct / advancers / decliners / unchanged(市場代碼、基準日、指數點位、漲跌點、漲跌幅、上漲／下跌／平盤家數)。資料來源為證交所(TWSE),分級 參考／主檔型。後端 /v2/datasets meta 僅提供 grade／tier／point-in-time,未提供涵蓋視窗,故此頁不列具體起訖。",
    whatItIsEn:
      "Each row is one market's daily overview snapshot, carrying market_code / as_of_date / index_level / index_change / index_change_pct / advancers / decliners / unchanged (market code, as-of date, index level, index change, change %, advancers, decliners, and unchanged). Sourced from the TWSE, graded reference / master. The backend /v2/datasets meta exposes only grade / tier / point-in-time and no coverage window, so none is stated here.",
    useCases: [
      "以漲跌家數快速判讀市場廣度與情緒。",
      "追蹤指數點位與漲跌幅的每日概況。",
      "作為儀表板頂層的市場概覽資料。",
    ],
    useCasesEn: [
      "Read breadth and sentiment quickly via advancers/decliners.",
      "Track daily index level and change context.",
      "Use as the top-level market overview for dashboards.",
    ],
    whyItMatters:
      "市場概況需彙整指數與漲跌家數;此資料集以一致快照欄位一次提供,免自行加總。",
    whyItMattersEn:
      "A market overview needs index plus advance/decline aggregated; this dataset serves it in one snapshot shape, no manual tallying.",
    coverageNote:
      "全市場指數與漲跌家數的每日快照,每列 一個市場一日的概況快照,欄位 market_code / as_of_date / index_level / index_change / index_change_pct / advancers;來源證交所(TWSE)(分級 參考／主檔型)。(後端 /v2/datasets meta 未提供涵蓋視窗,故不列具體起訖。)",
    coverageNoteEn:
      "Daily market-wide index and advance/decline snapshots; one row per market's daily overview snapshot, fields market_code / as_of_date / index_level / index_change / index_change_pct / advancers; sourced from the TWSE (graded reference / master). (The backend /v2/datasets meta provides no coverage window, so none is stated.)",
    freshnessNote: "隨後端資料更新;實際頻率依來源發布節奏。",
    freshnessNoteEn: "Updated as the backend refreshes; cadence follows the source's release schedule.",
    sourcePolicyNote: "來源證交所(TWSE)(分級 參考／主檔型);非投資建議。",
    sourcePolicyNoteEn: "Sourced from the TWSE (graded reference / master); not investment advice.",
    docsHref: "/docs/api/market-prices/market-overview-snapshots",
    pricingHref: "/pricing",
    keywords: [
      "市場概況快照",
      "台股資料集",
      "全市場指數與漲跌家數的每日快照",
      "證交所(TWSE)",
      "TW Market Data",
    ],
    keywordsEn: [
      "Market Overview Snapshots",
      "Taiwan stock dataset",
      "daily market-wide index and advance/decline snapshots",
      "market data API",
      "TW Market Data",
    ],
    jsonLdName: "市場概況快照資料集",
    jsonLdNameEn: "Market Overview Snapshots Dataset",
    jsonLdDescription: "全市場指數與漲跌家數的每日快照,來源證交所(TWSE)(參考／主檔型)。",
    jsonLdDescriptionEn: "Daily market-wide index and advance/decline snapshots, sourced from the TWSE (reference / master).",
    sourceRole: "reference_market_overview_snapshots",
    provider: "twse",
    marketScope: "TWSE_TPEX",
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
