# Docs Sidebar IA Order and Unique Icons

## Summary

Adjusted docs sidebar information architecture, ordering, labels, and icon mapping only.

- No page additions/deletions
- No route slug changes
- No docs body content changes
- No layout redesign

## Sidebar source

- `src/content/docs-sidebar.ts`
- `src/components/docs/docs-page-shell.tsx`

## Final group order

1. OVERVIEW
2. INTEGRATIONS
3. APIS
4. GUIDES
5. SDKS
6. AI AGENTS
7. SUPPORT

## Key moves

- Moved `API 模型` and `Tools / MCP` from OVERVIEW to INTEGRATIONS.
- Added existing route item label `OpenAPI 規格` (`/docs/openapi-spec`) to INTEGRATIONS.
- Moved `Support`, `幫助中心`, `常見問題` to SUPPORT.

## Icon uniqueness

Assigned unique icon per sidebar item and verified no duplicates across all listed sidebar items.

## Validation

- `npm run lint`: PASS
- `npm run build`: PASS

## Constraints

- No backend/auth/billing/API behavior changes
- No dependency changes
- No push/deploy in this step
