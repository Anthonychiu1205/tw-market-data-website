# API Playground Ratio and Empty Space Fix

## Objective
Fix modal proportion mismatch and left panel empty-space/squeezing issues while preserving safe preview behavior.

## What Changed
- Ratio adjusted to left-heavy ~60/40 using:
  - `grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]`
- Left parameter metadata column widened to 232px for better field readability.
- Query parameter card now uses `max-h-[312px]` with internal scroll so the bordered area no longer visually stretches downward.
- Response section no longer uses `flex-1` stretch semantics.

## Preserved Behavior
- Query fields still generated from `apiReference.queryParameters`.
- Run remains preview-only with no real network request.
- API key remains in React state only.

## Validation
- `npm run lint`: PASS
- `npm run build`: PASS
