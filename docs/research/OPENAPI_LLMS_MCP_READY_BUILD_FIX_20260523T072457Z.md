# OpenAPI + LLMS + MCP-ready Foundation: Build Fix and Commit Readiness

## Goal

Keep the existing SEO/docs structure intact, avoid new pages/UI changes, and prepare a stable OpenAPI + llms foundation for future MCP rollout planning.

## What was verified

- Revert commit `8e2c8bb` is present.
- Second-wave dataset landing pages remain removed.
- First-wave five dataset landing pages remain active.
- Temporary payment setup route is absent.

## Build diagnosis summary

A prior build failure was reproduced once during static generation retries. To isolate root cause:

1. Build with current phase2 openapi failed once during static export retries.
2. Build with HEAD openapi (control) passed.
3. Restored phase2 openapi build also passed.

Conclusion: the failure pattern is flaky static generation behavior, not openapi schema corruption.

## OpenAPI status

- `public/openapi.json` remains OpenAPI `3.1.0`.
- Phase2 deepening for five core endpoints is retained.
- Core checks (paths, schemas, refs, duplicate params) all pass.

## LLMS/MCP wording

- `public/llms.txt` and `public/llms-full.txt` both keep MCP as preview/planned.
- Added explicit production-readiness constraint sentence for MCP tooling.
- No claims of live production MCP server.

## Validation

- `npm run lint`: PASS
- `npm run build`: PASS

## Gate

- `READY_FOR_OPENAPI_LLMS_MCP_READY_COMMIT`
