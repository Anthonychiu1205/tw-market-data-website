# Dataset Factory Website Docs UI/Content QA (2026-05-27T13:25:47Z)

## 1. Objective
Validate Dataset Factory preview docs sync in local website UI/content surfaces after commit `99a4038814fa9c0793511aee235846d777bf4950`, without any deploy or production-launch claim.

## 2. Commit Under QA
- Commit: `99a4038814fa9c0793511aee235846d777bf4950`
- Message: `docs: sync Dataset Factory preview docs`

## 3. Routes Checked
- `/docs/api/dataset-factory`
- `/docs/api/dataset-factory/institutional-flow`
- `/docs/api/dataset-factory/technical-indicators`
- `/docs/api/dataset-factory/valuation-data`
- `/llms.txt`
- `/llms-full.txt`

## 4. llms Files Checked
- `public/llms.txt`
- `public/llms-full.txt`
- required dataset ids present:
  - `institutional_flow`
  - `technical_indicators`
  - `valuation_data`
- guardrail language present:
  - not investment advice
  - preserve data_gaps visibility
  - no overclaim / no transaction-decision guidance

## 5. Static Content Findings
- `src/content/docs-pages.ts` contains all 4 Dataset Factory preview doc routes and topic blocks.
- `src/content/docs-sidebar.ts` includes Dataset Factory + three dataset entries under Preview section.
- Each dataset page block includes:
  - `release_label: private_beta_preview`
  - `production_ready: false`
  - `not_investment_advice: true`
  - explicit `data_gaps` visibility wording.
- No production-launch overclaim found in Dataset Factory sections.

## 6. Local Route Findings
- `curl -I` for all six target routes returned `HTTP/1.1 200 OK`.
- docs page HTML/title metadata confirms Dataset Factory preview pages resolve and render content.
- llms endpoints are served as plain text and include required dataset ids/guardrails.
- Sidebar entries are present in docs content configuration (route-level check passed).

## 7. Evidence Summary (curl/check)
- `curl -I http://localhost:3000/docs/api/dataset-factory*` -> 200 for all four docs routes.
- `curl -I http://localhost:3000/llms.txt` -> 200.
- `curl -I http://localhost:3000/llms-full.txt` -> 200.
- `curl -s .../llms.txt | rg institutional_flow|technical_indicators|valuation_data` -> matched.
- `curl -s .../llms-full.txt | rg institutional_flow|technical_indicators|valuation_data` -> matched.

## 8. Fixes Applied
- No additional code/content fixes needed in this QA round.
- Scope remained QA/report only.

## 9. Validation Commands and Results
- `node scripts/check-dataset-factory-docs-sync.mjs` -> pass
- `npm run check:dataset-factory-docs` -> pass
- `npm run lint` -> pass
- `npm run build` -> pass
- `npm run dev -- --port 3000` + local curl QA -> pass

## 10. Gate Decision
`DATASET_FACTORY_WEBSITE_DOCS_UI_CONTENT_QA_PASS_READY_FOR_PREVIEW_HANDOFF`

## 11. Recommended Next Task
- Preview handoff / manual stakeholder review (content tone + navigation UX) before any deploy action.
- Optional follow-up: capture visual screenshots for the four docs pages and llms endpoints as QA attachment.

## 12. Safety Confirmation
- No backend API change
- No auth/pricing/billing change
- No DB write / migration
- No live external request
- No deploy / push
- No changes to `tw-feature-engine` or `tw-ai`
