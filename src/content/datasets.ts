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
    slug: "tpex-daily-price",
    name: "TPEx 日線價格",
    seoTitle: "TPEx 日線價格資料集 | TW Market Data",
    seoDescription:
      "TPEx 日線價格資料集提供上櫃股票每日開高低收與成交資訊，支援中小型股研究、回測與趨勢分析。",
    shortDescription: "上櫃股票每日價格與成交資訊的結構化資料集。",
    whatItIs:
      "此資料集聚焦上櫃公司（TPEx）日線市場資料，包含價格與成交欄位，適合補齊台股中小型股研究的資料層。",
    useCases: [
      "觀察上櫃市場與中小型股價格趨勢",
      "建立跨市場（TWSE/TPEx）日線回測資料",
      "作為技術指標與風險監控的底層輸入",
    ],
    whyItMatters:
      "若只看上市市場資料，容易忽略櫃買市場的重要訊號。TPEx 日線資料可補足台股研究的市場覆蓋廣度。",
    coverageNote:
      "覆蓋範圍會依官方來源揭露與產品化進度持續更新，請以 API 文件與 data_gaps 訊號判讀可用範圍。",
    freshnessNote:
      "資料以日線與結構化回應為主，更新節奏與延遲請依回應 metadata 與文件標示為準。",
    sourcePolicyNote:
      "遵循 official/public-first 原則，保留來源語義與 lineage，不以未驗證來源補齊缺口。",
    docsHref: "/docs/api/market-prices/tpex-daily-price",
    pricingHref: "/pricing",
    keywords: ["TPEx 日線價格 API", "上櫃股票資料", "台股中小型股資料"],
    jsonLdName: "TPEx 日線價格資料集",
    jsonLdDescription: "台股上櫃股票日線價格與成交資料，支援市場研究與量化流程。",
    sourceRole: "official_tpex_daily_price",
    provider: "tpex",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "technical-indicators",
    name: "技術指標",
    seoTitle: "台股技術指標資料集 | TW Market Data",
    seoDescription:
      "台股技術指標資料集提供由價格與成交量衍生的均線、報酬率與波動率指標，支援趨勢與動能分析。",
    shortDescription: "由價格與成交資料衍生的技術分析指標資料集。",
    whatItIs:
      "此資料集屬於 derived dataset，基於日線價格與成交量進行標準化計算，提供可直接用於研究流程的技術指標欄位。",
    useCases: [
      "建立趨勢、動能與風險監控規則",
      "作為量化回測條件與策略篩選輸入",
      "補充基本面研究中的市場行為訊號",
    ],
    whyItMatters:
      "技術指標可把原始價格序列轉為可比較的研究特徵，協助系統更快發現趨勢與異常變化。",
    coverageNote:
      "此資料集依賴底層價格資料，coverage 會跟隨 TWSE/TPEx 價格資料可用範圍與計算條件變化。",
    freshnessNote:
      "更新節奏通常跟隨底層日線資料；請以回應 metadata、freshness 與 data_gaps 為準。",
    sourcePolicyNote:
      "技術指標為衍生層，不等同官方原始欄位；計算邏輯與來源脈絡需與文件一併判讀。",
    docsHref: "/docs/api/market-prices/technical-indicators",
    pricingHref: "/pricing",
    keywords: ["台股技術指標 API", "均線資料", "動能指標", "量化回測指標"],
    jsonLdName: "技術指標資料集",
    jsonLdDescription: "由台股價格與成交量衍生的技術指標資料，支援趨勢與動能研究。",
    sourceRole: "derived_technical_indicators",
    provider: "twmd",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "valuation-data",
    name: "估值資料",
    seoTitle: "台股估值資料集 | TW Market Data",
    seoDescription:
      "台股估值資料集提供 PE、PB、dividend yield 等估值欄位，支援價格與基本面關聯分析。",
    shortDescription: "本益比、股價淨值比與殖利率等估值欄位的結構化資料集。",
    whatItIs:
      "此資料集整理常用估值指標，協助研究流程比較公司價格與基本面之間的相對關係。",
    useCases: [
      "觀察 PE、PB、殖利率在不同期間的變化",
      "建立同業估值比較與分位數分析",
      "作為研究框架中的估值訊號輸入",
    ],
    whyItMatters:
      "估值資料有助於理解市場定價與基本面變化的對應關係，但需搭配來源與coverage脈絡解讀。",
    coverageNote:
      "估值欄位會依 source proof、coverage 與產品化 rollout 逐步擴充，不應假設所有欄位在全期間皆完整。",
    freshnessNote:
      "更新節奏與可用性受底層價格/財報來源影響，請以回應中的 freshness 與 data_gaps 訊號判讀。",
    sourcePolicyNote:
      "本資料集優先提供可驗證欄位；未完成 source proof 的延伸欄位不會包裝為完整能力。",
    docsHref: "/docs/api/financial-growth/valuation-data",
    pricingHref: "/pricing",
    keywords: ["台股估值資料 API", "本益比 API", "股價淨值比 API", "殖利率資料"],
    jsonLdName: "估值資料集",
    jsonLdDescription: "台股 PE、PB、殖利率等估值欄位資料，支援估值與研究流程分析。",
    sourceRole: "official_valuation_data",
    provider: "twse",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "issuer-profile",
    name: "公司基本資料",
    seoTitle: "公司基本資料集 | TW Market Data",
    seoDescription:
      "公司基本資料集提供股票代號、公司名稱、產業分類與上市櫃資訊，是資料串接與篩選研究的核心主檔。",
    shortDescription: "股票代號與公司主檔欄位的結構化資料集。",
    whatItIs:
      "此資料集提供 issuer profile 主檔，用於統一公司識別、產業分類與市場屬性，支援跨資料集關聯。",
    useCases: [
      "資料表關聯與 ticker 對照",
      "依產業/市場分類做篩選與分組",
      "建立研究流程中的公司主檔維度",
    ],
    whyItMatters:
      "公司基本資料是所有資料集串接的基礎，若主檔不一致，後續財報、價格與事件分析容易出現關聯錯誤。",
    coverageNote:
      "覆蓋範圍與欄位完整度會依官方公開資料與標準化進度維護，請以文件與回應欄位為準。",
    freshnessNote:
      "主檔更新節奏取決於官方異動揭露時間，實際更新狀態請以 freshness 與資料回應判讀。",
    sourcePolicyNote:
      "主檔欄位採 official/public-first 原則與可追溯 lineage，避免未驗證來源造成識別漂移。",
    docsHref: "/docs/api/company/issuer-profile",
    pricingHref: "/pricing",
    keywords: ["公司基本資料 API", "issuer profile API", "股票代號公司名稱 API", "產業分類資料"],
    jsonLdName: "公司基本資料集",
    jsonLdDescription: "台股公司主檔資料，支援資料串接、分類與研究流程建模。",
    sourceRole: "official_issuer_profile",
    provider: "twse",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "margin-short",
    name: "融資融券",
    seoTitle: "台股融資融券資料集 | TW Market Data",
    seoDescription:
      "台股融資融券資料集整理信用交易欄位，可用於觀察市場槓桿、散戶情緒與短線風險。",
    shortDescription: "信用交易與融資融券相關欄位的結構化資料集。",
    whatItIs:
      "此資料集提供融資、融券與信用交易面資訊，支援籌碼面與風險情緒觀察。",
    useCases: [
      "追蹤融資/融券餘額與變化",
      "分析市場槓桿與風險偏好",
      "搭配法人與價格資料建立籌碼研究框架",
    ],
    whyItMatters:
      "融資融券是台股信用交易的重要訊號，可補充價格與法人資料，協助判讀市場風險熱度。",
    coverageNote:
      "coverage 會依資料 rollout 與 source policy 持續標示，不應假設全市場/全期間皆完整覆蓋。",
    freshnessNote:
      "更新時間與可用日期受來源供給節奏影響，請以回應中的 freshness 與 data_gaps 訊號為準。",
    sourcePolicyNote:
      "資料以官方/公開來源為優先，保留來源語義與缺口標記，不以推估值補齊。",
    docsHref: "/docs/api/capital-flow/margin-short",
    pricingHref: "/pricing",
    keywords: ["台股融資融券 API", "信用交易資料", "融資餘額", "融券資料"],
    jsonLdName: "融資融券資料集",
    jsonLdDescription: "台股信用交易與融資融券資料，支援籌碼與風險情緒分析。",
    sourceRole: "official_margin_short",
    provider: "twse",
    marketScope: "TWSE_TPEX",
  },
  {
    slug: "company-events",
    name: "公司事件與公告",
    seoTitle: "台股公司事件與公告資料集 | TW Market Data",
    seoDescription:
      "公司事件與公告資料集整理事件日曆、結構化事件、公司行動與股利 metadata，支援風險監控與研究流程。",
    shortDescription: "公司公告與事件 metadata 的結構化資料集。",
    whatItIs:
      "此資料集聚焦公司公告與事件 metadata，包含事件日曆、結構化事件、公司行動與股利等可查詢欄位。",
    useCases: [
      "追蹤公司事件與公告節奏",
      "建立事件驅動研究與風險監控流程",
      "搭配價格/基本面資料做事件前後比較",
    ],
    whyItMatters:
      "事件資料可補充價格與財報的時間落差，幫助研究流程更早發現風險訊號與重要變化。",
    coverageNote:
      "此資料集以 metadata-first 與官方揭露為主，覆蓋範圍會依來源與產品化進度逐步擴充。",
    freshnessNote:
      "事件更新節奏依官方揭露時點與結構化流程而定，請以回應 freshness 與 data_gaps 訊號為準。",
    sourcePolicyNote:
      "本資料集不等同完整新聞全文資料庫，不提供未授權全文再散佈；重點在官方揭露與結構化事件 metadata。",
    docsHref: "/docs/api/company-events/events-calendar",
    pricingHref: "/pricing",
    keywords: ["台股公司事件 API", "公司公告 metadata", "corporate actions", "台股事件資料"],
    jsonLdName: "公司事件與公告資料集",
    jsonLdDescription: "台股公司事件與公告 metadata，支援風險監控與事件研究流程。",
    sourceRole: "official_company_events_metadata",
    provider: "twse",
    marketScope: "TWSE_TPEX",
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
] as const;

export function getDatasetBySlug(slug: string): DatasetSeoEntry | undefined {
  return datasetSeoEntries.find((item) => item.slug === slug);
}

export const datasetSlugSet = new Set(datasetSeoEntries.map((item) => item.slug));
