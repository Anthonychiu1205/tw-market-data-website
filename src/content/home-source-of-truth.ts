export const HOME_SOURCE_OF_TRUTH_ITEMS = [
  {
    id: "monthly_revenue",
    title: "月營收",
    description: "來自 MOPS 的月營收資料，適合營收趨勢與成長分析",
    responseLabel: "monthly_revenue",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "monthly_revenue",
  "source_role": "canonical",
  "freshness": "T+0",
  "lineage": {
    "provider": "MOPS",
    "ingested_at": "2026-04-18T09:02:11+08:00"
  },
  "data": [
    {
      "ticker": "2330",
      "period": "2026-03",
      "revenue": 195234000000,
      "currency": "TWD",
      "yoy_growth_pct": 34.7,
      "mom_growth_pct": 11.2
    },
    {
      "ticker": "2330",
      "period": "2026-02",
      "revenue": 175912000000,
      "currency": "TWD",
      "yoy_growth_pct": 21.5,
      "mom_growth_pct": null
    }
  ]
}`,
  },
  {
    id: "financial_statements",
    title: "財報三大表",
    description: "損益表、資產負債表、現金流量表，統一 schema 輸出",
    responseLabel: "financial_statements",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "financial_statements",
  "source_role": "canonical",
  "lineage": {
    "provider": "MOPS"
  },
  "fiscal_period": "2025-Q4",
  "data": {
    "ticker": "2330",
    "currency": "TWD",
    "income_statement": {
      "revenue": 868461000000,
      "gross_profit": 466512000000,
      "operating_income": 382146000000,
      "net_income": 346783000000,
      "eps": 13.38
    },
    "balance_sheet": {
      "total_assets": 6321458000000,
      "total_liabilities": 2418321000000,
      "shareholders_equity": 3903137000000,
      "cash_and_equivalents": 1682400000000
    },
    "cash_flow_statement": {
      "operating_cash_flow": 512384000000,
      "investing_cash_flow": -218450000000,
      "financing_cash_flow": -102381000000,
      "free_cash_flow": 307912000000
    },
    "restated": false,
    "segments": [
      {
        "name": "晶圓代工",
        "revenue": 791203000000
      },
      {
        "name": "其他",
        "revenue": 77258000000
      }
    ]
  },
  "warnings": [
    {
      "code": "ROUNDING_NOTICE",
      "message": "部分欄位為四捨五入數值"
    }
  ]
}`,
  },
  {
    id: "daily_price",
    title: "股價日線",
    description: "開高低收、成交量、還原處理與交易日對齊",
    responseLabel: "price_daily",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "price_daily",
  "source_role": "canonical",
  "lineage": {
    "provider": "TWSE"
  },
  "data": [
    {
      "ticker": "2330",
      "market": "TWSE",
      "board_lot": 1000,
      "is_adjusted": true,
      "records": [
        {
          "date": "2026-04-18",
          "open": 842,
          "high": 850,
          "low": 838,
          "close": 847,
          "volume": 24518321,
          "turnover": 20781456327,
          "adjusted_close": 847
        },
        {
          "date": "2026-04-17",
          "open": 835,
          "high": 844,
          "low": 832,
          "close": 840,
          "volume": 23145008,
          "turnover": 19409325111,
          "adjusted_close": 840
        }
      ]
    }
  ]
}`,
  },
  {
    id: "valuation_metrics",
    title: "PER / PBR / 殖利率",
    description: "估值相關指標，適合篩選與估值流程",
    responseLabel: "valuation_metrics",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "valuation_metrics",
  "source_role": "canonical",
  "lineage": {
    "provider": "TWSE"
  },
  "as_of": "2026-04-18",
  "data": {
    "ticker": "2330",
    "per": 28.4,
    "forward_per": 24.7,
    "pbr": 6.1,
    "dividend_yield_pct": 1.82,
    "market_cap": 21965000000000,
    "valuation_band": {
      "per_5y_median": 22.1,
      "per_percentile": 0.78
    },
    "is_high_valuation": true,
    "note": null
  }
}`,
  },
  {
    id: "institutional_flows",
    title: "籌碼與法人",
    description: "三大法人、持股變化與市場結構觀察",
    responseLabel: "institutional_flows",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "institutional_flows",
  "source_role": "canonical",
  "lineage": {
    "provider": "TWSE"
  },
  "data": [
    {
      "ticker": "2330",
      "date": "2026-04-18",
      "net_flow": {
        "foreign_investors": 12843,
        "investment_trust": -512,
        "dealer": 238,
        "total": 12569
      },
      "shareholding_ratio_pct": {
        "foreign_investors": 73.8,
        "investment_trust": 1.2,
        "dealer": 0.6
      },
      "top_brokers_by_buy": [
        "摩根士丹利",
        "美林",
        "凱基台北"
      ]
    }
  ]
}`,
  },
  {
    id: "corporate_events",
    title: "事件資料",
    description: "除權息、停復牌、重大公告與公司事件整理",
    responseLabel: "corporate_events",
    status: "200 OK",
    responseTitle: "2330",
    code: `{
  "dataset": "corporate_events",
  "source_role": "canonical",
  "lineage": {
    "provider": "MOPS"
  },
  "data": [
    {
      "ticker": "2330",
      "event_type": "cash_dividend",
      "announcement_date": "2026-03-12",
      "ex_dividend_date": "2026-06-18",
      "cash_dividend_per_share": 4.5,
      "currency": "TWD",
      "status": "scheduled"
    },
    {
      "ticker": "2330",
      "event_type": "trading_halt",
      "announcement_date": "2026-02-09",
      "effective_time": "2026-02-10T09:00:00+08:00",
      "resume_time": "2026-02-10T11:30:00+08:00",
      "reason": "重大訊息待公布",
      "status": "closed"
    }
  ]
}`,
  },
  {
    id: "lineage_metadata",
    title: "來源與 lineage",
    description: "保留 provider、source role、freshness、lineage 等欄位",
    responseLabel: "lineage_metadata",
    status: "200 OK",
    responseTitle: "monthly_revenue",
    code: `{
  "dataset": "monthly_revenue",
  "source_role": "canonical",
  "meta": {
    "freshness": "T+0",
    "provider": "MOPS",
    "source_document": "mops_monthly_revenue_2026_03",
    "trace_id": "rev_2330_2026_03",
    "ingested_at": "2026-04-18T09:02:11+08:00",
    "audit": {
      "checksum": "sha256:caf0d9e3",
      "verified": true
    }
  },
  "records": [
    {
      "ticker": "2330",
      "period": "2026-03",
      "revenue": 195234000000,
      "is_estimated": false
    }
  ]
}`,
  },
  {
    id: "source_role_policy",
    title: "canonical / fallback / helper",
    description: "資料來源分層，避免混源與不可追溯問題",
    responseLabel: "source_role_policy",
    status: "200 OK",
    responseTitle: "policy",
    code: `{
  "dataset": "source_role_policy",
  "policy_version": "v1",
  "enforced": true,
  "updated_at": "2026-04-18T08:40:00+08:00",
  "rules": {
    "monthly_revenue": {
      "canonical": ["MOPS"],
      "fallback": [],
      "helper": ["Yahoo"],
      "allow_unmarked_merge": false
    },
    "price_daily": {
      "canonical": ["TWSE", "TPEx"],
      "fallback": [],
      "helper": ["twstock", "Yahoo"],
      "allow_unmarked_merge": false
    }
  },
  "principles": [
    "official/public-first",
    "canonical 與 helper 分層",
    "避免跨來源混用未標記資料"
  ],
  "exceptions": []
}`,
  },
] as const;

export type HomeSourceOfTruthItem = (typeof HOME_SOURCE_OF_TRUTH_ITEMS)[number];
