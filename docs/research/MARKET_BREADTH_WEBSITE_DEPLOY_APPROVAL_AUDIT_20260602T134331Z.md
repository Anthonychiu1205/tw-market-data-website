# Market Breadth Website Deploy Approval Audit

## Current HEAD
- current HEAD at audit time: `f472e22`
- deploy already executed: `false`

## Worktree status
- worktree status at audit start: clean
- staged files at audit start: none
- dirty-tree blocker: none identified for this scoped approval task

## Affected routes
- `/datasets`
- `/datasets/market-breadth`
- `/docs/api/market-prices/market-breadth`

## Validation basis
- `npm run lint`: pass
- `npm run build`: pass
- known auth/billing dynamic server usage warnings are non-blocking when build exit code is `0`

## Content basis
- coverage: `2026-05-04..2026-05-27`
- row_count: `18`
- scope: `TWSE-only`
- status: `Private beta`
- source: `TWSE MI_INDEX derived market breadth`
- no TPEx/full-market claim
- no daily cron enabled claim
- no investment advice claim
- `source_lineage` / `data_gaps` included

## Audit result
The website sync is in a review-ready state for a later manual deploy approval decision.
