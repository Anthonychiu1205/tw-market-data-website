# Margin Short Website Deploy Rollback Plan

## Rollback scope
- website repo only
- no backend rollback expected
- no deploy executed in this task

## Commit-level rollback references
- revert `df83a89` if full margin_short website sync needs rollback
- revert `8772179` if docs legacy contract cleanup needs rollback
- revert `385c148` only if validation-docs follow-up itself needs rollback

## Hosting rollback posture
- if a later deploy is approved and pushed, use hosting-provider rollback controls for deployed artifact rollback
- content rollback should prefer reverting the smallest website-only commit set that restores last known good state

## Notes
- no backend rollback needed
- no data migration or scheduler rollback needed
- no deploy in this task
