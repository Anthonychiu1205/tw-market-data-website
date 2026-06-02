# HELP_CENTER_ARTICLE_PILOT (Phase 1)

## Scope
- Keep docs support IA clean without large-scale rewrite.
- Promote `/docs/help-center` as primary help hub.
- Add only 3 detailed pilot articles.

## Implemented
1. Sidebar
- Removed FAQ entry from visible support navigation.
- Kept `Support` and `幫助中心`.
- Updated `幫助中心` link to `/docs/help-center`.

2. Help center index
- `/docs/help-center` now serves as categorized issue entry.
- Sections:
  - 快速開始
  - 錯誤排查
  - 之後可補充
- Uses concise link rows to pilot articles; does not expand full long answers on index.

3. Pilot articles (3 only)
- `/docs/help-center/get-api-key`
- `/docs/help-center/call-api`
- `/docs/help-center/502-504-errors`

Each article includes actionable steps and troubleshooting depth, not one-line answers.

4. FAQ route handling
- `/docs/faq` canonical alias now points to `/docs/help-center`.
- `/faq` app route also redirects to `/docs/help-center`.
- Avoids 404 and avoids duplicate long FAQ content.

## Validation
- `npm run lint`: pass.
- `npm run build`: pass (with expected dynamic route warnings/retries; final success).
- Docs slug registry includes all 3 pilot article routes and index route.

## Notes
- No backend/auth/billing/database/API logic changes.
- No OpenAPI / llms changes.
- No dependency additions.
- No push/deploy done.
