# Margin Short Website Deploy Approval Recheck

## Recheck basis
- prior deploy approval package: `docs/research/MARGIN_SHORT_WEBSITE_DEPLOY_APPROVAL_PACKAGE_20260602T062600Z.md`
- dirty-tree triage: `docs/research/MARGIN_SHORT_WEBSITE_DIRTY_TREE_TRIAGE_20260602T062950Z.md`
- current margin_short website state remains:
  - sync complete
  - docs cleanup complete
  - lint/build previously passed
  - no backend change
  - no deploy
  - no push

## Dirty-tree recheck outcome
- current dirty tree is composed of unrelated existing untracked docs/artifact files plus this task's own report
- no runtime margin_short content blocker was discovered from dirty-tree inspection
- no unknown dirty file requiring immediate user content decision was discovered in the observed set

## Validation status
- lint/build rerun requested in this task
- auth/billing dynamic server usage messages remain non-blocking if build exit code stays `0`
- rerun result:
  - `npm run lint`: passed
  - `npm run build`: passed
  - auth/billing dynamic server usage messages were emitted during static generation, but final build exit code was `0`

## Decision
`MARGIN_SHORT_WEBSITE_DEPLOY_APPROVAL_RECHECK_BLOCKED_BY_UNRELATED_DIRTY_TREE`

## Why still blocked
- deploy approval package in this repo currently treats an unrelated dirty worktree as a blocker
- this task does not delete, clean, or normalize unrelated untracked files
- deploy, if desired later, should be executed in a separate task after explicit user decision on whether unrelated untracked files may remain
