# Market Breadth Website Sync Plan

- Source repo: `/Volumes/DEV_USB/Projects/tw-feature-engine`
- Backend handoff package: `docs/generated/website_packages/market_breadth_private_beta_package.json`
- Target repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Scope date: 2026-06-02
- Commit target: `docs: add market breadth dataset pages`

## Task objective
- Sync market-breadth dataset into website catalog, dataset detail page, docs API page, and sidebar metadata.
- Keep constraints: no TPEx/full-market claim, no daily cron enabled claim, no investment advice, no code logic change.

## Files identified for update
- `app/datasets/page.tsx`
- `src/content/datasets.ts`
- `src/content/site.ts`
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`

## Existing structure findings
- Dataset product registry already has dedicated market dataset metadata entries and market-prices API sections.
- Route convention for this class of pages is `/docs/api/market-prices/<slug>`.
- Sidebar groups already include `/docs/api/market-prices/market-breadth` entry.

## No-overclaim checklist
- Use TWSE-only wording only
- mark as private beta only
- include `source_lineage`, `data_gaps`, `not_investment_advice`
- do not claim production cron writes or TPEx coverage
- no raw/full body fields in API examples

## Planned deliverables
- Update dataset catalog metadata for `market-breadth`.
- Add/align docs reference page under market-prices section with canonical field set.
- Update validation docs (plan / audit / sync).
- Run `npm run lint` and `npm run build`.
