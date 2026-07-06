# Market Breadth Website Deploy Rollback Plan

## Rollback references
- revert `8dcc243` for full market_breadth sync rollback
- revert `3878957` only for dirty-tree audit docs if needed
- revert `f472e22` only for post-sync review docs if needed

## Preferred rollback posture
- after an actual deploy, prefer hosting-provider rollback first
- if content-only rollback is required in git history, use the sync commit reference above
- no backend rollback is needed for this website-only change set

## Scope note
This task does not deploy and does not execute any rollback.
