# MARGIN_SHORT_WEBSITE_DEPLOY_EXECUTION

- timestamp: `20260602T071920Z`
- repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- deployment target: website repo, margin_short website content
- final deployed content commit: `ff9c236`

## Pre-deploy safety

- branch: `main`
- remote: `origin https://github.com/Anthonychiu1205/tw-market-data-website.git`
- worktree clean before push: `true`
- staged files before push: `none`
- current HEAD before push: `ff9c236`
- `ff9c236` ancestor check: `pass`
- backend repo modified: `false`
- `.env` modified: `false`
- secrets output: `false`

## Final validation

- `npm run lint`: `passed`
- `npm run build`: `passed`
- auth/billing dynamic server usage messages: `observed_non_blocking`
- build exit code: `0`

## Push result

- command: `git push origin main`
- result: `success`
- pushed range: `e9df2ff..ff9c236`
- pushed branch: `main`
- force push: `false`

## Deploy result

- deployment platform evidence: `.vercel/project.json`, `vercel.json`, and prior production deploy reports
- deploy mechanism used: `git_push_auto_deploy`
- deploy triggered by push: `true`
- manual deploy command executed: `false`
- note: first bounded smoke still showed the old `/datasets/margin-short` content, then the second smoke showed updated content after propagation.

## Post-deploy smoke

- production URL: `https://twmarketdata.com`
- `/`: `200`, title `台股資料 API 基礎設施`
- `/datasets`: `200`, title `台股資料集總覽 | TW Market Data | TW Market Data Platform`
- `/datasets/margin-short`: `200`, title `融資融券資料集 | TW Market Data | TW Market Data Platform`
- `/docs/api/capital-flow/margin-short`: `200`, title `文件｜融資融券 | TW Market Data Platform`
- margin_short content hits observed on relevant routes: `true`

## Limitations preserved

- TWSE-only
- private beta
- no TPEx claim
- not investment advice
- daily write cron not enabled
- source_lineage / data_gaps included
- official-first
- ratio tolerance `1e-6`

## Rollback readiness

- do not rollback unless explicitly requested
- hosting provider rollback is the preferred first rollback path if the deployed artifact becomes unhealthy
- scoped revert candidates if content rollback is required:
  - `df83a89`
  - `8772179`
  - `385c148`
  - `f181f0a`
  - `2fb1108`
  - `597624b`
  - `ff9c236`
- backend rollback required: `false`

## Final gate

`MARGIN_SHORT_WEBSITE_DEPLOY_EXECUTION_PASS`
