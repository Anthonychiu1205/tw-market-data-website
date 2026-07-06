# Market Breadth Website Dirty Tree Decision

## Inventory summary
- current dirty tree relevant to this task: none
- same-topic implementation reports already exist
- current content in dataset catalog, detail metadata, docs pages, and site metadata matches the backend handoff package

## Validation summary
- lint: pass
- build: pass
- non-blocking warnings: auth/billing dynamic server usage warnings during Next build with exit code `0`

## Allowed files for any future scoped commit
- in this audit task: only the newly created audit reports
- if a future completion task is needed, limit scope to:
  - `app/datasets/page.tsx`
  - `src/content/datasets.ts`
  - `src/content/site.ts`
  - `src/content/docs-pages.ts`
  - `src/content/docs-sidebar.ts`
  - research docs for that specific task

## Recommendation
Do not try to complete the sync again. Treat the market breadth website sync as already implemented and committed. If follow-up work is needed, it should be a separate refinement task rather than a dirty-tree recovery task.

## Final gate
`MARKET_BREADTH_WEBSITE_DIRTY_TREE_AUDIT_PASS_SAFE_TO_COMMIT_EXISTING_SYNC`
