# Margin Short Website Deploy Approval Audit

## Latest commit basis
- current HEAD at audit start: `385c148`
- readiness gate basis: `MARGIN_SHORT_WEBSITE_BUILD_VALIDATION_PASS_READY_FOR_MANUAL_REVIEW`
- sync basis commit: `df83a89`
- docs cleanup basis commit: `8772179`

## Dirty tree status
- repo is not clean at audit start
- observed status type: untracked docs research files and `artifacts/` directory
- no staged files were present at audit start
- current task does not clean or delete unrelated files

## Validation basis
- prior lint/build basis:
  - `docs/research/MARGIN_SHORT_WEBSITE_BUILD_VALIDATION_RERUN_20260602T062143Z.md`
- expected rerun in this task:
  - `npm run lint`
  - `npm run build`
- rerun result in this task:
  - `npm run lint`: passed
  - `npm run build`: passed
  - non-blocking note: Next emitted dynamic server usage messages for auth/billing routes during static generation, but final exit code was `0`

## Changed files summary basis
- dataset sync touched:
  - `src/content/site.ts`
  - `src/content/datasets.ts`
  - `app/datasets/page.tsx`
  - `src/content/docs-pages.ts`
- docs-only follow-up touched margin_short route contract wording

## Routes affected
- `/datasets`
- `/datasets/margin-short`
- `/docs/api/capital-flow/margin-short`

## Backend / secrets / deploy posture
- no backend repo change required for this package
- no secrets printed in this task
- no deploy had already been executed in the margin_short website sync chain reviewed here
- no push had already been executed in this task

## Limitations confirmed
- TWSE-only
- private beta
- no TPEx claim
- not investment advice
- daily write cron not enabled
- official-first
- source_lineage and data_gaps included
- ratio tolerance `1e-6`
