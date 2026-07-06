# Market Breadth Website Post-Sync Route Review

## Scope
Post-sync route and registration review for `market_breadth` website exposure. No deploy, no push, no backend change.

## Dataset catalog registration
- dataset catalog source present in `src/content/datasets.ts`
- slug: `market-breadth`
- dataset detail route: `/datasets/market-breadth`
- docs href: `/docs/api/market-prices/market-breadth`
- TWSE-only / private beta wording is present in dataset metadata

## Detail route source
- dataset list entry is exposed in `app/datasets/page.tsx`
- overview route points to `/datasets/market-breadth`
- collection JSON-LD entry includes `https://twmarketdata.com/datasets/market-breadth`

## Docs route registration
- docs route is registered in `src/content/docs-pages.ts`
- route path in current site taxonomy: `/docs/api/market-prices/market-breadth`
- endpoint bound in docs content: `/v2/datasets/market-breadth`
- sidebar/nav exposure exists in `src/content/docs-sidebar.ts`

## SEO / site metadata
- site metadata entry exists in `src/content/site.ts`
- current metadata preserves:
  - `TWSE-only`
  - `Private Beta`
  - `source_lineage/data_gaps`
  - no TPEx/full-market wording

## Missing route risk
- no missing route risk identified from current content registration
- route family uses existing market-prices taxonomy rather than the handoff's preferred `/docs/api/market/market-breadth`; this is acceptable because it matches existing site convention

## Route review result
- `/datasets`: market breadth visible
- `/datasets/market-breadth`: registered through dataset content
- `/docs/api/market-prices/market-breadth`: registered and linked

## Final gate
`MARKET_BREADTH_WEBSITE_POST_SYNC_ROUTE_REVIEW_PASS`
