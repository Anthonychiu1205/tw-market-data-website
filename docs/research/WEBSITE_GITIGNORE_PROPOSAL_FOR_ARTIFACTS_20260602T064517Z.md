# Website Gitignore Proposal For Artifacts

## Proposed line
```gitignore
artifacts/
```

## Rationale
- current dirty-tree inventory shows `artifacts/` is a major recurring source of unrelated untracked files
- these files are generated validation outputs rather than source-of-truth product content
- ignoring them would reduce deploy-preflight noise without changing runtime behavior

## Risk
- generated artifacts would no longer show up as untracked reminders in `git status`
- teams relying on repo-local artifact files as manual evidence would need an alternate storage convention or explicit exceptions

## Existing tracked files affected
- none observed in this task
- this proposal should be approved before editing `.gitignore`

## Approval status
- approval required
- `.gitignore` not modified in this task
