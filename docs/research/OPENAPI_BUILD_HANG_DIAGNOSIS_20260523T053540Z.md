# OpenAPI Schema Phase1 Build Hang Diagnosis

- Timestamp (UTC): 20260523T053540Z
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Scope: Diagnose `npm run build` hang after OpenAPI schema deepening.

## Safety Precheck
- Staged area: empty
- Tracked dirty: `public/openapi.json`
- Temporary setup route: absent
- No commit/push/deploy performed

## OpenAPI Size/Shape
- File size: 42K (`41722` bytes)
- Lines: 1482
- Paths: 9
- Schemas: 11
- Parameters: 8
- Responses: 4

## Build-Time Consumer Audit
No code path found that reads/parses the full `public/openapi.json` at build time (no `fs.readFileSync` consumer targeting OpenAPI). Current usage is link/reference text in docs/llms/sitemap.

## Reproduction
1. Phase1 OpenAPI + 180s timeout: timeout at static generation phase.
2. HEAD OpenAPI + 180s timeout: also timeout.
3. Phase1 OpenAPI + 300s timeout: PASS in ~214.74s.

## Integrity Checks
- JSON parse: pass
- Core path/schema check: pass
- `$ref` integrity: pass (no missing refs)
- Duplicate operation params: none
- Lint: pass

## Diagnosis
This is not an OpenAPI corruption issue. The perceived "hang" is build-duration sensitivity (Next.js SSG for many pages), where 180s can be insufficient in this environment.

## Decision
- Gate: `READY_FOR_OPENAPI_SCHEMA_PHASE1_COMMIT`
- Recommended operational tweak: use `>=300s` timeout for CI/local build guard in this repo.
