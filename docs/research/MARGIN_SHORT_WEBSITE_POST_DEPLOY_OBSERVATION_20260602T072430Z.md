# MARGIN_SHORT_WEBSITE_POST_DEPLOY_OBSERVATION

- timestamp: `20260602T072430Z`
- repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- branch: `main`

## Deploy state

- deployed hash on `origin/main`: `ff9c236`
- local-only deploy report commit: `0792060`
- current local HEAD before this observation commit: `0792060`
- report commit pushed: `false`
- second deploy triggered by report commit: `false`

## Smoke recap

Previous post-deploy smoke after the approved push passed:

- `/`: `200`
- `/datasets`: `200`
- `/datasets/margin-short`: `200`
- `/docs/api/capital-flow/margin-short`: `200`

Lightweight HEAD check in this observation task:

- `/`: `200`
- `/datasets`: `200`
- `/datasets/margin-short`: `200`
- `/docs/api/capital-flow/margin-short`: `200`

## Rollback basis

- deployed website content can be rolled back through the hosting provider if needed
- content rollback reference commits remain:
  - `df83a89`
  - `8772179`
  - `385c148`
  - `f181f0a`
  - `2fb1108`
  - `597624b`
  - `ff9c236`
- backend rollback required: `false`

## Recommendation

- keep local deploy report commits unpushed unless the user explicitly wants the audit trail on GitHub
- no further deploy is needed for the margin_short website content
- if the audit trail should be pushed later, use a separate approval task because pushing the report commit may trigger another Vercel deployment

## Final gate

`MARGIN_SHORT_WEBSITE_POST_DEPLOY_OBSERVATION_PASS_LOCAL_ONLY`
