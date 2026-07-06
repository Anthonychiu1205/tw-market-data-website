# TOTAL_MARGIN_SHORT_WEBSITE_CONTENT_CONSISTENCY_AUDIT_20260602T081427Z

## 參考 handoff
- backend package: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/website_packages/total_margin_short_private_beta_package.json`
- examples: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/website_packages/total_margin_short_api_examples.md`
- product copy: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/website_packages/total_margin_short_private_beta_product_copy.md`
- handoff checklist: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/ops/TOTAL_MARGIN_SHORT_WEBSITE_REPO_HANDOFF_CHECKLIST.md`
- review note: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/P1_TOTAL_MARGIN_SHORT_WEBSITE_PACKAGE_AND_ENTITLEMENT_REVIEW_20260602T080105Z.md`

## 對齊結果
- endpoint: `/v2/datasets/total-margin-short`
- request example: `GET /v2/datasets/total-margin-short?market=TWSE&start_date=2026-03-10&end_date=2026-05-14&limit=3`
- response fields 已覆核：
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
- coverage / seed：`2026-03-10`, `2026-04-10`, `2026-05-14`
- row_count: `3`
- market: `TWSE-only`
- private beta: `seeded`

## 限制與邊界
- 包含 TWSE-only、private beta seeded、seed scope、no TPEx/full-market、official_first。
- 文件中保留 `source_lineage`、`data_gaps`、`not_investment_advice`。
- 無廣義 backfill 或 daily write cron 啟用聲明。
- 未將 entitlement alias 作為使用者前台 exposure。

## Legacy / overclaim 掃描
- 專案全域仍存在其他資料集的 TPEx/即時/投資建議相關文案，但本次總量融資融券文件未觀察到新增違規 overclaim。

## 一致性結論
- total-margin-short 網站文件與 handoff 合規對齊，通過。
