# Market Breadth Website Deploy Push Decision

## Decision
`MARKET_BREADTH_DEPLOY_PUSH_RANGE_BLOCKED_NEEDS_BRANCH_ISOLATION`

## Why
- `origin/main..HEAD` contains the approved market_breadth commit set.
- The same range also contains total margin short website commits.
- One of those unrelated commits, `bfa66b5`, changes shared runtime/content files rather than report-only docs.
- That means a direct `git push origin main` would expand the deploy scope beyond the approved market_breadth package.

## Option review

### `MARKET_BREADTH_DEPLOY_PUSH_RANGE_SAFE_TO_APPROVE_AS_IS`
1. Recommended action: do not choose
2. Risk: high, because unrelated dataset content/runtime would ship
3. Whether push can proceed: no
4. Whether deploy approval must be expanded: yes
5. Whether a clean branch/cherry-pick strategy is needed: effectively yes

### `MARKET_BREADTH_DEPLOY_PUSH_RANGE_SAFE_IF_USER_APPROVES_REPORT_ONLY_COMMITS`
1. Recommended action: not sufficient on its own
2. Risk: medium-high, because `bfa66b5` is not report-only
3. Whether push can proceed: no
4. Whether deploy approval must be expanded: yes
5. Whether a clean branch/cherry-pick strategy is needed: yes

### `MARKET_BREADTH_DEPLOY_PUSH_RANGE_BLOCKED_BY_UNRELATED_RUNTIME_COMMITS`
1. Recommended action: valid diagnosis, but less actionable than branch isolation
2. Risk: medium
3. Whether push can proceed: no
4. Whether deploy approval must be expanded: yes if pushing current `main`
5. Whether a clean branch/cherry-pick strategy is needed: recommended

### `MARKET_BREADTH_DEPLOY_PUSH_RANGE_BLOCKED_NEEDS_BRANCH_ISOLATION`
1. Recommended action: preferred
2. Risk: low-medium if handled later with isolated branch or curated cherry-pick set
3. Whether push can proceed: not from current `main` as-is
4. Whether deploy approval must be expanded: no, if isolating only the approved market_breadth commit set
5. Whether a clean branch/cherry-pick strategy is needed: yes

### `MARKET_BREADTH_DEPLOY_PUSH_RANGE_NEEDS_MORE_REVIEW`
1. Recommended action: unnecessary at current evidence quality
2. Risk: low, but delays a clear decision
3. Whether push can proceed: no
4. Whether deploy approval must be expanded: unknown
5. Whether a clean branch/cherry-pick strategy is needed: likely yes

## Recommended next action
- Do not push current `main`.
- Prepare a clean isolated branch or curated cherry-pick path containing only:
  - `8dcc243`
  - `3878957`
  - `f472e22`
  - `a02e098`
  - `83e7f33`
- Submit that isolated range for a fresh deploy approval, or explicitly expand approval to include the total margin short website range.
