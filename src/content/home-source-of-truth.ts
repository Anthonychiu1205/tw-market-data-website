export const HOME_SOURCE_OF_TRUTH_ITEMS = [
  {
    id: "monthly_revenue",
    title: "月營收",
    description: "MOPS 月營收、YoY / MoM 成長追蹤",
    responseLabel: "monthly_revenue",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "monthly_revenue",
  "source_role": "canonical",
  "lineage": {
    "provider": "MOPS",
    "ingested_at": "2026-05-06T18:05:00+08:00"
  },
  "rows": [
    {
      "symbol": "2330",
      "period": "2026-03",
      "revenue": 195234000000,
      "yoy_growth_pct": 34.7,
      "mom_growth_pct": 11.2
    }
  ]
}`,
  },
  {
    id: "twse_daily_price",
    title: "股價日線",
    description: "TWSE / TPEx 日線價格、成交量與交易日資料",
    responseLabel: "twse_daily_price",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "twse_daily_price",
  "source_role": "canonical",
  "lineage": {
    "provider": "TWSE"
  },
  "rows": [
    {
      "symbol": "2330",
      "date": "2026-05-06",
      "open": 884,
      "high": 895,
      "low": 878,
      "close": 892,
      "volume": 42168000
    }
  ]
}`,
  },
  {
    id: "financial_statements",
    title: "財報三表",
    description: "損益表、資產負債表、現金流量表",
    responseLabel: "income_statement",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "income_statement",
  "source_role": "canonical",
  "lineage": {
    "provider": "MOPS"
  },
  "rows": [
    {
      "symbol": "2330",
      "fiscal_period": "2025-Q4",
      "revenue": 868461000000,
      "operating_income": 382146000000,
      "net_income": 346783000000,
      "eps": 13.38
    }
  ],
  "related_datasets": [
    "balance_sheet",
    "cash_flow_statement"
  ]
}`,
  },
  {
    id: "technical_indicators",
    title: "技術指標",
    description: "MA、RSI、MACD 等常用技術指標",
    responseLabel: "technical_indicators",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "technical_indicators",
  "source_role": "canonical",
  "lineage": {
    "provider": "TWSE"
  },
  "rows": [
    {
      "symbol": "2330",
      "date": "2026-05-06",
      "ma_5": 887.4,
      "ma_20": 861.8,
      "rsi_14": 61.3,
      "macd": 12.2
    }
  ]
}`,
  },
  {
    id: "valuation_data",
    title: "估值資料",
    description: "PER、PBR、殖利率與市值相關指標",
    responseLabel: "valuation_data",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "valuation_data",
  "source_role": "canonical",
  "lineage": {
    "provider": "TWSE"
  },
  "rows": [
    {
      "symbol": "2330",
      "date": "2026-05-06",
      "per": 28.4,
      "pbr": 6.1,
      "dividend_yield_pct": 1.82,
      "market_cap": 21965000000000
    }
  ]
}`,
  },
  {
    id: "capital_flow",
    title: "籌碼與資金",
    description: "三大法人買賣、融資融券與資金流向",
    responseLabel: "institutional_flow",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "institutional_flow",
  "source_role": "canonical",
  "lineage": {
    "provider": "TWSE"
  },
  "rows": [
    {
      "symbol": "2330",
      "date": "2026-05-06",
      "foreign_net_buy": 12843,
      "investment_trust_net_buy": -512,
      "dealer_net_buy": 238,
      "total_net_buy": 12569
    }
  ],
  "related_datasets": [
    "margin_short"
  ]
}`,
  },
  {
    id: "company_events",
    title: "公司事件",
    description: "公司基本資料、公告、事件日曆、公司行動與股利",
    responseLabel: "issuer_announcements",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "issuer_announcements",
  "source_role": "canonical",
  "lineage": {
    "provider": "MOPS"
  },
  "rows": [
    {
      "symbol": "2330",
      "announcement_date": "2026-05-06",
      "headline": "公告董事會通過季度財務報告",
      "category": "重大訊息"
    }
  ],
  "related_datasets": [
    "issuer_profile",
    "events",
    "corporate_actions",
    "dividends"
  ]
}`,
  },
  {
    id: "classification_query",
    title: "分類與查詢",
    description: "主題分類、指數分類、Search API、Query API 與 Screener",
    responseLabel: "theme_taxonomy",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "theme_taxonomy",
  "source_role": "canonical",
  "lineage": {
    "provider": "TW Market Data"
  },
  "rows": [
    {
      "symbol": "2330",
      "themes": ["先進製程", "AI 供應鏈"],
      "index_classifications": ["台灣50", "電子類股"]
    }
  ],
  "related_endpoints": [
    "/v2/search",
    "/v2/query",
    "/v2/datasets/screener"
  ]
}`,
  },
] as const;

export type HomeSourceOfTruthItem = (typeof HOME_SOURCE_OF_TRUTH_ITEMS)[number];
