# Margin Short Website Sync

## Files changed
- src/content/site.ts
- src/content/datasets.ts
- app/datasets/page.tsx
- src/content/docs-pages.ts
- docs/research/MARGIN_SHORT_WEBSITE_SYNC_PLAN_20260602T060532Z.md
- docs/research/MARGIN_SHORT_WEBSITE_SYNC_20260602_20260602T060532Z.md

## Pages and components updated
- dataset catalog content for 融資融券
- `/datasets/margin-short` detail page source content
- `/docs/api/capital-flow/margin-short` API reference content

## Dataset catalog status
- 融資融券 now described as TWSE-only private beta
- added overview route `/datasets/margin-short`
- limitations surfaced in catalog note

## Docs / API example status
- endpoint kept as `/v2/datasets/margin-short`
- sample request aligned to backend handoff package
- response field list aligned to canonical beta contract language
- source_lineage / data_gaps / not_investment_advice explicitly shown

## Limitations shown
- TWSE-only
- private beta
- no TPEx claim
- not investment advice
- daily write cron not enabled
- official-first and ratio tolerance 1e-6 noted

## Validation results
- `npm run lint` passed
- `npm run build` passed
- build emitted dynamic-route informational messages for auth/billing routes during static generation, but final exit was successful and unrelated to margin_short content sync

## Final gate
`MARGIN_SHORT_WEBSITE_SYNC_PASS_READY_FOR_REVIEW`
