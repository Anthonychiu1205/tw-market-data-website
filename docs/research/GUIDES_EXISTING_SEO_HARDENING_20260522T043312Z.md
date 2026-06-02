# GUIDES EXISTING SEO HARDENING

- Task: Guides-SEO-hardening-existing-pages
- Timestamp (UTC): 2026-05-22T04:33:12Z
- Repo: /Volumes/DEV_USB/Projects/tw-market-data-website

## Scope
Use existing workflow guides to improve teaching-style SEO and discoverability without creating many new pages.

## Guides Updated
1. /docs/workflows/company-fundamentals
2. /docs/workflows/capital-flow
3. /docs/workflows/market-status
4. /docs/workflows/fast-data-access
5. /docs/workflows/strategy-ai

## What Changed
- Added clearer audience/search-intent framing sections.
- Added practical workflow framing (query order, data-gaps handling, freshness checks).
- Added internal cross-links to dataset landing pages:
  - /datasets/monthly-revenue
  - /datasets/income-statement
  - /datasets/balance-sheet
  - /datasets/twse-daily-price
  - /datasets/institutional-flow
- Added machine-readable discoverability links where relevant:
  - /openapi.json
  - /llms.txt
  - /llms-full.txt
- Preserved safety language:
  - institutional-flow coverage still in progress
  - MCP remains preview/planned
  - no investment advice / no trading action guidance

## Additional Update
- Updated `public/llms-full.txt` to include `/docs/workflows/market-status` in workflow entrypoints.

## Validation
- `npm run lint`: PASS
- `npm run build`: PASS

## Gate
- READY_FOR_EXISTING_GUIDES_SEO_COMMIT
