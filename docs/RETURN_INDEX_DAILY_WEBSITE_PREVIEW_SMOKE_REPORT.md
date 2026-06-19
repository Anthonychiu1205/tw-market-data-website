# Return Index Daily Docs Preview Smoke Report

## Objective
This task performed a local no-deploy preview smoke for the Return Index Daily docs route in the website repo, with a focus on package-manager diagnosis, static route verification, and build-route readiness.

## Starting Point
- Website repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Prior completion basis:
  - `3885d21` docs: add return index daily api docs
  - `a60de0b` docs: qa return index daily website docs
- Target docs route: `/docs/api/market-prices/return-index-daily`
- Backend route reference only: `/v2/datasets/return-index-daily`

## Package Manager Diagnosis
- `package-lock.json` exists.
- `pnpm-lock.yaml` is absent.
- `package.json` does not declare a `packageManager` field.
- Repo behavior matches an `npm`-managed project, not a `pnpm` project.
- `node_modules` exists, but key local binaries are broken symlinks:
  - `node_modules/.bin/eslint -> ../eslint/bin/eslint.js` (broken)
  - `node_modules/.bin/prisma -> ../prisma/build/index.js` (broken)
- Result: local preview commands are blocked by install-state / package-manager drift, not by the Return Index docs content itself.

## Validation Commands
Commands executed:

```bash
npm run lint --if-present
npm run build --if-present
```

Observed results:
- `npm run lint --if-present` failed with `sh: eslint: command not found`
- `npm run build --if-present` failed with `sh: prisma: command not found`

Follow-up diagnostics confirmed both `.bin` entries are broken symbolic links.

## Docs Route Static QA
Static route/content checks passed:
- Sidebar contains `/docs/api/market-prices/return-index-daily`
- Docs page registry contains the Return Index Daily entry
- API reference builder exists for Return Index Daily
- Docs route resolves through the existing `app/docs/[...slug]/page.tsx` content pipeline
- Endpoint reference is `/v2/datasets/return-index-daily`
- Topic remains explicitly separated from `market-index`

## Local Build / Route Smoke
- Static content and route registration: pass
- Local preview build execution: blocked by broken local dependency symlinks
- No deploy performed
- No push performed

## Safety Scan
Return Index Daily docs content remains within safe boundary:
- `not_investment_advice` warning present
- `Not a buy/sell signal` warning present
- No positive investment recommendation copy introduced in the Return Index Daily docs additions reviewed in this task

## Remaining Blocker
The blocker is environmental/package-manager drift inside local install state:
- `eslint` binary link is broken
- `prisma` binary link is broken
- Therefore `npm run lint --if-present` and `npm run build --if-present` cannot complete locally

## Recommendation
Next task should be a scoped website dependency baseline repair before repeating preview smoke:
- restore a consistent `npm` install state for this repo
- verify `node_modules/.bin/eslint` and `node_modules/.bin/prisma` resolve correctly
- rerun `npm run lint --if-present`
- rerun `npm run build --if-present`
- then repeat the docs preview smoke for `/docs/api/market-prices/return-index-daily`

## Final Gate
`RETURN_INDEX_DAILY_WEBSITE_PREVIEW_SMOKE_BLOCKED_BY_PACKAGE_MANAGER_DRIFT`
