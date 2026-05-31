# MARKET INDEX WEBSITE DOCS SYNC

## Backend evidence
- Backend repo: `/Volumes/DEV_USB/Projects/tw-feature-engine`
- Commit: `147fe2d`
- Report: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/P1_MARKET_INDEX_TAIEX_DATASET_FACTORY_DOCS_SYNC_20260531T050140Z.md`
- Dataset id: `market-index`
- Endpoint: `GET /v2/datasets/market-index`
- Table: `index_data_items`
- Scope: `TWSE_TAIEX` + `TWSE` + seed coverage (`2026-05-22` to `2026-05-28`)

## Files changed
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`

## Route added/updated
- Added docs route: `/docs/api/market-prices/market-index`
- Kept existing `/docs/api/market-prices/index-data` and `/docs/api/market-prices/market-breadth` unchanged

## Sidebar placement
- APIS → 市場與價格 → `市場指數 / Market Index`

## Endpoint docs coverage
- Endpoint: `GET /v2/datasets/market-index`
- Query params documented:
  - `index_code`
  - `market`
  - `start_date`
  - `end_date`
  - `limit`
  - `latest`
  - `include_data_gaps`
- Response sections documented:
  - `index_identity`
  - `market_identity`
  - `index_level`
  - `daily_change`
  - `turnover`
  - `source_lineage`
  - `data_gaps`
  - `safe_usage_notes`
  - `available_tools_or_endpoints`
- MCP/tool plan documented:
  - `market_index_lookup(index_code?, market?, latest?, start_date?, end_date?)`

## Limitations documented
- 目前只支援 `TWSE_TAIEX`
- 目前只支援 `TWSE`
- seed coverage only: `2026-05-22 ~ 2026-05-28`
- sector index rows held
- unknown index rows held
- market breadth not included
- market overview not included
- not full historical index coverage yet
- 非投資建議

## Validation result
- `npm run lint`: (see task run output)
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: (see task run output)
