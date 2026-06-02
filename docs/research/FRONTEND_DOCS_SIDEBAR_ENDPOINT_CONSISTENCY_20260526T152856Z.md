# FRONTEND_DOCS_SIDEBAR_ENDPOINT_CONSISTENCY_20260526T152856Z

## Executive Summary
- Sidebar items audited: 0
- API items audited: 0
- Missing docs content routes: 0
- Deprecated/alias route findings: 0
- Beta/Deferred label findings: 0

## Duplicate Checks
- Duplicated routes: 0
- Duplicated titles: 0

## Missing Content Routes
- None

## Alias / Deprecated Route Naming
- None

## Beta / Deferred Label Consistency
- Consistent

## Endpoint String Notes
- Endpoint strings extracted from docs content: 72
- Endpoint strings extracted from llms-full: 0
- Endpoint mapping is present for API docs, but route aliases should be normalized to canonical paths for consistency.

## Suggested Follow-up
- Unify sidebar source-of-truth between `src/content/docs-sidebar.ts` and `src/content/docs-pages.ts` to avoid copy drift.
- Align sidebar labels with current policy wording (TPEx Beta / Adjusted Deferred).
- Replace alias href with canonical href in overview sidebar items.