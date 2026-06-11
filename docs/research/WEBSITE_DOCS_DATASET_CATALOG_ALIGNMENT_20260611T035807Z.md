# Website docs dataset catalog alignment with current database

## Scope
- Source of truth repo: `/Volumes/DEV_USB/Projects/tw-feature-engine`
- Website repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- DB write: no
- Migration: no
- Backend behavior change: no

## What was aligned
- Synced `public/llms.txt` and `public/llms-full.txt` from feature-engine generated outputs.
- Removed stale API route references to `/v2/datasets/valuations` and replaced them with `/v2/datasets/valuation-core-daily` where the lower-level canonical anchor is intended.
- Repointed stale market overview route usage from `/v2/datasets/price-enhanced/market-overview` to `/v2/datasets/market-overview-snapshots`.
- Updated website public catalog surfaces to include current DB-backed preview datasets:
  - `market-overview-snapshots`
  - `day-trading-suspension`
  - `disposition-securities-period`
  - `security-master`
  - `company-risk-events`
  - `capital-formation-events`
  - `tax-business-registration`
  - `etf-holdings`
  - `convertible-bond-institutional-flow`
- Removed support/internal dataset exposure from website catalog/sidebar surfaces:
  - `theme-taxonomy`
  - `index-classification`
  - `features`
  - `factor-data`
  - `time-alignment`
  - `screener`
- Added explicit current-snapshot warnings for:
  - `day_trading_suspension`
  - `disposition_securities_period`

## Validation
- `npm run lint`: pass
- `npm run check:dataset-factory-docs`: pass
- `npm run build`: pass
- `npm run typecheck`: skipped, no script in `package.json`
- `npm run test`: skipped, no script in `package.json`

## Result
- Dataset catalog surfaces now align to the current feature-engine generated truth source.
- Stale `/v2/datasets/valuations` is no longer referenced.
- Support/internal datasets are no longer exposed on the audited public catalog surfaces.
- Current snapshot datasets now carry explicit no-historical-completeness / no-backfill warnings.

## Final gate
- `WEBSITE_DOCS_DATASET_CATALOG_ALIGNMENT_PASS`
