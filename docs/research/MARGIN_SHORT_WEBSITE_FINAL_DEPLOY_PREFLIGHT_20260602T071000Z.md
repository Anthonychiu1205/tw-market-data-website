# MARGIN_SHORT_WEBSITE_FINAL_DEPLOY_PREFLIGHT

- timestamp: `20260602T071000Z`
- current HEAD commit: `597624b`
- clean worktree status: `true`
- lint result: `passed`
- build result: `passed`
- build note: auth/billing dynamic server usage messages observed, treated as non-blocking because build exit code was `0`

## Changed Feature Summary

- margin_short dataset catalog sync completed
- margin_short dataset landing page present
- margin_short docs route aligned with backend private-beta contract
- limitations preserved: TWSE-only, private beta, no TPEx claim, not investment advice, daily write cron not enabled, source_lineage/data_gaps included, official-first, ratio tolerance 1e-6

## Routes Affected

- `/datasets`
- `/datasets/margin-short`
- `/docs/api/capital-flow/margin-short`

## Rollback Reference Commits

- `df83a89`
- `8772179`
- `385c148`
- `f181f0a`
- `2fb1108`
- `597624b`

## Execution Constraints Confirmed

- no backend change in this task
- no deploy executed
- no push executed
- no secrets output