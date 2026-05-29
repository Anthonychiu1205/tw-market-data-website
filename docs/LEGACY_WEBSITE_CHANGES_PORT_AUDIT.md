# Legacy Website Changes Port Audit

## Audit Scope
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Current main HEAD: `89a3d7a`
- Compared legacy lineages:
  - `backup/main-before-sync-20260526193458`
  - `docs/help-center-legacy-redirect-cleanup`
- Purpose: identify website changes present in legacy lineages but not yet ported to current `main`.
- This run is audit-only: no UI changes made.

## Branches Scanned
- Local: `main`, `backup/main-before-sync-20260526193458`, `docs/help-center-legacy-redirect-cleanup`, docs sync branches.
- Remote tracking: `origin/main`, `origin/docs/*`, `origin/codex/website-sellable-8-alignment`.

## Commit Groups Scanned
Keywords scanned across all history: `sidebar`, `help`, `FAQ`, `Run`, `login`, `pricing`, `dashboard`, `billing`, `usage`, `docs`, `SDK`, `MCP`, `AI`, `blog`, `homepage`, `landing`.

High-signal legacy-not-in-main commits (`main..backup`):
- `c1a9762` sidebar/icon reorg
- `4a03fa7` API run playground modal (initial)
- `76bf197`, `a7129da`, `2f265e6`, `8be60eb`, `81eb795`, `2437d0e`, `10f7779`, `bfe8882`, `c70de96` (run playground polish chain)
- `e6a5e54`, `de0e3cb`, `cdfd7c6`, `2fb3975`, `7a85cb7`, `6b0733a` (help center standalone/search/article evolution)
- `0460bfc` FAQ redirect cleanup

## Status Matrix

| feature area | legacy commit | branch / lineage | files changed | summary | current main equivalent? | current port commit | should port? | status | risk | recommended next task |
|---|---|---|---|---|---|---|---|---|---|---|
| Docs sidebar taxonomy/icons | `c1a9762` | backup/help-cleanup lineage | `src/content/docs-sidebar.ts`, `src/components/docs/docs-page-shell.tsx` | sidebar section split + icon refinements | partial | `31a341b` | yes | partial | low | normalize section split/label strategy vs current product IA |
| Help center standalone route | `de0e3cb` | backup/help-cleanup lineage | `app/help-center/page.tsx`, `app/help/page.tsx`, `app/faq/page.tsx`, others | standalone help-center area + route shifts | yes (core behavior) | `89a3d7a` | no immediate | ported | low | none |
| FAQ merged into help flow | `e6a5e54` | backup/help-cleanup lineage | `app/faq/page.tsx`, `src/content/help-center.ts`, sidebar | FAQ merged/redirected semantics | yes (core behavior) | `89a3d7a` | no immediate | ported | low | none |
| FAQ legacy redirect cleanup | `0460bfc` | docs/help-center-legacy-redirect-cleanup | `app/faq/page.tsx`, `src/content/help-center.ts` | FAQ redirect target/copy adjustments | partial | `89a3d7a` | yes | partial | low | align exact redirect/canonical target policy |
| Help center searchable nav component | `7a85cb7`, `6b0733a` | backup/help-cleanup lineage | `src/components/help-center/help-center-nav-search.tsx`, shell | richer nav/search UX | no | - | yes | missing_should_port | medium | port `help-center-nav-search` with minimal UI risk |
| Help center standalone article corpus | `de0e3cb`, `cdfd7c6`, `2fb3975` | backup/help-cleanup lineage | `src/content/help-center-articles.ts`, shell/routes | long-form help articles + topic depth | no | - | manual-review | manual_review | medium | product/content review before port |
| Docs Run button core | `4a03fa7` | backup/help-cleanup lineage | `src/components/docs/api-run-playground.tsx`, docs page wiring | run playground modal core | yes (baseline) | `89a3d7a` | no immediate | ported | low | none |
| Docs Run playground polish chain | `76bf197`..`c70de96` | backup/help-cleanup lineage | `api-run-playground.tsx`, `code-block.tsx` | layout, density, z-index, controls polish | no (baseline only) | - | yes | missing_should_port | low/medium | selective cherry-free manual polish port |
| Docs plan requirement removal | `d7011f8` | backup/help-cleanup lineage | `app/docs/[...slug]/page.tsx` | removed plan-requirement block | no | - | manual-review | manual_review | medium | confirm current docs policy before removing section |
| Home/marketing/datasets/pricing/auth/dashboard/billing older changes | multiple pre-backup commits | in current main ancestry or merged PR history | broad | these were largely integrated before divergence | yes/partial | pre-existing | defer | missing_defer | low | only revisit if product asks for UI refresh |
| Blog migration experiments | `fbc637f`, `9b7af4b`, `7e4f76a` | old lineage | blog pipeline/layout | likely superseded by current product content direction | unknown/partial | - | manual-review | obsolete_do_not_port (for now) | medium | confirm blog roadmap first |

## Area-by-Area Summary

### A) Docs / API docs
- Already ported:
  - sidebar taxonomy baseline (`31a341b`)
  - help center standalone behavior + faq redirects (`89a3d7a`)
  - run button baseline (`89a3d7a`)
- Still pending:
  - run playground polish chain (`missing_should_port`)
  - help-center searchable nav/article depth (`manual_review` to `missing_should_port` depending product choice)
  - plan-requirement removal decision (`manual_review`)

### B) Homepage / marketing
- No high-confidence must-port gaps found from the compared legacy branches; most relevant commits are older and already in current main lineage or superseded.

### C) Auth
- No clear legacy-only delta in compared branches requiring immediate port.

### D) Dashboard
- No legacy-only delta from compared branches identified as missing-critical for current main.

### E) Billing / pricing
- No legacy-only delta from compared branches identified as missing-critical for current main.

### F) Blog / content cleanup
- Legacy blog experiments exist but are not clearly aligned to current prioritized docs path; mark `obsolete_do_not_port` for now unless roadmap reactivates.

### G) Deployment / ops
- No actionable legacy-only port required from these branches in this audit.

## Port Completeness Checks Requested

### `31a341b` vs `c1a9762`
- Result: **partial**.
- Covered: taxonomy restore + help-only sidebar entry and icon uniqueness in API groups.
- Not fully mirrored: `c1a9762`'s exact section split (`INTEGRATIONS`/`SUPPORT`) and its full icon mapping strategy.

### `89a3d7a` vs `e6a5e54`, `de0e3cb`, `4a03fa7`, `a7129da`, `c70de96`
- Result: **partial**.
- Covered:
  - standalone help center route behavior
  - faq redirect semantics
  - run button baseline modal wiring
- Remaining:
  - advanced standalone help-center article architecture (`help-center-articles.ts` + nav-search component)
  - run playground post-initial polish commits (`a7129da`, `c70de96`, and neighboring polish commits)

## Highest Priority Next 5 Port Tasks
1. Port run-playground polish subset (`a7129da`, `c70de96`, `bfe8882`) into current `src/components/docs/api-run-playground.tsx` with no backend behavior changes.
2. Port `help-center-nav-search` UX layer (from `7a85cb7`/`6b0733a`) into current help shell, keeping existing `/help-center` route.
3. Decide whether to adopt standalone article corpus (`src/content/help-center-articles.ts`) or keep current compact FAQ model.
4. Reconcile FAQ redirect target/canonical details with `0460bfc` semantics (ensure final chosen URL policy is consistent in metadata + links).
5. Decide on plan-requirement block policy in docs API pages (keep current behavior vs adopt `d7011f8` removal).

## No-change Confirmation
- This audit introduced no UI/behavior changes.
- Only this report file is added in this task.

