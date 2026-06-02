# OpenAPI Schema Deepening Phase 1 (Core Datasets)

## Scope
Deepen machine-readable OpenAPI schema quality for 5 core dataset endpoints only:
- `/v2/datasets/twse-daily-price`
- `/v2/datasets/monthly-revenue`
- `/v2/datasets/income-statement`
- `/v2/datasets/balance-sheet`
- `/v2/datasets/institutional-flow`

## What changed
- Strengthened `public/openapi.json` with:
  - shared parameters for symbol/start_date/end_date/limit
  - shared schemas for envelope/meta/pagination/data_gaps/error/lineage
  - dataset-specific row schemas
  - shared error responses (400/401/429/500)
  - per-endpoint operationId/tags/externalDocs/examples
  - conservative coverage/data_gaps policy extensions

## Safety/Policy constraints respected
- No new API endpoints were invented.
- No backend/auth/billing/database behavior changes.
- No UI changes.
- No MCP live claim.
- No overclaim of full dataset coverage.

## Validation
- `public/openapi.json` parse: PASS
- Core schema structural check: PASS
- `npm run lint`: PASS
- `npm run build`: did not complete in this environment (stalled build process without explicit compile error output)

## Gate
- `NEED_BUILD_FIX` (operational build completion evidence missing in this run)
