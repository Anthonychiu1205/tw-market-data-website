# Total Margin Short Website Deploy Rollback Plan

## Rollback posture
- no deploy executed in this task
- if later deploy is approved and needs rollback, revert only the website docs/package delta associated with total margin short pages
- preserve unrelated docs and navigation work
- re-run lint and build after rollback change
