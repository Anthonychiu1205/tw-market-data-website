# TOTAL_MARGIN_SHORT_WEBSITE_CONTENT_CONSISTENCY_AUDIT_20260602T080712Z

## Handoff 檢查結果
- dataset: `total-margin-short-daily`
- endpoint: `/v2/datasets/total-margin-short`
- market: TWSE-only
- source policy: `official_first`
- source family: `official_twse_mi_margn_summary`
- private beta seeded rows: 3
- coverage dates: 2026-03-10 / 2026-04-10 / 2026-05-14
- forbidden claims: 無 TPEx/full-market/cron-enabled/prod-ready statements

## 網站文件比對
- API 範例已含：`GET /v2/datasets/total-margin-short?market=TWSE&start_date=2026-03-10&end_date=2026-05-14&limit=3`
- response fields 對齊：
  - market
  - trade_date
  - margin_purchase_balance_total
  - short_sale_balance_total
  - margin_purchase_buy_total
  - margin_purchase_sell_total
  - short_sale_buy_total
  - short_sale_sell_total
  - margin_purchase_amount_total
  - currency
  - market_scope
  - source_provider
  - source_role
  - source_lineage
  - data_gaps
  - not_investment_advice
- limitation 文案保留：
  - TWSE-only
  - private beta seeded
  - no TPEx claim
  - no full-market claim
  - no daily write cron enabled
  - source_lineage / data_gaps / not_investment_advice

## 驗證結果
- 目前未發現尚未對齊的欄位項目。
- backend handoff 的 `entitlement alias` 僅在後端提及為暫時對齊，未在前端文件將其暴露為使用者-facing claim。
