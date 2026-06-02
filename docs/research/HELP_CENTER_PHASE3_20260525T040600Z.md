# HELP CENTER PHASE3

## Scope
- Remove updated-time display from standalone help-center article pages.
- Add 6 new Phase 3 help-center articles.
- Keep architecture in standalone `/help-center`, no rollback to `/docs/help-center` content pages.

## Implemented
- Removed article-level updated-time rendering in:
  - `src/components/help-center/help-center-shell.tsx`
- Added articles in:
  - `src/content/help-center-articles.ts`
  - `query-twse-daily-price`
  - `query-monthly-revenue`
  - `no-data-returned`
  - `wrong-parameters`
  - `openapi-usage`
  - `mcp-preview`
- Updated related articles (max 3 each).
- Total article entries verified: 15.

## Validation
- `npm run lint`: PASS
- `npm run build`: PASS
- No UI rendering of "更新時間" on help-center article pages.
- No "本頁章節" in standalone help-center article UI.
- Safety scan: no forbidden investment/secret keywords in help-center content.

## Constraints Check
- No backend/API behavior changes.
- No new dependency.
- No push/deploy.
- Unrelated dirty files were left untouched.
