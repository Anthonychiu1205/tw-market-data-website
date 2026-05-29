# Docs Help Center And Run Button Port

## Scope
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Branch: `main`
- Mode: manual port from legacy commits, no cherry-pick.

## Legacy Sources Identified

### Help Center standalone behavior
- `e6a5e54` (`docs: merge FAQ into help center`)
  - touched `app/faq/page.tsx`, `src/content/docs-sidebar.ts`, `src/content/help-center.ts`
- `de0e3cb` (`docs: move help center to standalone section`)
  - introduced standalone area routing/files (`app/help-center/page.tsx`, `app/help-center/[slug]/page.tsx` in that lineage)
  - changed docs/sidebar/help linkage away from docs-inline help pages

### Docs Run action
- `4a03fa7` (`feat(docs): add API run playground modal`)
  - added `src/components/docs/api-run-playground.tsx`
  - wired into `app/docs/[...slug]/page.tsx`
- follow-up visual polish commits (same feature family):
  - `a7129da`, `c70de96`, etc.

## Why current main was missing behavior
- Prior implementations existed on non-current-main lineages.
- Current main had:
  - no `src/components/docs/api-run-playground.tsx`
  - API docs page header without `Run` trigger wiring
  - sidebar help entry pointed at `/help` with separate `/faq` page still accessible as full page.

## Changes Applied (Manual Port)

### 1) Help Center standalone route behavior
- Added standalone route page:
  - `app/help-center/page.tsx`
- Sidebar HELP entry now points to standalone route:
  - `src/content/docs-sidebar.ts` (`/help-center`)
- Legacy compatibility / consolidation:
  - `app/help/page.tsx` now redirects to `/help-center`
  - `app/faq/page.tsx` now redirects to `/help-center#api-data`
- FAQ content handling:
  - FAQ route/file retained (not deleted), but routed into Help Center section.
  - Help center entry card FAQ link updated to `"/help-center#api-data"` in `src/content/help-center.ts`.

### 2) Docs Run button restoration
- Restored component:
  - `src/components/docs/api-run-playground.tsx`
- Wired in API docs request header section:
  - `app/docs/[...slug]/page.tsx` imports and renders `<ApiRunPlayground api={api} endpointTitle={page.title} />`.

## Run Button Runtime Mode
- **Preview-only / safe UI**.
- It does **not** call backend API directly.
- It builds local cURL preview from endpoint + params + API key input and shows response examples from docs schema.
- No secrets hardcoded; no API key persistence/logging in component behavior.

## Modified Files
- `src/components/docs/api-run-playground.tsx` (added)
- `app/docs/[...slug]/page.tsx` (Run button wiring)
- `app/help-center/page.tsx` (added)
- `app/help/page.tsx` (redirect to standalone help center)
- `app/faq/page.tsx` (redirect to help center FAQ section)
- `src/content/docs-sidebar.ts` (help href update)
- `src/content/help-center.ts` (FAQ entry link update)

## Validation
- `npm run lint`: executed (no lint error output)
- `npm run build`: starts and reaches `Creating an optimized production build ...`; in this environment it remains stuck at that phase (same pattern observed earlier), no final pass/fail line returned within this task window.

