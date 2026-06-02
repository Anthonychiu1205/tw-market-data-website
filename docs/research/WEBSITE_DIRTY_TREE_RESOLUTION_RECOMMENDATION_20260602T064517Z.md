# Website Dirty Tree Resolution Recommendation

## Category recommendations

### `artifacts/`
- recommendation: prepare an approval package to add `artifacts/` to `.gitignore`
- alternative: move artifacts into external artifact storage or an out-of-repo evidence directory
- do not delete directly in a cleanup-free task

### historical `docs/research/*.md`
- recommendation: treat as user-owned research records
- if they remain valuable: batch them into scoped documentation commits
- if they are temporary: user should explicitly decide whether to archive elsewhere or remove in a separate cleanup-approved task
- do not delete directly in this task

### margin_short-related reports
- current margin_short deploy approval chain reports appear already committed
- no additional margin_short dirty files need staged action from the currently observed untracked set

### unknown files
- none newly identified outside research/artifact buckets in this run
- if new unknown files appear later, classify them as `needs_user_review`

## Recommended next actions
1. Decide whether unrelated generated artifacts should be repo-ignored.
2. Decide whether historical website research reports should be preserved in git history via scoped commits.
3. After that decision, open a separate cleanup or gitignore-approval task before any deploy execution task.
