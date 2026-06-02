# OpenAPI / LLMS / MCP-ready Production Deploy

## Summary

- Pushed `main` successfully (`8a8d30d..7d17c69`).
- Vercel production deployment reached **Ready**.
- Aliases include both:
  - https://twmarketdata.com
  - https://www.twmarketdata.com
- Production smoke tests passed for OpenAPI, llms indexes, docs openapi page, and first-wave dataset pages.
- Temporary internal setup route remains unavailable in production (`404`).

## Local validation

- `npm run lint`: PASS
- `npm run build`: PASS
- Local OpenAPI parse/core checks: PASS

## Production checks

- `/openapi.json`: 200 + parse ok + core endpoint schema checks pass
- `/llms.txt`: 200
- `/llms-full.txt`: 200
- `/docs/openapi-spec`: 200
- `/datasets` and 5 first-wave slug pages: 200

## Safety

- No code changes in this turn.
- No commit in this turn.
- No DB write, no migration.
- No secrets or DATABASE_URL disclosed.

## Gate

- `OPENAPI_LLMS_MCP_READY_PRODUCTION_DEPLOY_PASS`
