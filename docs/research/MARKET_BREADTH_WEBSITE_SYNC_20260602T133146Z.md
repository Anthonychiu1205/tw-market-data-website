# Market Breadth Website Sync

## Source
- Backend readiness from: `27922b6`
- Backend handoff package: `market_breadth_private_beta_package.json`

## Sync scope completed
- Updated `app/datasets/page.tsx` dataset card and collection JSON-LD entry
- Updated `src/content/site.ts` market-breadth product metadata
- Updated `src/content/datasets.ts` SEO/detail metadata with TWSE-only private-beta fields
- Updated `src/content/docs-pages.ts` market-breadth API reference, including:
  - TWSE-only route and scope
  - sample request with `start_date`/`end_date`
  - canonical response fields aligned to handoff contract
  - source lineage / data_gaps / not investment advice notes

## Validation
- `npm run lint`
- `npm run build`

## Final gate
- `MARKET_BREADTH_WEBSITE_SYNC_PASS_READY_FOR_REVIEW`
