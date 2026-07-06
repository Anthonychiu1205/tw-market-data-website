# MARKET_BREADTH_CANONICAL_REMOTE_DEPLOY_PATH_AUDIT

- Timestamp: 20260602T150213Z
- Original website repo:
  - path: `/Volumes/DEV_USB/Projects/tw-market-data-website`
  - branch: `main`
- v2 clone:
  - path: `/Volumes/DEV_USB/Projects/tw-market-data-website-market-breadth-v2`
  - branch: `market-breadth-clean-deploy-v2`

## Original repo remote audit

Canonical remote for deploy decisions:
- `origin`
- fetch: `https://github.com/Anthonychiu1205/tw-market-data-website.git`
- push: `https://github.com/Anthonychiu1205/tw-market-data-website.git`

Findings:
- original repo `origin` is the real GitHub remote, not a local filesystem path
- current branch is `main`
- no staged files were present during this audit
- pending range `origin/main..HEAD` is non-empty
- pending range includes both market_breadth commits and unrelated total-margin-short commits

Current pending commits on true `origin/main..HEAD`:
- `dbf1d43` docs: audit market breadth website deploy push range
- `83e7f33` docs: record market breadth website deploy
- `a02e098` docs: add market breadth website deploy approval package
- `f472e22` docs: review market breadth website sync
- `3878957` docs: audit market breadth website dirty tree
- `8dcc243` docs: add market breadth dataset pages
- `64b13df` docs: add total margin short website deploy approval package
- `22b90a1` docs: review total margin short website sync
- `bfa66b5` docs: add total margin short dataset pages
- `7db54e0` docs: record margin short post deploy observation
- `0792060` docs: record margin short website deploy

Scope observation:
- pending range includes unrelated commits outside approved market_breadth-only deploy scope
- because `bfa66b5` changes shared dataset content/runtime files, current `main` push range is not market_breadth-only

## v2 clone remote mistake

v2 clone remote:
- fetch: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- push: `/Volumes/DEV_USB/Projects/tw-market-data-website`

Why `origin/main..HEAD` in v2 was misleading:
- v2 was cloned from the local repo path, not from the canonical GitHub remote URL
- therefore v2 `origin/main` represented the local repository state, including local-only pending website history
- an empty or narrow v2 diff versus its local `origin/main` cannot prove that GitHub remote `main` already contains market_breadth changes

Current v2 status:
- committed report-only head: `88ed569`
- uncommitted content edits remain in:
  - `app/datasets/page.tsx`
  - `src/content/datasets.ts`
  - `src/content/docs-pages.ts`
  - `src/content/site.ts`
- v2 is not deploy-safe because:
  - its remote baseline is wrong for GitHub deploy judgment
  - it contains uncommitted content edits
  - it must not be pushed as a deploy branch

## Why prior v2 diff audit is invalid for GitHub deploy decision

The prior v2 diff audit only measured changes against a local-path remote that already inherited local pending commits.

That audit can still be useful as a local reconstruction note, but it is not authoritative for deciding whether GitHub/Vercel would deploy only market_breadth or a broader commit range.

For deploy decisions, the only canonical comparison is the original repo against the true GitHub `origin/main`.

## Current deploy-safe options

### Option 1
Use current local `main` and explicitly approve all pending commits in `origin/main..HEAD`.

- Recommended action:
  - treat the current pending range as a bundled deployment candidate
  - get explicit expanded approval for both market_breadth and total-margin-short website changes
- Risk:
  - medium to high, because shared website content/runtime changes from unrelated scope are included
- Can push proceed now:
  - only if user expands approval to the full pending range
- Need expanded deploy approval:
  - yes
- Clean branch/cherry-pick needed:
  - no, if expanded approval is accepted

### Option 2
Create a new clean branch from the real GitHub remote URL, not a local path, then manually rebuild a market_breadth-only patch.

- Recommended action:
  - clone or branch directly from the canonical GitHub remote baseline
  - reapply only approved market_breadth content/report changes
  - re-run validation on that truly isolated branch
- Risk:
  - medium, because it takes extra rebuild work but gives the safest scope control
- Can push proceed now:
  - no, not until the clean branch is rebuilt and validated
- Need expanded deploy approval:
  - no, if the rebuilt branch stays market_breadth-only
- Clean branch/cherry-pick needed:
  - yes

### Option 3
Do not isolate; deploy total-margin-short plus market_breadth together after expanded approval.

- Recommended action:
  - acknowledge both feature sets are already in the true pending range
  - review them as a combined website deployment package
- Risk:
  - medium, because this widens the approved scope intentionally
- Can push proceed now:
  - only after expanded approval
- Need expanded deploy approval:
  - yes
- Clean branch/cherry-pick needed:
  - no

## Recommendation

Recommended path:
- Option 2

Reason:
- it restores a trustworthy GitHub-based baseline
- it avoids accidental deployment of unrelated total-margin-short website changes
- it keeps the market_breadth deploy decision scoped and auditable

## Decision enum

`MARKET_BREADTH_DEPLOY_PATH_NEEDS_USER_DECISION`
