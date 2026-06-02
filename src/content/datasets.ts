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

export const datasetSeoEntries: readonly DatasetSeoEntry[] = [
  {
    slug: "twse-daily-price",
    name: "TWSE 日線價格",
    seoTitle: "TWSE 日線價格資料集 | TW Market Data",
    seoDescription:
      "TWSE 日線價格資料集提供台股上市股票每日開高低收、成交量與成交金額，可用於回測、波動分析與技術指標計算。",
    shortDescription: "上市股票每日開高低收、成交量與成交金額的基礎價格資料。",
    whatItIs:
      "此資料集聚焦上市公司（TWSE）日線市場資料，包含 OHLCV 與成交金額，適合建立一致的台股價格分析基礎。",
    useCases: [
      "計算報酬率、波動率與區間價格變化",
      "建立回測資料底層與技術指標輸入",
      "提供 AI agent 研究流程中的價格證據層",
    ],
    whyItMatters:
      "價格資料是股票研究的共同底座。若沒有穩定且可追溯的日線資料，後續估值、風險與策略比較都難以重現。",
    coverageNote:
      "覆蓋範圍會依資料來源揭露與產品化進度持續維護，實際可用範圍請以 API 文件與 data_gaps 訊號為準。",
    freshnessNote: "更新頻率與延遲會依官方來源節奏標示，請在使用前確認 freshness 狀態。",
    sourcePolicyNote:
      "採 official/public-first 原則；欄位來源與 lineage 以可追溯方式提供，不以推測資料補齊缺口。",
    docsHref: "/docs/api/market-prices/twse-daily-price",
    pricingHref: "/pricing",
    keywords: ["台股日線資料 API", "TWSE", "OHLCV", "market data"],
    jsonLdName: "TWSE 日線價格資料集",
    jsonLdDescription: "台股上市股票日線價格與成交資料，支援研究、回測與 API workflow。",
    sourceRole: "official_twse_daily_price",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "monthly-revenue",
    name: "月營收",
    seoTitle: "台股月營收資料集 | TW Market Data",
    seoDescription:
      "台股月營收資料集整理上市公司每月營業收入，可用於追蹤 YoY/MoM、營運趨勢與基本面研究流程。",
    shortDescription: "整理公司每月公告營業收入的結構化資料集。",
    whatItIs:
      "此資料集聚焦公司每月營收公告，提供跨公司、跨期間可查詢的營收資料，用於建立基本面時間序列。",
    useCases: [
      "追蹤營收年增率（YoY）與月增率（MoM）",
      "比較產業或同業營運趨勢",
      "作為研究流程中的即時基本面訊號",
    ],
    whyItMatters:
      "月營收是台股最早可取得的營運指標之一，能在季度財報前先提供公司成長與變化的訊號。",
    coverageNote:
      "覆蓋範圍會依公開來源可得性與資料品質逐步擴展，不代表所有標的在所有月份皆完整。",
    freshnessNote: "更新時間請以 API 文件與回應中的 freshness/data_gaps 訊號判讀。",
    sourcePolicyNote:
      "以官方/公開揭露來源為主，欄位標準化後提供查詢，缺漏會保留為可觀測 data_gaps。",
    docsHref: "/docs/api/financial-growth/monthly-revenue",
    pricingHref: "/pricing",
    keywords: ["台股月營收 API", "營收年增率", "基本面資料"],
    jsonLdName: "月營收資料集",
    jsonLdDescription: "台股公司月營收資料，適用於成長追蹤與基本面分析。",
    sourceRole: "official_monthly_revenue",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "income-statement",
    name: "損益表",
    seoTitle: "台股損益表資料集 | TW Market Data",
    seoDescription:
      "台股損益表資料集提供營收、毛利、營業利益、稅後淨利與 EPS，支援獲利能力與估值研究。",
    shortDescription: "季度損益表欄位的標準化資料集。",
    whatItIs:
      "此資料集提供公司季度損益表核心欄位，支援跨期間比較與獲利結構分析。",
    useCases: [
      "分析毛利率、營益率與獲利波動",
      "追蹤 EPS 與淨利變化",
      "作為估值模型與研究報告的基本面輸入",
    ],
    whyItMatters:
      "損益表反映公司是否具備可持續獲利能力，是中長期基本面判斷與估值分析的核心來源。",
    coverageNote:
      "不同公司與期間可能存在揭露差異，請以欄位可用性與 data_gaps 訊號確認可用範圍。",
    freshnessNote: "財報更新節奏受官方揭露時點影響，請先核對最新可用季度。",
    sourcePolicyNote:
      "遵循 official/public-first 與欄位契約原則，不以未驗證來源補值。",
    docsHref: "/docs/api/financial-growth/income-statement",
    pricingHref: "/pricing",
    keywords: ["台股損益表 API", "EPS", "財報資料"],
    jsonLdName: "損益表資料集",
    jsonLdDescription: "台股公司季度損益表資料，支援獲利能力與估值研究。",
    sourceRole: "official_income_statement",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "balance-sheet",
    name: "資產負債表",
    seoTitle: "台股資產負債表資料集 | TW Market Data",
    seoDescription:
      "台股資產負債表資料集提供資產、負債與股東權益欄位，可用於評估公司體質、槓桿與財務風險。",
    shortDescription: "公司資產、負債與股東權益結構的季度資料集。",
    whatItIs:
      "此資料集整理公司財務結構欄位，支援公司體質檢視、資本結構分析與風險評估。",
    useCases: [
      "觀察負債比與資本結構變化",
      "比較同業財務穩健度",
      "評估現金與流動性相關風險",
    ],
    whyItMatters:
      "資產負債表可揭示企業的抗風險能力與資本壓力，是基本面風險評估不可缺少的一環。",
    coverageNote:
      "資料覆蓋會依揭露與標準化進度調整，請以實際欄位可用性與 data_gaps 訊號為準。",
    freshnessNote: "財務結構資料以季度更新為主，請確認目標期間是否已揭露。",
    sourcePolicyNote:
      "來源以官方揭露資料為主，欄位映射與 lineage 保持可追溯。",
    docsHref: "/docs/api/financial-growth/balance-sheet",
    pricingHref: "/pricing",
    keywords: ["台股資產負債表 API", "財務結構", "股東權益"],
    jsonLdName: "資產負債表資料集",
    jsonLdDescription: "台股公司資產負債表資料，支援財務體質與風險分析。",
    sourceRole: "official_balance_sheet",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "institutional-flow",
    name: "三大法人買賣超",
    seoTitle: "三大法人買賣超資料集 | TW Market Data",
    seoDescription:
      "三大法人買賣超資料集提供外資、投信、自營商每日買賣超，支援籌碼與資金流向分析。",
    shortDescription: "外資、投信、自營商每日買賣超的台股籌碼資料集。",
    whatItIs:
      "此資料集整理三大法人在台股市場的日別買賣超資料，適合做籌碼面與資金流向觀察。",
    useCases: [
      "觀察外資、投信、自營商資金方向",
      "搭配價格資料分析籌碼與行情關係",
      "建立研究流程中的資金流事件訊號",
    ],
    whyItMatters:
      "法人資金流向常影響短中期價格結構，可補充純價格與財報資料對市場行為的解釋能力。",
    coverageNote:
      "此資料集 coverage 正在持續補齊中，不應視為全市場/全期間已完整覆蓋。",
    freshnessNote: "更新節奏與可用日期受官方來源供給影響，請以回應 metadata 與 data_gaps 為準。",
    sourcePolicyNote:
      "僅納入官方/公開來源；缺漏與來源異常會顯式標記，不以推估值補齊。",
    docsHref: "/docs/api/capital-flow/institutional-flow",
    pricingHref: "/pricing",
    keywords: ["三大法人買賣超 API", "外資投信自營商", "台股籌碼資料"],
    jsonLdName: "三大法人買賣超資料集",
    jsonLdDescription: "台股外資、投信、自營商每日買賣超資料，支援籌碼與資金流向研究。",
    sourceRole: "official_twse_t86",
    provider: "twse",
    marketScope: "TWSE",
  },
  {
    slug: "margin-short",
    name: "融資融券",
    seoTitle: "融資融券資料集 | TW Market Data",
    seoDescription:
      "融資融券資料集提供 TWSE private beta 的信用交易欄位，涵蓋融資/融券買賣、餘額、來源血緣與 data_gaps。",
    shortDescription: "TWSE private beta 融資融券資料集，提供信用交易餘額、買賣與資料血緣。",
    whatItIs:
      "此資料集聚焦 TWSE 官方優先來源的融資融券資料，適合做市場槓桿、散戶情緒與籌碼擁擠度觀察；目前仍為 private beta。",
    useCases: [
      "觀察融資與融券餘額的變化與壓力。",
      "與三大法人買賣超交叉分析信用交易風險。",
      "在研究流程中保留 source_lineage 與 data_gaps 做可追溯判讀。",
    ],
    whyItMatters:
      "融資融券可補充單看價格與法人流向看不到的市場槓桿與擁擠度訊號，對短中期風險監控特別重要。",
    coverageNote:
      "目前驗證 coverage 為 2026-03-10..2026-05-28，共 16,475 rows、1,272 檔 TWSE 標的；不宣稱 TPEx 或全市場覆蓋。",
    freshnessNote: "目前以 private beta 方式提供，請在使用時保留 data_gaps、source_lineage 與 beta 限制說明。",
    sourcePolicyNote:
      "遵循 official-first 與 explicit lineage/data_gaps 原則；不暴露 raw/full body，不宣稱 securities lending 已納入同一契約。",
    docsHref: "/docs/api/capital-flow/margin-short",
    pricingHref: "/pricing",
    keywords: ["融資融券 API", "信用交易資料", "台股籌碼資料", "margin short"],
    jsonLdName: "融資融券資料集",
    jsonLdDescription: "TWSE private beta 融資融券資料，支援信用交易與籌碼風險研究。",
    sourceRole: "official_twse_mi_margn",
    provider: "twse_official",
    marketScope: "TWSE",
  },
] as const;

export function getDatasetBySlug(slug: string): DatasetSeoEntry | undefined {
  return datasetSeoEntries.find((item) => item.slug === slug);
}

export const datasetSlugSet = new Set(datasetSeoEntries.map((item) => item.slug));
