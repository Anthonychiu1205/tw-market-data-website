# Docs Sidebar Source And Deployment Audit

## Scope
- Task date: 2026-05-29
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Goal: audit only (no UI rearrangement, no deploy/push)

## Current Sidebar Source (Actual)
- Sidebar data source: `src/content/docs-sidebar.ts`
- Sidebar rendering component: `src/components/docs/docs-page-shell.tsx`
- Docs page route shell: `app/docs/[...slug]/page.tsx` (wraps content with `DocsPageShell`)
- Docs content source: `src/content/docs-pages.ts`

### Rendering chain
1. `app/docs/[...slug]/page.tsx` loads a docs page from `docsPages` in `src/content/docs-pages.ts`.
2. It renders `DocsPageShell`.
3. `DocsPageShell` imports sidebar arrays from `src/content/docs-sidebar.ts` and renders left nav.

## Multi-source check
- Sidebar/nav for docs left panel: **single primary source** (`src/content/docs-sidebar.ts`).
- Docs article/page body: `src/content/docs-pages.ts`.
- Top nav/mega menu exists separately (not docs left sidebar source), e.g. `src/content/mega-menu-links.ts` and layout components.
- `help/faq` standalone content source: `src/content/help-center.ts` + `src/components/help/help-center-shell.tsx`.
- Conclusion: no evidence of a second dynamic docs-left-sidebar generator overriding `src/content/docs-sidebar.ts` at runtime.

## Prior Sidebar Change Audit

### Confirmed commits containing prior sidebar reorg work
- `c1a9762` `refactor(docs): reorganize sidebar navigation and icons`
  - touched: `src/content/docs-sidebar.ts`, `src/components/docs/docs-page-shell.tsx`
  - included split nav groups (`docsSidebarIntegrationItems`, `docsSidebarSupportItems`) and icon-related reshaping.
- `e6a5e54` `docs: merge FAQ into help center`
  - touched: `src/content/docs-sidebar.ts` and help/faq routes.
  - removed FAQ entry from support items in that version.
- `de0e3cb` `docs: move help center to standalone section`
  - moved help center pathing and removed old docs help-center pages from `src/content/docs-pages.ts`.

### Branch containment result
- These commits are present in:
  - `backup/main-before-sync-20260526193458`
  - `docs/help-center-legacy-redirect-cleanup`
- These commits are **not** in current `main` history lineage.

### Current file ancestry evidence
- `git log -- src/content/docs-sidebar.ts` on current `main` shows lineage from:
  - `4cdce4b`, `947175e`, `78194c4`, `e6bd74a`, `99a4038`, `1bc41a1`
- It does **not** include `c1a9762` / `e6a5e54` / `de0e3cb` on current main line.

## Why prior changes are not visible now
Most likely root cause:
1. Prior sidebar-adjustment commits exist, but on a different branch lineage (backup/cleanup branch), not on current `main`.
2. Deployment likely tracks `origin/main`; commits not reachable from `main` are not deployable.
3. Current local `main` is `ahead 3` of `origin/main`, so production can also be behind local unpushed commits.

This explains “local曾改過但官網/目前頁面沒有完整顯示”: the exact reorg commits were not in deployed branch lineage.

## Deployment Source Audit
- `render.yaml`: not present in this repo root.
- `vercel.json`: present.
- `.vercel/project.json`: present (`projectName: tw-market-data-website`).
- README and docs repeatedly reference Vercel env/deploy flows.

Assessment:
- Official website deployment target for this repo is most likely **Vercel**.
- Production source branch is likely `origin/main` (cannot fully prove deployed commit hash from local-only inspection).

## Local vs Remote vs Production Snapshot
- Local HEAD: `1bc41a1` (branch `main`)
- `origin/main`: `4dfea88`
- Local vs origin: local `main` is ahead by 3 commits.
- Production deployed commit: **unknown from local-only audit**.
- If production points to `origin/main`, then local-only commits and non-main-line commits will not appear online.

## Overwrite / replacement judgment
- The prior sidebar-reorg commits were not directly “deleted” in git object store; they still exist.
- But for current `main` and deploy path, they are effectively superseded by a different lineage/state.
- Operationally this behaves like “被後續分支整理/同步覆蓋（未保留在 main 可達歷史）”.

## Repair Recommendations (Next Round)
1. Decide canonical source branch for docs sidebar (recommend: current `main`).
2. Re-apply desired sidebar changes into current `main` via a new clean commit (not by force-history recovery).
3. Verify affected files explicitly:
   - `src/content/docs-sidebar.ts`
   - `src/components/docs/docs-page-shell.tsx`
   - if needed, `src/content/help-center.ts` / `app/help/page.tsx` / `app/faq/page.tsx`
4. Validate in local dev (`/docs`) and create a small sidebar contract checklist.
5. Push and confirm Vercel production deployment points to commit containing that new change.

## Should we reorder sidebar now?
- Recommendation: **not in this audit round** (as requested).
- First lock source-of-truth and deployment lineage; then do a scoped sidebar reorder patch.

## Should we deploy/push now?
- Recommendation: **no in this round**.
- Next step should be a dedicated sidebar-fix commit on current `main`, then push/deploy with explicit verification.

