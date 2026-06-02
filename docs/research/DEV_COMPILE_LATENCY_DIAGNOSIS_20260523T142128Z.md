# Dev Compile Latency Diagnosis

## Scope

Read-only diagnosis for slow `Compiling...` while switching pages in `npm run dev`.

## Key observations

1. Project is on external USB volume (`/Volumes/DEV_USB`).
2. Next.js dev prints explicit warning: **Slow filesystem detected** for `.next/dev`.
3. Small-file write benchmark:
   - `/tmp`: ~0.05s for 1000 files
   - repo on USB: ~2.47s for 1000 files
   This is ~49x slower on USB.
4. Route behavior matches first-compile penalty:
   - first hits slower (`/datasets` ~6.16s, `/docs/openapi-spec` ~1.46s)
   - second hits fast (~0.02-0.05s)
5. `src/content/docs-pages.ts` is large (10k+ lines), likely adding docs-route module load/parse cost.
6. `public/openapi.json` appears static-served; no evidence it is the direct compile bottleneck.

## Conclusion

Primary cause: **USB I/O bottleneck** + expected Next.js dev first compile behavior.
Secondary contributor: docs content/module size.

## Recommended actions

1. Develop on internal SSD (or move `.next`/workspace for active dev to SSD).
2. Warm-up critical routes after server start.
3. Later optional refactor: split `docs-pages.ts` into smaller modules.
4. Keep generated artifacts outside watched workspace during heavy dev cycles.

## Non-actions in this run

- No code changes
- No dependency changes
- No commit/push/deploy
