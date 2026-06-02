# Margin Short Website Deploy Approval Package

## Basis
- sync complete: `df83a89`
- docs cleanup complete: `8772179`
- build validation rerun complete: `385c148`
- audit references:
  - `docs/research/MARGIN_SHORT_WEBSITE_DEPLOY_APPROVAL_AUDIT_20260602T062600Z.md`
  - `docs/research/MARGIN_SHORT_WEBSITE_MANUAL_REVIEW_CHECKLIST_20260602T062600Z.md`
  - `docs/research/MARGIN_SHORT_WEBSITE_DEPLOY_ROLLBACK_PLAN_20260602T062600Z.md`

## Deploy readiness summary
- route alignment is complete for:
  - `/datasets`
  - `/datasets/margin-short`
  - `/docs/api/capital-flow/margin-short`
- backend contract wording is aligned to:
  - TWSE-only
  - private beta
  - no TPEx claim
  - not investment advice
  - daily write cron not enabled
- no backend repo modification is required by this package

## Blocking review
- repo worktree is currently dirty because unrelated untracked docs/artifact files are present
- current task does not clean those files
- lint/build rerun in this task passed
- non-blocking build note: auth/billing dynamic server usage messages were emitted during static generation, but build exit code was `0`

## Decision
`MARGIN_SHORT_WEBSITE_DEPLOY_APPROVAL_PACKAGE_BLOCKED_BY_DIRTY_TREE`

## What approval would still need after blocker clears
- manual route/content review using the checklist
- explicit deploy approval in a separate execution task
- no deploy from this task
