# TOTAL_MARGIN_SHORT_WEBSITE_SYNC_20260602T080712Z

## 已更新檔案
- `src/content/datasets.ts`
- `src/content/site.ts`
- `app/datasets/page.tsx`
- `src/content/docs-sidebar.ts`
- `src/content/docs-pages.ts`
- `docs/research/TOTAL_MARGIN_SHORT_WEBSITE_SYNC_PLAN_20260602T080712Z.md`
- `docs/research/TOTAL_MARGIN_SHORT_WEBSITE_CONTENT_CONSISTENCY_AUDIT_20260602T080712Z.md`
- `docs/research/TOTAL_MARGIN_SHORT_WEBSITE_ROUTE_REVIEW_20260602T080712Z.md`

## Dataset/catalog 更新
- 新增 `total-margin-short` dataset catalog entry。
- endpoint 對齊 `/v2/datasets/total-margin-short`。
- TWSE-only private-beta seeded（2026-03-10..2026-05-14, row_count=3）
- 禁止宣稱 TPEx/full-market/daily write cron enabled。

## API 文件一致性
- docs page route：`/docs/api/capital-flow/total-margin-short`
- sample request: `GET /v2/datasets/total-margin-short?market=TWSE&start_date=2026-03-10&end_date=2026-05-14&limit=3`
- response fields 完整包含 source_lineage、data_gaps、not_investment_advice。

## 限制保留
- private beta seeded / seed scope
- official-first
- TWSE-only
- not_investment_advice
- no daily write cron claim

## 驗證
- validation: see `npm run lint` + `npm run build` results in task log.

## Decision
- `TOTAL_MARGIN_SHORT_WEBSITE_SYNC_PASS_READY_FOR_REVIEW`
- deploy 未執行；未 push；未改 backend。
