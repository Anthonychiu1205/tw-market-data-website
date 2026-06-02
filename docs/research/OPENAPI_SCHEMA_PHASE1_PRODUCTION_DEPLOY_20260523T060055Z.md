# OpenAPI Schema Phase1 Production Deploy

- Timestamp (UTC): 20260523T060055Z
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Target commit: `8a8d30d`

## Pre-push & Local Validation
- Branch: `main`
- Staged area: empty
- Tracked dirty files: none
- Temporary setup route: absent (local)
- OpenAPI local parse/core checks: pass
- `npm run lint`: pass
- `npm run build`: pass (with non-blocking static retry warnings)

## Push
- `git push origin main`: success
- Range: `f89849d..8a8d30d`

## Vercel Deploy
- Deployment: `dpl_4H2Dm4YVjchYxv1MNpce4ZYMMtVW`
- Status: Ready
- Aliases include:
  - `https://twmarketdata.com`
  - `https://www.twmarketdata.com`

## Production Smoke
- `/openapi.json`: HTTP 200
- `/docs/openapi-spec`: HTTP 200
- `/llms.txt`: HTTP 200
- `/llms-full.txt`: HTTP 200
- `/api/internal/payment-review-account-setup`: HTTP 404 (expected; route not exposed)

OpenAPI production checks:
- JSON parse: pass
- Summary: `openapi=3.1.0`, `paths=9`, `schemas=11`
- Core 5 endpoints operation/responses check: pass

LLMS checks:
- `llms.txt` references `/openapi.json`
- `llms-full.txt` references `/openapi.json`

## Gate
`OPENAPI_SCHEMA_PHASE1_PRODUCTION_DEPLOY_PASS`
