# Return Index Daily Website Content QA Report

## 1. Objective
Content QA and route smoke only.

This task did not add new product behavior.
It only audited the already-implemented website docs surface for `return_index_daily`.

## 2. Starting Point
- previous gate: `RETURN_INDEX_DAILY_API_DOCS_ONLY_IMPLEMENTATION_PASS`
- previous commit: `3885d21c1489982b2851f715a7cc8e9d1b593f1d`
- backend route: `GET /v2/datasets/return-index-daily`
- docs route: `/docs/api/market-prices/return-index-daily`
- repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`

## 3. Package Manager Status
Observed baseline:
- `node`: `v22.22.0`
- `corepack`: `0.34.0`
- `pnpm`: `11.8.0`
- `npm`: `10.9.4`
- `package-lock.json`: present
- `pnpm-lock.yaml`: absent
- `node_modules`: present

Available scripts:
- `lint`: present
- `build`: present
- `typecheck`: missing
- `test`: missing

Assessment:
- `package_manager_status = drift_present`

Reason:
- the repo currently presents as npm-installed (`package-lock.json` + populated `node_modules`) but validation is being invoked through `corepack pnpm`
- `pnpm` does not enter a clean deterministic no-op path; it enters dependency reconciliation / tarball fetching flow
- this is an environment/package-manager-state issue, not a `return_index_daily` docs content issue

## 4. Docs Page QA
Confirmed in `src/content/docs-pages.ts`:
- docs page topic exists for `/docs/api/market-prices/return-index-daily`
- endpoint is exactly `GET /v2/datasets/return-index-daily`
- title is `Return Index Daily API`
- subtitle keeps the dataset separate from `market-index`

Confirmed content requirements:
- `Total Return Index`
- `Different from price index`
- `Source: TWSE / TPEx official`
- `Not investment advice`
- `Not a buy/sell signal`

Confirmed query parameter contract:
- `market`
  - `TWSE`
  - `TPEx`
- `index_id`
  - `TAIEX_TOTAL_RETURN`
  - `TPEX_RETURN_INDEX`
- `start_date`
- `end_date`
- `limit`
  - default `100`
  - max `500`

Confirmed example request contract:
- `/v2/datasets/return-index-daily?market=TWSE&index_id=TAIEX_TOTAL_RETURN&start_date=2026-05-01&end_date=2026-05-29&limit=10`
- `/v2/datasets/return-index-daily?market=TPEx&index_id=TPEX_RETURN_INDEX&limit=10`

Confirmed response field coverage:
- `trade_date`
- `market`
- `index_id`
- `index_name`
- `return_index_value`
- `source_name`
- `source_url`
- `request_context.not_investment_advice`

## 5. Sidebar QA
Confirmed in `src/content/docs-sidebar.ts`:
- sidebar entry exists
- href is exactly `/docs/api/market-prices/return-index-daily`
- placement is under `市場與價格`
- it is separate from `市場指數 / Market Index`

Confirmed in `src/content/docs-pages.ts` sidebar/nav metadata:
- `docsSidebarNav` also includes the matching href
- no merge with `market-index`

## 6. Playground QA
Confirmed docs-shell pattern:
- API docs pages are rendered through `app/docs/[...slug]/page.tsx`
- API reference pages render `ApiRunPlayground`
- the new page uses `apiReferenceFactory`, so it participates in the existing docs run-playground convention

Confirmed playground contract from content:
- method: `GET`
- endpoint: `/v2/datasets/return-index-daily`
- example query includes `market`, `index_id`, `start_date`, `end_date`, `limit`

Assessment:
- `playground_status = ready_via_existing_docs_metadata`

No new playground architecture was required.
No dashboard playground path was changed.

## 7. Route Smoke Status
Static/content-level route evidence is good:
- docs slug exists exactly once in content source
- sidebar href matches page href
- endpoint metadata matches the intended backend route

Local route/build smoke status:
- `route_smoke_status = route_smoke_blocked_by_package_manager_drift`

Reason:
- package-manager state is not currently stable enough for clean deterministic `pnpm`-based route/build smoke
- this blocker is environmental and should not be interpreted as a docs content contract failure

## 8. Safety Copy Scan
Safety diff scan found only expected negative-warning usages:
- `Not a buy/sell signal`
- `not_investment_advice`
- negative explanation about avoiding positive recommendation language

No positive recommendation phrases were introduced.

Assessment:
- `safety_scan_status = pass_negative_warning_only`

## 9. Validation
Readable-file checks:
- `docs-pages readable`: pass
- `docs-sidebar readable`: pass
- `implementation report readable`: pass

Requested route/build validation:
- `corepack pnpm lint`: not treated as a reliable deterministic result due package-manager drift
- `corepack pnpm build`: not treated as a reliable deterministic result due package-manager drift / dependency transport flow
- `typecheck`: script missing
- `test`: script missing

Conclusion:
- content QA passed
- route/build smoke remains blocked by environment/package-manager drift

## 10. Remaining Blockers
Current blocker:
- package-manager drift between npm-style repo state and pnpm-based validation entrypoint
- additional transport/download instability during `pnpm` dependency reconciliation path

Not a blocker for content correctness:
- docs page content
- sidebar placement
- playground metadata
- safety copy

## 11. Next Action
Recommended next action:
- stabilize website validation environment before asking for build/deploy-style route smoke
- keep `return_index_daily` in docs-only posture until that environment is stable
- if desired, run a dedicated package-manager/validation-lane stabilization task before any deploy-facing website smoke
