# Margin Short Website Deploy Preflight Decision

## Validation
- `npm run lint`: passed
- `npm run build`: passed
- non-blocking build note: Next build emitted dynamic server usage messages for auth/billing routes during static generation, but final exit code was `0`; this is not treated as a margin_short sync failure

## Deploy preflight review
- route presence: pass
- dataset catalog visibility: pass
- dataset detail SEO/content source: pass
- docs API route presence: pass
- docs API content consistency with backend handoff: blocked by remaining wording/field drift in `src/content/docs-pages.ts`

## Decision
`MARGIN_SHORT_WEBSITE_POST_SYNC_BLOCKED_BY_CONTENT_GAP`

## Why deploy is still blocked
- the website now surfaces the dataset in catalog/detail navigation correctly
- however, the docs API page still contains older contract fragments, so deploy would publish mixed semantics for the same dataset
- a follow-up docs-page-only cleanup should happen before asking for deploy approval
