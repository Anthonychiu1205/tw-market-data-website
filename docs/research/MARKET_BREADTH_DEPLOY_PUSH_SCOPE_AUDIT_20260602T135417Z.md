# Market Breadth Deploy Push Scope Audit

## Approved deploy scope
- `app/datasets/page.tsx`
- `src/content/datasets.ts`
- `src/content/site.ts`
- `src/content/docs-pages.ts`
- `docs/research/MARKET_BREADTH_*`

## Expected market breadth commit set
- `8dcc243`
- `3878957`
- `f472e22`
- `a02e098`
- `83e7f33`

## Scope result by commit
- `8dcc243`: within approved scope
- `3878957`: within approved scope as report-only
- `f472e22`: within approved scope as report-only
- `a02e098`: within approved scope as report-only
- `83e7f33`: within approved scope as report-only
- `64b13df`: outside scope, but docs-only and tied to total margin short website deploy
- `22b90a1`: outside scope, but docs-only and tied to total margin short website sync review
- `7db54e0`: outside scope, but docs-only and tied to margin short post-deploy observation
- `0792060`: outside scope, but docs-only and tied to margin short deploy execution
- `bfa66b5`: outside scope and not docs-only; this commit modifies runtime/content registration files used by dataset and docs routes

## Explicit out-of-scope touches found
- `bfa66b5` touches:
  - `app/datasets/page.tsx`
  - `src/content/datasets.ts`
  - `src/content/docs-pages.ts`
  - `src/content/docs-sidebar.ts`
  - `src/content/site.ts`
- These are website runtime/content files and are not limited to the approved market_breadth deploy scope.

## Forbidden-area scan result
- No pending commit in `origin/main..HEAD` was found touching:
  - pricing runtime
  - billing runtime
  - auth runtime
  - homepage code
  - API playground code
  - help center code
  - OpenAPI code
  - package manifests
  - env/config files
- The push range is still unsafe for the market_breadth-only approval because `bfa66b5` changes shared dataset/docs content wiring for a different dataset.

## Scope contamination conclusion
- The pending push range is contaminated for a market_breadth-only deploy approval.
- The contamination is not just extra reports; it includes one unrelated website runtime/content commit: `bfa66b5`.
