# FRONTEND_DOCS_SIDEBAR_ENDPOINT_CONSISTENCY_20260526T153003Z

## Summary
- Sidebar items: 55
- API sidebar items: 34
- Missing routes: 38
- Alias route findings: 3
- Beta/Deferred label findings: 2

## Duplicates
- Duplicated routes: 0
- Duplicated titles: 0

## Missing Pages
- `/docs/api/market-prices/twse-daily-price` (TWSE 日線價格)
- `/docs/api/market-prices/tpex-daily-price` (TPEx 日線價格)
- `/docs/api/market-prices/adjusted-prices` (還原股價)
- `/docs/api/market-prices/technical-indicators` (技術指標)
- `/docs/api/market-prices/index-data` (市場指數)
- `/docs/api/market-prices/market-breadth` (市場廣度)
- `/docs/api/market-prices/interest-rate` (利率快照)
- `/docs/api/financial-growth/monthly-revenue` (月營收)
- `/docs/api/financial-growth/income-statement` (損益表)
- `/docs/api/financial-growth/balance-sheet` (資產負債表)
- `/docs/api/financial-growth/cash-flow-statement` (現金流量表)
- `/docs/api/financial-growth/financial-metrics` (財務指標)
- `/docs/api/financial-growth/valuation-data` (估值資料)
- `/docs/api/capital-flow/institutional-flow` (三大法人)
- `/docs/api/capital-flow/margin-short` (融資融券)
- `/docs/api/company-events/issuer-announcements` (公司公告)
- `/docs/api/company-events/events-calendar` (事件日曆)
- `/docs/api/company-events/structured-events` (結構化事件)
- `/docs/api/company-events/corporate-actions` (公司行動)
- `/docs/api/company-events/dividends` (股利)
- `/docs/api/taxonomy/theme-taxonomy` (主題分類)
- `/docs/api/taxonomy/index-classification` (指數分類)
- `/docs/api/strategy-quant/features` (特徵資料)
- `/docs/api/strategy-quant/factor-data` (因子資料)
- `/docs/api/strategy-quant/time-alignment` (時間對齊)
- `/docs/api/strategy-quant/screener` (條件篩選)
- `/docs/api/query-tools/search-api` (搜尋 API)
- `/docs/api/query-tools/query-api` (查詢 API)
- `/docs/api/query-tools/query-fields` (查詢欄位)
- `/docs/api/query-tools/query-examples` (查詢範例)
- `/docs/api/preview/company-news` (公司新聞)
- `/docs/api/preview/market-news` (市場新聞)
- `/docs/api/preview/mops-material-events` (MOPS 重大訊息事件（Private Beta）)
- `/docs/workflows/company-fundamentals` (查看公司基本面)
- `/docs/workflows/capital-flow` (看籌碼)
- `/docs/workflows/market-status` (看市場狀態)
- `/docs/workflows/fast-data-access` (快速查資料)
- `/docs/workflows/strategy-ai` (做策略 / AI)

## Alias / Naming Inconsistency
- `/docs/data-freshness-lineage` -> `/docs/data-provenance` (資料血緣)
- `/docs/api-model` -> `/docs/openapi-spec` (API 模型)
- `/docs/tools-and-mcp` -> `/docs/tools-mcp` (Tools / MCP)

## Beta / Deferred Labels
- `/docs/api/market-prices/tpex-daily-price` `TPEx 日線價格`: missing_beta_label
- `/docs/api/market-prices/adjusted-prices` `還原股價`: missing_deferred_label

## Endpoint Consistency Notes
- Endpoint strings are present in docs content and llms-full inventory.
- Route-level endpoint mapping exists, but sidebar route aliases and status-tag wording should be unified.