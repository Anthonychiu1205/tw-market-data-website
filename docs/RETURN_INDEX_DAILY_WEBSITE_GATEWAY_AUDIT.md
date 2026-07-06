# Return Index Daily Website Gateway Audit

## 1. Objective
This task audits only the website repo readiness for `return_index_daily`.
No website gateway implementation was performed.
No backend repo changes, deploy, push, pricing edits, entitlement edits, dashboard edits, DB write, or migration were performed.

## 2. Backend Starting Point
Backend source of truth was treated as fixed input only:
- Backend repo: `/Volumes/DEV_USB/Projects/tw-feature-engine`
- Latest backend gate: `D4R10_RETURN_INDEX_DAILY_WEBSITE_GATEWAY_PROPOSAL_PASS`
- Latest backend commit: `2940723`
- Backend route: `GET /v2/datasets/return-index-daily`
- Backend dataset: `return_index_daily`
- Backend status:
  - route implemented
  - manifest fixed
  - exposure_status=`internal_api_only`
  - has_read_api_route=`true`
  - has_db_data=`true`
  - has_dataset_catalog_entry=`true`
  - has_freshness_entry=`true`
  - public_sellable=`false`
  - not_investment_advice=`true`

Safety implication:
- website should not treat this dataset as public sellable product yet
- website should not wire pricing, entitlement, checkout, or dashboard positioning in this task
- safest first surface is API Docs / Playground only

## 3. Existing Website Dataset Gateway Architecture
The current website dataset surface is not driven dynamically from the backend manifest.
It is a mixed hardcoded content model with a shared gateway route.

Evidence table:

| component | file | evidence | conclusion |
|---|---|---|---|
| public dataset gateway route | `app/v2/datasets/[dataset]/route.ts` | single route authenticates API key, checks entitlement, applies usage/cache policy, proxies dataset request | website already has one central gateway entry pattern for `/v2/datasets/*` |
| docs API dynamic page shell | `app/docs/[...slug]/page.tsx` | resolves docs pages from content source and renders `ApiRunPlayground` when `apiReference` exists | API docs pages are content-driven, not backend-manifest-driven |
| docs page contracts | `src/content/docs-pages.ts` | endpoint, params, examples, response fields, notes, status examples are encoded in TS content | API docs are hardcoded/schema-authored in repo |
| docs navigation | `src/content/docs-sidebar.ts` | API groups and sidebar hrefs are explicitly listed | sidebar/nav is hardcoded |
| dataset catalog / landing pages | `src/content/datasets.ts`, `app/datasets/[slug]/page.tsx`, `app/datasets/page.tsx` | dataset SEO/catalog pages come from local content entries | dataset marketing/catalog surface is separate from API docs |
| run playground helpers | `src/lib/docs/run-playground.ts`, `src/components/docs/api-run-playground.tsx` | docs pages can render live run button from endpoint contract | playground is reusable once a docs API page exists |
| internal dashboard playground | `app/api/dashboard/playground/route.ts` | allowlist of backend endpoints is explicit | dashboard playground endpoint list is also hardcoded |
| pricing / entitlement | `src/lib/gateway/auth.ts`, `src/lib/gateway/entitlement.ts`, pricing/docs references | gateway has plan/auth behavior, but pricing tables and sellable positioning are separate product layers | docs-only integration does not require pricing change |
| dashboard usage | docs + dashboard route files | dashboard/playground/product analytics exist, but are separate from docs page creation | no dashboard work is required for first safe surface |

Conclusion:
- website gateway architecture is known
- new dataset onboarding is explicit repo work, not automatic manifest sync
- the minimum safe website step is a docs contract page, optionally with run playground support through existing components

## 4. API Docs / Playground Convention
Current convention is clear enough for a docs-first rollout.

Observed pattern from existing datasets:
- `market-index` was added as docs-only sync by editing:
  - `src/content/docs-pages.ts`
  - `src/content/docs-sidebar.ts`
- `security-master` followed the same docs-first pattern
- `institutional-flow` and `securities-lending` are exposed via the same docs/playground shell

What is hardcoded vs dynamic:
1. Dataset pages: hardcoded/content-authored
2. API Docs pages: hardcoded/content-authored
3. Playground endpoint contract: schema/content-driven from `apiReference`
4. Sidebar/nav: hardcoded
5. Route examples and response examples: hardcoded in `src/content/docs-pages.ts`
6. Dataset metadata config: hardcoded in `src/content/datasets.ts`
7. Public/sellable/entitlement flags: handled outside docs pages; not automatically inferred from backend manifest
8. OpenAPI/public exposure: separate product/public surface, not implied by adding docs page

Therefore, adding a new dataset usually means changing some combination of:
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`
- `src/content/datasets.ts` only if a dataset landing page/catalog entry is desired
- `app/api/dashboard/playground/route.ts` only if dashboard internal playground must support the dataset
- focused tests for docs/playground contract if the endpoint is newly exposed in UI

## 5. Return Index Daily Gateway Readiness
Target backend route for audit:
- `GET /v2/datasets/return-index-daily`

Expected query surface from backend proposal:
- `market`
- `index_id`
- `start_date`
- `end_date`
- `limit`

Expected allowed values:
- `market`: `TWSE`, `TPEx`
- `index_id`: `TAIEX_TOTAL_RETURN`, `TPEX_RETURN_INDEX`
- `default_limit=100`
- `max_limit=500`

Required copy that must be preserved if implemented:
- Total Return Index
- Different from price index
- Source: TWSE / TPEx official
- Not investment advice
- Not a buy/sell signal

Readiness assessment:
1. API Docs only integration: yes, feasible
2. Docs Run playground integration: yes, feasible via existing `apiReference` + `ApiRunPlayground`
3. New frontend type strictly required: no separate runtime client type is required for docs-only path; docs content contract is enough
4. New API client function strictly required: no for docs page itself; maybe only if dashboard/internal client allowlist is needed later
5. Response example needed: yes
6. Docs copy needed: yes
7. Sidebar entry needed: yes
8. Dashboard card needed: no
9. Pricing / entitlement change needed: no
10. Free/non-sellable positioning can be preserved: yes
11. Merge into existing `market-index` page: should avoid
12. Separate page from `market-index`: yes, recommended

Why separate from `market-index`:
- `market-index` currently documents a price-index-like market index surface
- `return-index-daily` has different semantics and must clearly state total-return behavior
- combining them would blur user understanding and increase misuse risk

## 6. Required Copy / Safety Warnings
If implemented, the website copy should explicitly include:
- `Total Return Index`
- `Different from price index`
- `Source: TWSE / TPEx official`
- `Not investment advice`
- `Not a buy/sell signal`

Recommended extra wording:
- total return index includes reinvestment-style return interpretation and should not be read as the same thing as a plain price index series
- use the dataset together with lineage / gaps / source notes where provided

## 7. Pricing / Entitlement Position
For this dataset, pricing and entitlement should remain unchanged in the first website step.

Recommended position:
- no pricing page edit
- no entitlement UI edit
- no checkout/billing edit
- no dashboard feature-card introduction
- no claim that dataset is public sellable
- keep backend posture as `internal_api_only` until a separate public exposure gate exists

Safe first surface:
- API Docs / Playground only

## 8. Recommended Path
Decision:
- `website_gateway_audit_decision = ready_for_api_docs_only_implementation`

Reasoning:
- website dataset gateway convention is known, not unknown
- docs/playground convention already exists and is reusable
- no dashboard/pricing/entitlement work is needed for the first surface
- backend route is already defined and should stay backend-only plus docs contract until a separate public exposure decision

Recommended next task:
- `return_index_daily_api_docs_only_implementation`

Not recommended as immediate next step:
- dashboard implementation
- pricing table change
- entitlement change
- product sellable positioning
- merging this dataset into current `market-index` page

## 9. Files That Would Change In Implementation
Most likely implementation scope for API-docs-only path:
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`

Possible but not required in the first docs-only step:
- `app/api/dashboard/playground/route.ts`
  - only if internal dashboard playground must explicitly allow this endpoint
- `tests/docs-run-playground-real-api.test.mjs`
  - if docs/playground contract coverage is extended
- `src/content/datasets.ts`
  - only if a dataset landing page/catalog entry is intentionally added later

Files that should not be part of the first safe step:
- pricing pages
- entitlement logic
- checkout/billing routes
- dashboard feature cards
- backend repo files

## 10. Validation
Requested commands were attempted:
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm test`
- `corepack pnpm build`

Observed results:
1. `corepack pnpm lint`
   - failed before lint execution because `pnpm` attempted dependency reconciliation inside `node_modules` and hit `ENOENT` while moving packages installed by a different package manager
2. `corepack pnpm typecheck`
   - package script is not defined in `package.json`
   - command path is also affected by the same `pnpm` dependency reconciliation issue
3. `corepack pnpm test`
   - package script is not defined in `package.json`
   - command path is also affected by the same `pnpm` dependency reconciliation issue
4. `corepack pnpm build`
   - entered dependency reconciliation/install behavior instead of going directly to a stable build result
   - this indicates repo package-manager state drift, not a return-index-specific website contract blocker

Important interpretation:
- validation noise here is environmental/package-manager-state-related
- it should not be treated as evidence that `return_index_daily` docs-only onboarding is architecturally blocked

## 11. Next Action
Recommended next action:
- implement `return_index_daily` as a separate API docs page and sidebar entry only
- preserve internal/non-sellable posture
- keep pricing/entitlement/dashboard untouched
- keep it distinct from `market-index`

Suggested implementation framing:
- route target in docs: `GET /v2/datasets/return-index-daily`
- params documented: `market`, `index_id`, `start_date`, `end_date`, `limit`
- limits documented: `default_limit=100`, `max_limit=500`
- required copy included exactly as above

Final audit conclusion:
- website is ready for a docs-first, playground-capable, non-sellable `return_index_daily` surface
- website is not yet being asked to expose it as a priced/public product, and should not do so in the first step
