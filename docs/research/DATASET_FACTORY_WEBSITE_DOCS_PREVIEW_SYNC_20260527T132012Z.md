# Dataset Factory Website Docs Preview Sync (2026-05-27T13:20:12Z)

## 1. Objective
Sync Dataset Factory generated docs from `tw-feature-engine` into `tw-market-data-website` as preview/private-beta documentation only, without production launch claims.

## 2. Source Manifest Path
- `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/dataset_website_sync_manifest.json`
- Supporting generated sources:
  - `docs/generated/datasets/README.md`
  - `docs/generated/datasets/institutional_flow.md`
  - `docs/generated/datasets/technical_indicators.md`
  - `docs/generated/datasets/valuation_data.md`
  - `docs/generated/llms.txt`
  - `docs/generated/llms-full.txt`

## 3. Website Files Changed
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`
- `public/llms.txt`
- `public/llms-full.txt`
- `scripts/check-dataset-factory-docs-sync.mjs`
- `package.json`

## 4. Routes Added/Updated
Preview docs routes now present:
- `/docs/api/dataset-factory`
- `/docs/api/dataset-factory/institutional-flow`
- `/docs/api/dataset-factory/technical-indicators`
- `/docs/api/dataset-factory/valuation-data`

Sidebar includes Dataset Factory preview entries under the existing Preview group.

## 5. llms Files Handling
- Updated `public/llms.txt` with a Dataset Factory preview section.
- Updated `public/llms-full.txt` with expanded Dataset Factory preview section.
- Added dataset ids:
  - `institutional_flow`
  - `technical_indicators`
  - `valuation_data`

## 6. Preview / Private Beta Guardrails
All Dataset Factory docs are explicitly preview semantics with:
- `production_ready=false`
- `not_investment_advice=true`
- visible `data_gaps`
- no overclaim of complete coverage/freshness
- no trading-action guidance

## 7. Validation Commands and Results
- `node scripts/check-dataset-factory-docs-sync.mjs` -> pass
- `npm run check:dataset-factory-docs` -> pass
- `npm run lint` -> pass
- `npm run build` -> pass
  - Build shows expected dynamic-route messages for auth/session pages and completes successfully.

## 8. Gate Decision
`DATASET_FACTORY_WEBSITE_PREVIEW_SYNC_PASS_READY_FOR_LOCAL_BUILD_REVIEW`

## 9. Recommended Next Task
Run local docs UI screenshot/content QA on:
- Dataset Factory overview + 3 dataset pages
- docs sidebar ordering
- `/llms.txt` and `/llms-full.txt` rendered content

Then proceed with website preview sync handoff prompt.

## 10. Safety Confirmation
- No website deploy
- No push
- No DB write/migration
- No backend API/auth/pricing changes
- No external live-source request
- No changes to `tw-feature-engine` or `tw-ai`
