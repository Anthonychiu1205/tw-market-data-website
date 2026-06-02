# LLMS Readability Cleanup

- Task: `LLMS-readability-cleanup`
- Timestamp (UTC): `2026-05-23T04:43:10Z`
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`

## Summary
This pass rewrites `public/llms.txt` and `public/llms-full.txt` for better AI-crawler and developer readability while preserving conservative product claims.

## Key Improvements
- Clear section headings in both short and full index files.
- Absolute URL normalization for major links.
- Explicit separation of:
  - product overview
  - documentation entrypoints
  - dataset landing pages
  - API docs groups
  - guides/workflows
  - coverage/freshness caveats
  - OpenAPI/LLMS resources
  - MCP status
  - safety/commercial links
- Preserved safety constraints:
  - no MCP live claim
  - no full-coverage overclaim
  - no investment/trading guidance language

## Link Validity
Checked required routes and key URLs listed in this cleanup. All checks returned HTTP 200.

## Validation
- `npm run lint`: PASS
- `npm run build`: PASS
- Post-rewrite line count:
  - `public/llms.txt`: 49
  - `public/llms-full.txt`: 96

## Scope Control
- Modified files: `public/llms.txt`, `public/llms-full.txt`
- No backend/auth/billing/API behavior changes.
- No push/deploy executed.
