# Docs ↔ Backend Dataset Mapping Audit

Generated: 2026-04-23 (Asia/Taipei)

## Scope
- Website docs source:
  - `/Users/ant/Documents/Playground/tw-market-data-website/src/content/docs-pages.ts`
  - `/Users/ant/Documents/Playground/tw-market-data-website/app/docs/[...slug]/page.tsx`
  - legacy route files under `/Users/ant/Documents/Playground/tw-market-data-website/app/docs/api/**`
- Backend source of truth:
  - `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/public_datasets/*.md`
  - `/Volumes/DEV_USB/Projects/tw-feature-engine/src/feature_engine/read_api/registry.py`
  - `/Volumes/DEV_USB/Projects/tw-feature-engine/src/feature_engine/read_api/external_data_api_boundary.py`
  - `/Volumes/DEV_USB/Projects/tw-feature-engine/src/feature_engine/catalog/data_topic_registry.py`

---

## A. Website docs page -> backend mapping table

Legend:
- **aligned**: docs route + endpoint + params + envelope match runtime
- **partially aligned**: route/endpoint mostly correct, but contract details are incomplete or drifted
- **stale/legacy**: legacy surface/redirect/generic page causing product confusion
- **missing backend mapping**: page exists but does not map cleanly to a real dataset contract

| Website docs route | Displayed endpoint | Backend route exists | Productized dataset mapping | Status | Notes |
|---|---|---:|---:|---|---|
| `/docs/api/market-prices/twse-daily-price` | `/v2/datasets/twse-daily-price` | Yes | Yes (`twse_daily_price`) | partially aligned | Runtime now injects `meta.plan/row_limit/is_limited` via row-limit middleware; page still documents only `dataset/rows/count`. |
| `/docs/api/market-prices/tpex-daily-price` | `/v2/datasets/tpex-daily-price` | Yes | Yes (`tpex_daily_price`) | partially aligned | Same `meta` drift as TWSE page. |
| `/docs/api/financial-growth/monthly-revenue` | `/v2/datasets/monthly-revenue` | Yes | Yes (`monthly_revenue`) | partially aligned | Endpoint/params match, but docs taxonomy still binds to `monthly_revenue_enhanced` topic id in schema group definition. |
| `/docs/api/financial-growth/valuation-data` | `/v2/datasets/valuation-data` | Yes | Yes (`valuation_data`) | partially aligned | Endpoint/params match; response docs omit runtime `meta` row-limit payload. |
| `/docs/api/market-prices/technical-indicators` | `/v2/datasets/technical-indicators` | Yes | Yes (`technical_indicators`) | partially aligned | Endpoint/params match; response docs omit runtime `meta`. |
| `/docs/api/financial-growth/income-statement` | `/v2/datasets/income-statement` | Yes | Yes (`income_statement`) | partially aligned | Endpoint/params match; response docs omit runtime `meta`. |
| `/docs/api/financial-growth/cash-flow-statement` | `/v2/datasets/cash-flow-statement` | Yes | Yes (`cash_flow_statement`) | partially aligned | Endpoint/params match; response docs omit runtime `meta`. |
| `/docs/api/financial-growth/financial-statements` | mixed concept page (income + cash flow) | N/A | Indirect | partially aligned | Product concept page exists, but does not include balance sheet even though backend has `balance_sheet` productized endpoint. |
| `/docs/api/capital-flow/margin-short` | `/v2/datasets/margin-short` | Yes | Yes (`margin_short`) | aligned | Endpoint-style page includes plan-limit `meta` fields and matches runtime shape. |
| `/docs/api/capital-flow/institutional-flow` | generic schema-ready page (no concrete endpoint contract section) | Yes (`/v2/datasets/institutional-flow`) | Yes (`institutional_flow`) | partially aligned | Route exists and topic exists, but page is not fully endpoint-style contract (missing concrete params/envelope examples). |
| `/docs/api/financial-growth/financials-canonical` | `/v2/datasets/financials` | Yes | Canonical supplemental | aligned (supplemental) | Correctly marked canonical/supplemental. |
| `/docs/api/financial-growth/valuations-canonical` | `/v2/datasets/valuations` | Yes | Canonical supplemental | aligned (supplemental) | Correctly marked canonical/supplemental. |
| `/docs/api/market-prices/index-data` | `/v2/datasets/index-data` | Yes | Non-productized live route | aligned | Maps to real backend route; not in the 10 productized set. |
| `/docs/api/market-prices/market-breadth` | `/v2/datasets/market-breadth` | Yes | Non-productized live route | aligned | Maps to real backend route; not in the 10 productized set. |
| `/docs/api/company/issuer-profile` | `/v2/datasets/issuer-profile` | Yes | Non-productized live route | aligned | Real route and contract page. |
| `/docs/api/company-events/issuer-announcements` | `/v2/datasets/issuer-announcements` | Yes | Non-productized live route | aligned | Real route and contract page. |
| `/docs/api/company-events/events-calendar` | `/v2/datasets/events` | Yes | Non-productized live route | aligned | Real route and contract page. |
| `/docs/api/company-events/structured-events` | `/v2/datasets/structured-events` | Yes | Non-productized live route | aligned | Real route and contract page. |
| `/docs/api/company-events/corporate-actions` | `/v2/datasets/corporate-actions-enhanced` | Yes | Non-productized live route | aligned | Real route and contract page. |
| `/docs/api/company-events/dividends` | `/v2/datasets/dividends` | Yes | Non-productized live route | aligned | Real route and contract page. |
| `/docs/api/capital-flow/chip-flows` | `/v2/datasets/chip-flows` | Yes | Non-productized live route | aligned | Page intentionally documents canonical envelope shape (`api_version/query/meta/envelope`). |
| `/docs/api/prices` | redirect to `/docs/api/market-prices/twse-daily-price` | N/A | Legacy alias only | stale/legacy | Legacy route should stay redirect-only, not primary nav. |
| `/docs/api/stock-prices` | redirect to `/docs/api/market-prices/twse-daily-price` | N/A | Legacy alias only | stale/legacy | Legacy alias. |
| `/docs/api/market-prices/price-data` | redirect to `/docs/api/market-prices/twse-daily-price` | N/A | Legacy alias only | stale/legacy | Legacy alias from old `price-enhanced` surface. |
| `/docs/api/capital-flow/margin-short-enhanced` | redirect to `/docs/api/capital-flow/margin-short` | N/A | Legacy alias only | stale/legacy | Legacy alias from enhanced route. |
| `/docs/api/company-events/company-profile` | redirect to `/docs/api/company/company-profile` | No clean target | Legacy alias only | stale/legacy | Redirect target appears invalid (no `company-profile` page under `/docs/api/company/*`). |
| `/docs/api/company-profiles` | redirect to `/docs/api/company-profile` | No clean target | Legacy alias only | stale/legacy | Redirect target appears invalid. |
| `/docs/api/institutional-ownership` | redirect to `/docs/api/institutional-holdings` | Legacy generic page | Legacy alias only | stale/legacy | Redirects to legacy generic docs surface, not productized institutional-flow page. |

---

## B. Backend productized dataset -> website docs coverage table

Required productized datasets checked:
- `twse_daily_price`, `tpex_daily_price`, `monthly_revenue`, `valuation_data`, `technical_indicators`, `income_statement`, `cash_flow_statement`, `balance_sheet`, `institutional_flow`, `margin_short`

| Backend dataset | Runtime endpoint | Public contract exists in backend repo | Proper website docs page | Coverage status | Notes |
|---|---|---:|---:|---|---|
| twse_daily_price | `/v2/datasets/twse-daily-price` | Yes (`docs/public_datasets/twse_daily_price.md`) | Yes | partially aligned | Website page misses runtime `meta` fields. |
| tpex_daily_price | `/v2/datasets/tpex-daily-price` | Yes | Yes | partially aligned | Same `meta` drift. |
| monthly_revenue | `/v2/datasets/monthly-revenue` | Yes | Yes | partially aligned | Page exists and uses `symbol`; taxonomy still references enhanced topic naming. |
| valuation_data | `/v2/datasets/valuation-data` | Yes | Yes | partially aligned | Missing runtime `meta` in examples/field table. |
| technical_indicators | `/v2/datasets/technical-indicators` | Yes | Yes | partially aligned | Missing runtime `meta` in examples/field table. |
| income_statement | `/v2/datasets/income-statement` | Yes | Yes | partially aligned | Missing runtime `meta` in examples/field table. |
| cash_flow_statement | `/v2/datasets/cash-flow-statement` | Yes | Yes | partially aligned | Missing runtime `meta` in examples/field table. |
| balance_sheet | `/v2/datasets/balance-sheet` | Yes (`docs/public_datasets/balance_sheet.md`) | **No** | missing | No dedicated endpoint-style website docs page found in Data APIs IA. |
| institutional_flow | `/v2/datasets/institutional-flow` | Yes (`docs/public_datasets/institutional_flow.md`) | Yes (route exists) | partially aligned | Current website page is schema-ready/generic, not full endpoint-style contract page. |
| margin_short | `/v2/datasets/margin-short` | Yes (`docs/public_datasets/margin_short.md`) | Yes | aligned | Best-aligned productized page currently. |

---

## C. Exact mismatches (evidence-based)

1. **Productized response envelope drift (meta not documented) on multiple pages**
   - Runtime middleware injects plan row-limit metadata (`meta.plan`, `meta.row_limit`, `meta.is_limited`) for `/v2/datasets/*` JSON payloads in:
     - `/Volumes/DEV_USB/Projects/tw-feature-engine/src/feature_engine/read_api/external_data_api_boundary.py` (`dataset_plan_row_limit_middleware`, `_inject_plan_row_limit_meta`)
   - Several website productized pages still document only `dataset/rows/count` (TWSE, TPEx, monthly revenue, valuation, technical, income, cash flow).

2. **`balance_sheet` productized backend dataset has no dedicated website endpoint-style page**
   - Backend contract exists: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/public_datasets/balance_sheet.md`
   - Runtime route exists: `/v2/datasets/balance-sheet`
   - Website `schemaReadyGroups` currently has no `balance_sheet` topic entry in Data APIs tree.

3. **`institutional_flow` route exists but website page is not endpoint-style**
   - Backend productized route: `/v2/datasets/institutional-flow`
   - Website page under `/docs/api/capital-flow/institutional-flow` is generated as schema-ready topic page (no full request/response contract section from dedicated apiReference builder).

4. **Legacy redirect targets appear invalid for company profile aliases**
   - `/app/docs/api/company-events/company-profile/page.tsx` redirects to `/docs/api/company/company-profile`
   - `/app/docs/api/company-profiles/page.tsx` redirects to `/docs/api/company-profile`
   - Neither target is the canonical current issuer profile page (`/docs/api/company/issuer-profile`).

5. **Terminology drift around monthly revenue taxonomy**
   - Website grouping still maps monthly revenue page to `monthly_revenue_enhanced` topic naming in `schemaReadyGroups`, while productized public backend contract is `monthly_revenue` (`/v2/datasets/monthly-revenue`).

---

## D. Top 5 pages to fix first

1. `/docs/api/financial-growth/balance-sheet` (create proper page; currently missing)
2. `/docs/api/capital-flow/institutional-flow` (upgrade to full endpoint-style contract)
3. `/docs/api/market-prices/twse-daily-price` (add runtime `meta` docs)
4. `/docs/api/market-prices/tpex-daily-price` (add runtime `meta` docs)
5. `/docs/api/financial-growth/monthly-revenue` (keep productized endpoint framing; remove enhanced naming drift in IA metadata)

---

## E. Which pages can safely stay

- `/docs/api/capital-flow/margin-short` (aligned productized page)
- Canonical supplemental pages with explicit positioning:
  - `/docs/api/financial-growth/financials-canonical`
  - `/docs/api/financial-growth/valuations-canonical`
- Non-productized but real and correctly mapped pages (index-data, market-breadth, issuer-profile, issuer-announcements, events, structured-events, dividends, corporate-actions, chip-flows) can stay with current labeling.

---

## F. Which pages should be removed or redirected

Keep as redirect-only legacy aliases (do not expose as primary docs entry):
- `/docs/api/prices`
- `/docs/api/stock-prices`
- `/docs/api/market-prices/price-data`
- `/docs/api/capital-flow/margin-short-enhanced`

Need redirect target correction (currently inconsistent):
- `/docs/api/company-events/company-profile` → should redirect to `/docs/api/company/issuer-profile`
- `/docs/api/company-profiles` → should redirect to `/docs/api/company/issuer-profile`
- `/docs/api/institutional-ownership` → should redirect to `/docs/api/capital-flow/institutional-flow` (if productized-first policy)

---

## Bottom line

Current docs system is **partially aligned but still materially inconsistent** for productization quality:
- Core productized routes mostly exist in docs.
- But there are still high-impact gaps (missing balance sheet page, institutional-flow not endpoint-style, and response `meta` drift across several productized pages).
