# HARD-01 P0-4 — frontend security audit (website repo)

Scope claimed: **CI 加 npm audit** + **盤點前端有無硬編碼金鑰／端點**. This is the website (frontend)
half of P0-4; `pip-audit`, gitleaks full-history, and key rotation are the backend/owner halves.

Date: 2026-07-24. Redo this scan whenever dependencies or endpoint config change.

---

## 1. Hardcoded API keys / secrets — ✅ none found

Scanned `src/**` and `app/**` for live-key and secret patterns (`sk_live_`, `pk_live_`, `AKIA`,
`Bearer <literal>`, `api_key=<literal>`, `secret=<literal>`, `polar_*_<literal>`, …).

**Every `sk_live_` occurrence is a documentation placeholder**, not a real key:
`sk_live_...`, `sk_live_xxx`, `sk_live_bogus`, `sk_live_…`. They live in docs/content that show users the
key *format* (`src/content/answer-pages.ts`, `docs-pages.ts`, `docs/article-pages.ts`, `api-truth.ts`,
`components/docs/tools-mcp-content.tsx`) — correct and intended.

All real credentials are read from environment variables at runtime:
`TWMD_API_KEY`, `BACKEND_API_TOKEN`, `BACKEND_API_BASE_URL`, `POLAR_ACCESS_TOKEN`, etc. None are
inlined in source.

> Existing guard: `check:public-secrets` (`scripts/check_no_demo_credentials_in_public_build.mjs`)
> scans the built `.next` output for **demo credentials** specifically. Note it is NOT currently wired
> into the `build` chain — worth adding as a follow-up so it runs on every build, and widening it toward
> generic key patterns.

## 2. Hardcoded endpoints — ✅ all public, fetch bases env-driven

The only hardcoded hosts are **public twmarketdata.com origins**, used intentionally:

| Host | Where | Purpose |
|---|---|---|
| `https://twmarketdata.com` | `build-llms.ts`, `build-llms-full.ts`, `article-pages.ts` | public site origin for the agent index / docs URLs (documented: fixed so URLs are real regardless of build-time env) |
| `https://api.twmarketdata.com` | `facts-data.ts`, `catalog-stats.ts` (comment), `self-serve-client.ts` | public API base — **only as a fallback**; the real base is `process.env.BACKEND_API_BASE_URL` (and `SELF_SERVE_API_BASE_URL`) |
| `https://mcp.twmarketdata.com` | `article-pages.ts` | public MCP endpoint shown in docs |

No internal/private hosts (Neon, Render, Polar, localhost) are hardcoded in shipped code. Server-side
fetch bases resolve from env first, falling back to the public origin — e.g.
`FETCH_BASE = process.env.BACKEND_API_BASE_URL ?? "https://api.twmarketdata.com"`. This is safe.

## 3. `npm audit` — ⚠️ 9 vulnerabilities at baseline (gate now in CI, remediation pending)

Added a `Security audit` GitHub Actions workflow (`.github/workflows/security-audit.yml`) that runs
`npm audit` on every PR + push to main + weekly, and **fails on high/critical**. Plus Dependabot
(`.github/dependabot.yml`, npm + github-actions, weekly).

Current baseline (2026-07-24): **1 low, 6 high, 2 critical**. The gate is therefore RED until these are
remediated — that is the gate doing its job (surfacing P0 dependency debt).

| Package | Severity | Fix |
|---|---|---|
| `@auth/core` | critical | `npm audit fix` (no major bump) |
| `next-auth` | critical | `npm audit fix` |
| `@auth/prisma-adapter` | high | `npm audit fix` |
| `brace-expansion` | high | `npm audit fix` |
| `js-yaml` | high | `npm audit fix` |
| `next` | high | needs `next@16.2.11` (patch, but outside the pinned range → package.json bump) |
| `postcss` | high | via `next@16.2.11` |
| `sharp` | high | via `next@16.2.11` |

**Remediation path (recommended as the immediate follow-up PR, with a full build to verify):**
1. `npm audit fix` — clears the 5 auth/yaml/brace-expansion advisories with no major bump.
2. Bump `next` 16.2.3 → **16.2.11** (a patch within the same minor) — clears `next` / `postcss` / `sharp`.
3. Rebuild + verify all guards green.

Kept separate from this gate PR so the dependency bump can be built and tested on its own.
