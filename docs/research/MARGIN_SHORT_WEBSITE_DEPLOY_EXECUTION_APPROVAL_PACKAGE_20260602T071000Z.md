# MARGIN_SHORT_WEBSITE_DEPLOY_EXECUTION_APPROVAL_PACKAGE

- timestamp: `20260602T071000Z`
- decision: `MARGIN_SHORT_WEBSITE_DEPLOY_PREFLIGHT_PASS_AWAITING_USER_APPROVAL`
- clean worktree: `true`
- lint/build status: `passed`
- deploy executed in this task: `false`
- push executed in this task: `false`

## Proposed Next Task Only If User Approves

- push command: `git push origin <current-branch>`
- deploy step: trigger the normal website hosting deployment flow for the current branch/production target after push, according to the hosting platform already in use for this repo

## Rollback Plan

- content rollback references: `df83a89`, `8772179`, `385c148`, `f181f0a`, `2fb1108`, `597624b`
- if a future deploy is unhealthy, use hosting-provider rollback first, then scoped git revert only if required
- no backend rollback required from this website-only package

## Post-Deploy Smoke Checklist

- verify `/datasets` renders and includes 融資融券 entry
- verify `/datasets/margin-short` loads with TWSE-only and private beta wording
- verify `/docs/api/capital-flow/margin-short` shows aligned private-beta fields
- verify no TPEx/full-market claim appears
- verify no investment-advice wording regression appears
- verify mobile and desktop layout sanity for dataset/docs routes