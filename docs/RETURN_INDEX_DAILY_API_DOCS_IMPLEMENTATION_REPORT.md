# Return Index Daily API Docs Implementation Report

## 1. Objective
Implement `return_index_daily` as an API Docs only website surface.

This rollout is intentionally limited to:
- docs page content
- docs sidebar / nav entry
- existing Docs Run playground convention

Non-goals for this task:
- no dashboard work
- no pricing work
- no entitlement work
- no dataset landing page/catalog work
- no deploy
- no push
- no backend repo modification

## 2. Backend Starting Point
Backend route:
- `GET /v2/datasets/return-index-daily`

Backend status treated as fixed input:
- route implemented
- independent from `/v2/datasets/market-index`
- manifest status fixed
- `exposure_status=internal_api_only`
- `has_read_api_route=true`
- `has_db_data=true`
- `has_dataset_catalog_entry=true`
- `has_freshness_entry=true`
- `public_sellable=false`
- `not_investment_advice=true`

## 3. Website Changes
Changed files:
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`

Added website docs surface:
- docs route: `/docs/api/market-prices/return-index-daily`
- sidebar placement: `市場與價格`
- docs page uses existing `ApiRunPlayground` convention through `apiReferenceFactory`

No playground architecture was added.
No dashboard playground was added.
No pricing/entitlement/dashboard files were changed.

## 4. Content Added
The new docs page now documents:
- Title: `Return Index Daily API`
- Endpoint: `GET /v2/datasets/return-index-daily`
- Dataset: `return_index_daily`
- Description: `TWSE / TPEx total return index daily data`

Documented required copy:
- `Total Return Index`
- `Different from price index`
- `Source: TWSE / TPEx official`
- `Not investment advice`
- `Not a buy/sell signal`

Documented query parameters:
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

Documented example requests:
- `/v2/datasets/return-index-daily?market=TWSE&index_id=TAIEX_TOTAL_RETURN&start_date=2026-05-01&end_date=2026-05-29&limit=10`
- `/v2/datasets/return-index-daily?market=TPEx&index_id=TPEX_RETURN_INDEX&limit=10`

Documented response fields:
- `trade_date`
- `market`
- `index_id`
- `index_name`
- `return_index_value`
- `source_name`
- `source_url`
- `request_context.not_investment_advice`

## 5. Safety Copy Result
Safety wording is explicit and negative-only:
- the page states this is a `Total Return Index`
- the page states it is `Different from price index`
- the page states `Not investment advice`
- the page states `Not a buy/sell signal`

Safety scan result:
- `buy/sell`-related token matches are only from the negative warning phrase `Not a buy/sell signal`
- no positive recommendation language was introduced

## 6. Playground Result
Docs Run playground remains available through the existing docs shell.

Reason:
- the new page is wired via `apiReferenceFactory`
- `app/docs/[...slug]/page.tsx` already renders `ApiRunPlayground` for API reference pages
- no new playground component or dashboard route was required

## 7. Non-goals Confirmed
Not changed in this task:
- pricing
- entitlement
- dashboard
- billing / checkout
- dataset catalog landing page
- backend repo
- deploy
- push

## 8. Validation
Package-manager baseline observed before implementation:
- `package.json` has `lint` and `build`
- `package.json` does not have `typecheck`
- `package.json` does not have `test`
- repo has `package-lock.json`
- repo has `node_modules`
- repo does not have `pnpm-lock.yaml`

Lightweight checks:
- `src/content/docs-pages.ts` readable: pass
- `src/content/docs-sidebar.ts` readable: pass

Safety scan:
- changed diff scanned for recommendation tokens
- only expected negative warning matches were found

Requested validation commands:
- `corepack pnpm lint`
- `corepack pnpm build`

Observed validation status:
- `typecheck` script missing
- `test` script missing
- `pnpm` execution enters dependency reconciliation / tarball fetching instead of clean deterministic command execution
- this remains an environment/package-manager-state issue, not a docs contract correctness issue

Validation summary for this task:
- implementation content is in place
- validation is partially blocked by package-manager drift / dependency reconciliation behavior

## 9. Remaining Gaps
Still deferred after this task:
- no dataset landing page
- no public product/sellable positioning
- no pricing/entitlement exposure
- no dashboard card
- no deploy verification
- no public exposure claim beyond docs-only contract

## 10. Next Action
Recommended next action:
- keep `return_index_daily` as docs-only until website package-manager state is stabilized or a deploy-ready website validation lane is explicitly approved
- if desired, next scoped task can be a website content QA / route smoke after environment stabilization
