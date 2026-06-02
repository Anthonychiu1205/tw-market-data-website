# HELP_CENTER_STANDALONE_AREA

## Goal
Move Help Center out of docs API shell into a standalone support area while preserving existing route safety.

## What changed
- Added standalone routes:
  - `/help-center`
  - `/help-center/get-api-key`
  - `/help-center/call-api`
  - `/help-center/502-504-errors`
- Added dedicated content source for pilot-only 3 articles.
- Added standalone shell with:
  - left category/article list
  - center article content
  - right TOC + related articles

## Route safety and redirects
- `/docs/help-center` -> `/help-center`
- `/docs/help-center/get-api-key` -> `/help-center/get-api-key`
- `/docs/help-center/call-api` -> `/help-center/call-api`
- `/docs/help-center/502-504-errors` -> `/help-center/502-504-errors`
- `/docs/faq` -> `/help-center`
- `/faq` -> `/help-center`
- `/help` -> `/help-center`

## Docs IA cleanup
- Docs SUPPORT item `幫助中心` now points to `/help-center`.
- Removed docs-native help-center article entries from docs content registry to avoid duplicate full content under `/docs`.

## Validation
- `npm run lint`: pass
- `npm run build`: pass

## Scope guard
- No backend/auth/billing/database/API route behavior changes.
- No OpenAPI or llms changes.
- No new dependency.
- No push/deploy.
