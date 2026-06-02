# Remove Plan Requirement Section from Docs Pages

## Scope

Remove only docs-page display of Plan Requirement blocks and corresponding TOC anchors.

## Findings

Plan Requirement UI and TOC anchors were injected in `app/docs/[...slug]/page.tsx` in two API rendering branches:

1. data-api-standard layout
2. default API layout

Both relied on `api.planRequirement` from docs content data.

## Change

- Removed `plan-requirement` entry from `tocSections` generation in both branches.
- Removed section rendering blocks that displayed `api.planRequirement.title` and bullets in both branches.

No pricing/auth/billing/entitlement logic was changed.

## Validation

- `npm run lint`: PASS
- `npm run build`: PASS
- `app/docs/[...slug]/page.tsx` no longer contains `planRequirement`/`plan-requirement` render paths.

## Outcome

All docs pages rendered through this route no longer display Plan Requirement sections, and corresponding TOC item is removed.
