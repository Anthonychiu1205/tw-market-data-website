# Help Center Searchable Navigation Port

## Legacy commits reviewed
- `7a85cb7` docs: add searchable help center navigation
- `6b0733a` refactor(docs): simplify help center navigation

## Ported behavior
- Added searchable Help Center navigation enhancements on current `/help-center` UI.
- Added category filter chips (`全部分類` + per-category) to narrow visible sections.
- Added anchor nav active state highlighting for visible sections.
- Added section visibility signal on anchor chips (non-visible categories dimmed).
- Added scroll-based active section tracking via `IntersectionObserver`.

## Intentionally not ported
- Legacy `/help-center/[slug]` article tree and separate nav component structure.
- Any backend/data model changes.
- Any route changes beyond existing redirects.

## Route behavior status
- `/help-center` remains the canonical standalone Help Center route.
- `/help` continues redirecting to `/help-center`.
- `/faq` continues redirecting to `/help-center#api-data`.
- No sidebar reintroduction of `常見問題`.

## Modified files
- `src/components/help/help-center-shell.tsx`
- `docs/DOCS_HELP_CENTER_SEARCH_PORT.md`

## Validation
- `npm run lint`
- `npm run build`
