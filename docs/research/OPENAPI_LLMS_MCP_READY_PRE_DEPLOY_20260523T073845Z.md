# OpenAPI + LLMS + MCP-ready pre-deploy audit

## Scope

Read-only pre-deploy audit for commits:

- `8e2c8bb` Revert second-wave dataset landing pages
- `7d17c69` OpenAPI/AI-agent metadata foundation

No code changes, no commit, no push, no deploy.

## Safety

- Branch: `main`
- Staged files: none
- Tracked dirty files: none
- Untracked: `artifacts/`, `docs/research/` (acceptable)
- Temporary payment setup route: absent

## Dataset slug checks

Second-wave dataset landing slugs remain removed from dataset metadata/sitemap/llms landing sections:

- tpex-daily-price
- technical-indicators
- valuation-data
- issuer-profile
- margin-short
- company-events

First-wave slugs remain retained:

- twse-daily-price
- monthly-revenue
- income-statement
- balance-sheet
- institutional-flow

## OpenAPI checks

- `public/openapi.json` exists
- OpenAPI version `3.1.0`
- parse PASS
- phase2 core endpoint/schema check PASS
- `$ref` integrity and duplicate parameter check PASS

## LLMS/MCP wording checks

- `llms.txt` and `llms-full.txt` reference `https://twmarketdata.com/openapi.json`
- MCP remains preview/planned, no live-hosted claim
- Includes production MCP readiness caveat (stable contracts, coverage audits, entitlement controls, explicit productization approval)
- No overclaims for full 3Y/cash flow complete detected in llms copies

## Build/lint

- `npm run lint`: PASS
- `npm run build`: PASS (with retry warnings during static generation; final success)

## Gate decision

`READY_FOR_OPENAPI_LLMS_MCP_READY_PUSH_DEPLOY`
