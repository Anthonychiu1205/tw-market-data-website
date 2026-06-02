# Margin Short Docs Legacy Contract Cleanup Audit

## Legacy terms found before cleanup
- `symbol=2330...limit=50` in the margin-short docs request example
- `margin_balance`
- `margin_buy`
- `short_cover`
- `margin_short_ratio`
- legacy `lineage` wording instead of `source_lineage`

## Legacy terms after cleanup
- no legacy terms remain in the `/docs/api/capital-flow/margin-short` route content
- grep still finds `symbol=2330` in unrelated dataset docs and historical reports
- grep still finds legacy term strings inside historical review docs that document the old issue

## Files changed
- `src/content/docs-pages.ts`
- `docs/research/MARGIN_SHORT_DOCS_LEGACY_CONTRACT_CLEANUP_AUDIT_20260602T061740Z.md`
- `docs/research/MARGIN_SHORT_WEBSITE_POST_CLEANUP_DEPLOY_PREFLIGHT_20260602T061740Z.md`

## Backend alignment checklist
- request example aligned to `GET /v2/datasets/margin-short?symbol=0050&market=TWSE&start_date=2026-03-10&end_date=2026-05-28&limit=3`
- canonical response fields aligned to ticker/market/trade_date/margin_purchase_*/short_sale_*/source_provider/source_role/source_lineage/data_gaps/not_investment_advice
- limitations retained: TWSE-only, private beta, no TPEx claim, not investment advice, daily write cron not enabled, official-first, ratio tolerance 1e-6

## Remaining known limitations
- cleanup is docs-content-only; no backend/API behavior changed
- validation build rerun was blocked by another active Next build process in the same repo
