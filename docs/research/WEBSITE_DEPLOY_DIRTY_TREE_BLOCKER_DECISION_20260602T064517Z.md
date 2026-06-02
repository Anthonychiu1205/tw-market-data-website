# Website Deploy Dirty Tree Blocker Decision

## Decision
`DIRTY_TREE_NEEDS_GITIGNORE_APPROVAL`

## Why
- deploy-related margin_short content is already aligned and validated
- current blocker is dominated by unrelated generated artifacts plus historical research reports
- artifacts are the clearest repeated cleanliness issue and are strong `.gitignore` candidates
- historical research reports still need user policy, but they are distinct from runtime margin_short correctness

## Required flags
- deploy_allowed=false
- push_allowed=false
- cleanup_allowed=false
- user_approval_required=true

## Next recommended action
- first: user reviews the `artifacts/` gitignore proposal
- second: user decides whether historical `docs/research/*.md` should be batch-committed or handled in a later cleanup-approved task
- third: rerun deploy approval after that policy decision in a separate task
