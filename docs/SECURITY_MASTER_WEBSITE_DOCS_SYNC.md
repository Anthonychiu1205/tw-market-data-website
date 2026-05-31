# Security Master Website Docs Sync

## Backend Evidence
- Source repo: `/Volumes/DEV_USB/Projects/tw-feature-engine`
- Commit: `8a862f3`
- Report: `docs/research/P1_SECURITY_MASTER_DATASET_FACTORY_DOCS_SYNC_20260531T044702Z.md`
- Routes:
  - `GET /v2/datasets/security-master`
  - `GET /v2/securities/{ticker}`
- Dataset id: `security-master`
- Registry key: `security_master`
- Status: `private_beta`

## Files Changed
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`
- `docs/SECURITY_MASTER_WEBSITE_DOCS_SYNC.md`

## Route Added / Updated
- Added new docs API page route:
  - `/docs/api/company/security-master`
- Kept existing issuer profile page:
  - `/docs/api/company/issuer-profile`

## Sidebar Placement
- API sidebar placement:
  - `APIS → 公司與事件 → 公司主檔 / Security Master`
- Sidebar href now points to:
  - `/docs/api/company/security-master`

## Endpoint Coverage in Docs
- Dataset endpoint:
  - `GET /v2/datasets/security-master`
- Lookup endpoint:
  - `GET /v2/securities/{ticker}`
- Query params documented:
  - `market`
  - `ticker`
  - `active_only`
  - `limit`
  - `include_ai_context`
  - `include_coverage`
  - `include_data_gaps`

## AI Context Documentation
Documented response sections:
- `security_identity`
- `market_identity`
- `dataset_coverage`
- `source_lineage`
- `data_gaps`
- `safe_usage_notes`
- `survivorship_bias_warning`
- `available_tools_or_endpoints`

Documented MCP/tool plan:
- `security_master_lookup(ticker, market?, include_coverage?, include_data_gaps?)`

## Limitations Included
- current master v1
- not full PIT lifecycle
- not survivorship-safe for historical backtests
- TPEx official issuer profile not integrated (held policy)
- FinMind used only as benchmark, not production source
- not investment advice

## Run Button
- New page uses API reference contract shape, so docs Run playground remains available.
- Sample response is static/mock in docs content; no secret hardcoding.

## Validation
- `npm run lint`: pass
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: pass

