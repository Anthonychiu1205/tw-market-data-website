# Website Build Hang Diagnosis

## Scope
Diagnose `npm run build` hang after Help Center searchable nav port (`b443fa7`) without feature changes.

## Observations
- `npm run lint`: pass.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: reproducible long silent period at:
  - `Creating an optimized production build ...`
- A prior run showed near-zero CPU for `next build` while still alive; this looked like a hang from terminal perspective.
- Controlled run with 180s timeout equivalent completed successfully before timeout:
  - `Compiled successfully`
  - `Running TypeScript`
  - `Collecting page data`
  - `Generating static pages (205/205)`
  - `Finalizing page optimization`
  - exit code `0`

## Root Cause
No functional build break introduced by Help Center search port.

The perceived hang was caused by a combination of:
1. **Long quiet phases** in Next.js/Turbopack build output (especially optimized production build), and
2. **Residual concurrent/stale build processes** from prior interrupted runs, which can make later runs appear stuck or conflict.

## Checks on Help Center changes
- `src/components/help/help-center-shell.tsx` is a client component (`"use client"`).
- Browser APIs (`IntersectionObserver`, `document`) are only used inside `useEffect`.
- No SSR-time direct `window/document` usage outside effects.
- Redirect routes (`/help`, `/faq`) are valid and not causing build-time loops.
- No backend or package changes required.

## Fixes Applied
- No code-path fix required for product logic.
- Operational guidance: ensure no concurrent `next build` process before re-running build.

## Validation
- `npm run lint` ✅
- `NEXT_TELEMETRY_DISABLED=1 npm run build` ✅
- Timeout-bounded verification (180s equivalent) ✅ exit code `0`

## Deployment Readiness
- Build pipeline is healthy from repository state.
- Safe to push/deploy from a build perspective after ensuring single build process execution.
