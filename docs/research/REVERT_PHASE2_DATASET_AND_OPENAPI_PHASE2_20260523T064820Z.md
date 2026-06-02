# Revert Dataset Slug Phase2 and OpenAPI Phase2

## Summary

- Reverted `fe91686` successfully via commit `8e2c8bb`.
- Confirmed second-wave dataset slug additions are removed.
- Confirmed first-wave five dataset slug pages remain.
- Applied OpenAPI phase2 deepening only to `public/openapi.json`.
- OpenAPI parse/core/ref checks passed.
- Lint passed.
- Build currently hangs at Next.js optimized production build phase in this local runtime; no explicit error emitted.

## Revert Result

- Target: `fe91686 feat(seo): add second wave dataset landing pages`
- Result: success
- Revert commit: `8e2c8bb Revert "feat(seo): add second wave dataset landing pages"`

## OpenAPI Phase2 Scope

- File changed: `public/openapi.json`
- No endpoint additions.
- No UI or backend behavior changes.
- Deepened examples, metadata, response envelopes, error examples, and operation-level caveat fields for five core endpoints.

## Validation

- `openapi json parse`: PASS
- core endpoint/schema checks: PASS
- `$ref` integrity and duplicate parameter checks: PASS
- sensitive-string scan: PASS (no match)
- `npm run lint`: PASS
- `npm run build`: hanging (no completion before manual stop)

## Gate Decision

- `NEED_BUILD_FIX`

Rationale: commit for OpenAPI phase2 should wait until build completes successfully in this environment.
