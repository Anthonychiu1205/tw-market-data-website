# Remove Legacy Help/FAQ - 20260526T030226Z

## 1) Safety precheck
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Branch: `docs/cash-flow-phase-a-docs-sync`
- Staged area: empty
- Pre-existing unrelated dirty: `next-env.d.ts`
- Pre-existing untracked: `artifacts/`, `docs/research/`
- Required commits present in branch history: `3883e79`, `71a4a44`, `635b08a`

## 2) Inventory
- Legacy accordion source found in:
  - `src/components/help/help-center-shell.tsx`
  - `src/content/help-center.ts`
- Current public route behavior:
  - `/help` redirects to `/help-center`
  - `/faq` redirects to `/help-center`
  - `/docs/faq` and `/docs/help-center*` aliases redirect to standalone help center paths via `app/docs/[...slug]/page.tsx`

## 3) Implementation
- Removed legacy public entry hash link by changing `helpCenterEntryCards[faq].href` from `/help#api-data` to `/help-center`.
- Removed `/faq` page metadata dependency on legacy FAQ content and switched it to standalone help-center metadata source.

## 4) Validation
- `npm run lint`: PASS
- `npm run build`: PASS
- `/help` and `/faq` no longer render legacy accordion page.
- Old docs help/faq aliases remain safe and do not 404.

## 5) Gate decision
- `READY_FOR_REMOVE_LEGACY_HELP_FAQ_COMMIT`

## 6) Actions not performed
- No push
- No deploy
- No backend/API behavior changes
- No cleanup/reset of `next-env.d.ts`
- No staging of `artifacts/*` or `docs/research/*`

## 7) Artifact list
- `artifacts/remove_legacy_help_faq_safety_20260526T030226Z.json`
- `artifacts/remove_legacy_help_faq_inventory_20260526T030226Z.json`
- `artifacts/remove_legacy_help_faq_implementation_20260526T030226Z.json`
- `artifacts/remove_legacy_help_faq_validation_20260526T030226Z.json`
- `artifacts/remove_legacy_help_faq_gate_decision_20260526T030226Z.json`
- `docs/research/REMOVE_LEGACY_HELP_FAQ_20260526T030226Z.md`
