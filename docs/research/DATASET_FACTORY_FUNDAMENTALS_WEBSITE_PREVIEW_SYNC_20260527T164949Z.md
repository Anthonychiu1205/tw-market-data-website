# Dataset Factory Fundamentals Website Preview Sync

## 1. Objective
Sync Dataset Factory fundamentals generated docs from `tw-feature-engine` into `tw-market-data-website` as preview/private beta docs only.

## 2. Source Commit / Manifest Used
- Source repo: `/Volumes/DEV_USB/Projects/tw-feature-engine`
- Source commit: `fb335ed52d558fc98415faf996abf972a59c713d`
- Source gate: `DATASET_FACTORY_FUNDAMENTALS_COVERAGE_SYNC_PASS_READY_FOR_WEBSITE_PREVIEW_SYNC`
- Source manifest:
  - `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/dataset_website_sync_manifest.json`
- Source docs consumed:
  - `.../docs/generated/datasets/income_statement.md`
  - `.../docs/generated/datasets/balance_sheet.md`
  - `.../docs/generated/datasets/cash_flow.md`
  - `.../docs/generated/llms.txt`
  - `.../docs/generated/llms-full.txt`

## 3. Website Files Changed
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`
- `public/llms.txt`
- `public/llms-full.txt`
- `scripts/check-dataset-factory-docs-sync.mjs`

## 4. Routes Added
- `/docs/api/dataset-factory/income-statement`
- `/docs/api/dataset-factory/balance-sheet`
- `/docs/api/dataset-factory/cash-flow`

Existing Dataset Factory preview routes retained:
- `/docs/api/dataset-factory`
- `/docs/api/dataset-factory/institutional-flow`
- `/docs/api/dataset-factory/technical-indicators`
- `/docs/api/dataset-factory/valuation-data`

## 5. llms Files Handling
`public/llms.txt` and `public/llms-full.txt` were updated to include fundamentals preview entries:
- `income_statement`
- `balance_sheet`
- `cash_flow`

Guardrails preserved:
- not investment advice
- production_ready=false semantics
- explicit data_gaps visibility requirement
- no buy/sell/target_price/recommendation language
- no overclaim beyond verified fundamentals window `2023Q2..2026Q1`

## 6. Preview / Private Beta Wording
Each new fundamentals preview page block includes:
- preview/private beta framing
- `production_ready=false`
- `not_investment_advice=true`
- explicit data gaps section
- verified quarter range (`2023Q2..2026Q1`) and `latest_quarter=2026Q1`

## 7. Data Gaps Preserved
- Income statement: sparse nulls (`revenue=10`, `gross_profit=4`, `operating_income=3`)
- Balance sheet: unresolved allowlisted `2882/2025/Q1..Q4`, sparse nulls in total assets/liabilities, cash and cash equivalents mostly null by current contract
- Cash flow: free cash flow deferred-null by current contract, sparse nulls in financing cash flow, net cash flow column absent

## 8. Validation Commands / Results
- `node scripts/check-dataset-factory-docs-sync.mjs` -> pass
- `npm run check:dataset-factory-docs` -> pass
- `npm run lint` -> pass
- `npm run build` -> pass

## 9. Gate Decision
`DATASET_FACTORY_FUNDAMENTALS_WEBSITE_PREVIEW_SYNC_PASS_READY_FOR_UI_QA`

## 10. Recommended Next Task
`Dataset Factory fundamentals docs UI/content QA`

## 11. Safety Confirmation
- No `tw-feature-engine` changes
- No `tw-ai` changes
- No backend/API/auth/pricing changes
- No DB write / migration
- No dependency install
- No deploy / push
- No secrets output
