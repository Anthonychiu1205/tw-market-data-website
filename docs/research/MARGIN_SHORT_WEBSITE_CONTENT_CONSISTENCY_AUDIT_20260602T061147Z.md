# Margin Short Website Content Consistency Audit

## Backend handoff target
- endpoint: `/v2/datasets/margin-short`
- coverage range: `2026-03-10..2026-05-28`
- row_count: `16475`
- distinct tickers: `1272`
- scope: `TWSE-only`
- limitations: private beta / no TPEx claim / not investment advice / daily write cron not enabled
- metadata: source_lineage and data_gaps required
- note: ratio tolerance `1e-6`

## What is aligned
- dataset catalog copy now uses TWSE-only private beta framing
- dataset detail page source now uses backend-aligned coverage and limitation language
- official-first positioning is present
- source_lineage / data_gaps / not investment advice are represented in new dataset detail copy

## Remaining content gap
- `src/content/docs-pages.ts` still contains legacy `margin-short` API reference fragments from the older publicized contract
- observed drift indicators include:
  - old request example pattern using `symbol=2330&start_date=2026-04-01...limit=50`
  - old field vocabulary such as `margin_balance`, `margin_buy`, `short_cover`, `margin_short_ratio`, and `lineage`
  - older narrative wording that reads like a broader public endpoint rather than TWSE-only private beta contract
- this means the docs route is reachable, but the content is not yet fully consistent with the backend handoff package

## Audit decision
- content status: `partial_alignment_with_docs_route_drift`
- deploy implication: do not treat the current sync as deploy-approved yet
- recommended next step: targeted docs-page contract cleanup for `/docs/api/capital-flow/margin-short`, then rerun this review
