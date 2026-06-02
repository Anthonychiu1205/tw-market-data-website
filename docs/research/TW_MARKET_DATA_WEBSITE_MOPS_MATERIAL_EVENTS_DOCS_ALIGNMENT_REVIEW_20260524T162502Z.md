# TW Market Data Website MOPS Material Events Docs / Package Entitlement Alignment Review

- Task: `TW-Market-Data-Website-MOPS-material-events-docs-package-entitlement-alignment`
- Timestamp (UTC): `20260524T162502Z`

## Safety Precheck Summary
- Working directory confirmed: `/Volumes/DEV_USB/Projects/tw-market-data-website`.
- Executed and reviewed: `pwd`, `git status --short`, `git diff --cached --name-only`, `git diff --stat`, `git log --oneline -20`, `cat package.json`.
- Confirmed plans remain `none` for destructive actions, backend modification, pricing runtime modification, route enablement, push/deploy/commit.

## Files Reviewed
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`
- `app/docs/[...slug]/page.tsx`
- `src/components/docs/docs-page-shell.tsx`
- `src/components/docs/api-side-panel.tsx`

## Backend Evidence Reviewed (read-only)
- `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/source-map/TW_NEWS_INTELLIGENCE_MOPS_DOCS_PACKAGE_ENTITLEMENT_ALIGNMENT_SIGNOFF.md`
- `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/source-map/TW_NEWS_INTELLIGENCE_MOPS_BACKEND_DOCS_ALIGNMENT_MATRIX.md`
- `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/source-map/TW_NEWS_INTELLIGENCE_MOPS_DOCS_PACKAGE_ENTITLEMENT_ALIGNMENT_REVIEW_20260524T161733Z.md`
- `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/source-map/TW_NEWS_INTELLIGENCE_MOPS_PRODUCTION_V2_READ_SMOKE_EXECUTION_20260524T150739Z.md`
- `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/source-map/TW_NEWS_INTELLIGENCE_MOPS_MATERIAL_EVENTS_API_ROUTE_CONTRACT_PLAN.md`
- `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/source-map/TW_NEWS_INTELLIGENCE_MOPS_DISABLED_ROUTE_SMOKE_20260524T160651Z.md`

## Files Changed
- `src/content/docs-pages.ts`
- `src/content/docs-sidebar.ts`
- `docs/research/TW_MARKET_DATA_WEBSITE_MOPS_MATERIAL_EVENTS_DOCS_ALIGNMENT_REVIEW_20260524T162502Z.md`

## Docs Page Summary
- Added preview/private-beta API docs page at:
  - `/docs/api/preview/mops-material-events`
- Documented endpoint:
  - `GET /v2/datasets/news/mops-material-events`
- Added contract-aligned content:
  - metadata-only scope
  - bounded query requirements
  - default `limit=50`, max `limit<=100`
  - required safety fields (`full_body_stored=false`, `raw_html_stored=false`, `not_investment_advice=true`)
  - `production_ready=false` prior to final gate
  - forbidden claims/fields (full body, raw HTML, TPEx, investment advice, token/cookie/session)
  - status examples include `400/401/403/429/503`

## Package Entitlement / Private Beta Wording Summary
- Added docs-side entitlement wording only (no runtime pricing change):
  - private beta / disabled by default
  - API key + plan entitlement + rate-limit required when enabled
  - no public paid-tier availability claim in this stage
- Kept wording aligned with backend signoff boundary and non-commercial posture.

## Sidebar / Discoverability
- Added entry under API `預覽` group:
  - `MOPS 重大訊息事件（Private Beta）`
- No landing-page or pricing-page commercial promotion was added.

## Remaining Blockers Before Backend Final Route Enablement
- Final backend approval event is still required.
- Website public docs publication and package entitlement external decision still require explicit signoff.
- Route remains disabled (`route_enabled=false`, `emergency_disabled=true`, `production_ready=false`) per backend governance.

## Explicit Confirmation
- No backend repo modification.
- No route flag change.
- No emergency-disable change.
- No `production_ready=true` change.
- No pricing/auth/billing runtime behavior change.
- No deploy/push/commit.
