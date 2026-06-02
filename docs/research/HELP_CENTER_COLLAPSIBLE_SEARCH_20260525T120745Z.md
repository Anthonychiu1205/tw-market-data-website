# Help Center Collapsible/Search Phase

## Scope
- Add collapsible category navigation for Help Center.
- Add client-side search for article discovery.
- Refine related-articles hover feedback (no movement).
- Add 5 new Help Center articles.

## Key Changes
- New client component: `src/components/help-center/help-center-nav-search.tsx`
  - Shared filtering logic for index/article contexts.
  - Category-level expand/collapse with active category default-open.
- Updated `src/components/help-center/help-center-shell.tsx`
  - Wired index/article UI to collapsible + searchable nav.
  - Related-articles links now use border/background/text color transitions only.
- Updated `src/content/help-center-articles.ts`
  - Added 5 new articles:
    - `billing-payment-review`
    - `login-problems`
    - `api-response-fields`
    - `freshness`
    - `report-data-issue`
  - Total articles: 20.

## Validation
- `npm run lint`: PASS
- `npm run build`: PASS
- No `本頁章節` or `更新時間` rendering in Help Center UI.
- No hover translate/scale in help-center components.
- Related articles capped at 3 per article.

## Constraints
- No backend/API/auth/billing behavior changes.
- No OpenAPI/llms changes.
- No push/deploy.
