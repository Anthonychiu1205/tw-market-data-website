# TW Market Data Launch Readiness Audit

Date: 2026-05-07  
Scope: `app/**`, `src/**`, `data/**`, `docs/**`, `public/**`, `package.json`, `next.config.ts`, `vercel.json`, `.env.example`, `README.md`

## Executive Summary
- Overall readiness: **Not Ready**
- Top 5 blockers:
  1. `npm run build` currently fails (TypeScript type error) and blocks deployment.
  2. Website content still markets non-available capabilities as `available_now` in key surfaces (site/product/pricing/dashboard playground/docs).
  3. Core site config still uses placeholder production values (`https://example.com`, `support@example.com`).
  4. SEO baseline is incomplete for launch (docs coverage missing from sitemap, no site-level Twitter/OG image strategy, no llms discovery files).
  5. Security hardening gaps remain (`AUTH_SECRET` insecure fallback, login page reveals demo credentials from env).
- Top 5 quick wins:
  1. Fix the Recharts formatter typing error in `billing-credits-page.tsx`.
  2. Replace `src/content/site.ts` and pricing/playground capability claims with backend-aligned dataset set.
  3. Set real `NEXT_PUBLIC_SITE_URL` and `supportEmail` defaults for production-safe metadata.
  4. Expand sitemap to include docs dynamic routes and key static routes from docs config.
  5. Remove runtime display of demo credentials on login page for non-local environments.

## Security Review
| Severity | Finding | Evidence / File | Risk | Recommended Fix |
|---|---|---|---|---|
| High | Insecure fallback session signing secret in code | `src/auth/token.ts:9` (`"dev-only-secret-change-in-production-tw-market-data"`) | If `AUTH_SECRET` is missing in deploy, session tokens are forgeable/predictable. | Fail fast when `AUTH_SECRET` is missing in non-dev; remove hardcoded fallback. |
| Medium | Login page exposes configured demo credentials in UI | `app/login/page.tsx` (`<details>... DEMO_USER_EMAIL / DEMO_USER_PASSWORD`) | Operational credentials leak to any visitor if env values are real/reused. | Gate by `NODE_ENV === "development"` or remove entirely in production builds. |
| Medium | Refresh endpoint returns full snapshot object on refresh path | `app/api/market-marquee/route.ts` (`snapshot: result.snapshot`) | Not raw rows, but may expose more metadata than needed to cron caller; expands attack surface if secret leaked. | Return minimal refresh result by default; add debug-only verbose mode guarded by stronger auth. |
| Low | `dangerouslySetInnerHTML` used for JSON-LD | `app/blog/[slug]/page.tsx:136-138` | XSS risk if untrusted content reaches schema fields. | Keep source strictly controlled/sanitized; avoid user-generated HTML in schema payload fields. |
| Low | No explicit CSP/security headers configured | `next.config.ts` has no `headers()` security policy | Missing defense-in-depth against XSS/clickjacking/sniffing. | Add `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` headers in Next config/middleware. |

## Stability Review
| Severity | Finding | Evidence / File | Risk | Recommended Fix |
|---|---|---|---|---|
| Critical | Build fails on TypeScript | `src/components/dashboard/billing-credits-page.tsx:227` (`formatter={(value: number) => ...}`) | Cannot ship; CI/CD blocked. | Update formatter signature to accept `ValueType | undefined` and guard undefined. |
| High | Legacy docs redirect points to non-existent target | `app/docs/api/company-profiles/page.tsx:4` redirects to `/docs/api/company-profile` (no matching docs page entry) | User can land on 404/inconsistent routing. | Redirect to existing canonical route (`/docs/api/company/issuer-profile`). |
| Medium | Docs experience still contains local-only live demo endpoint | `src/components/docs/twse-daily-price-live-demo.tsx:39` uses `http://127.0.0.1:8011` | Broken UX in production docs; can confuse customers. | Hide in production, or convert to static/mock demo with clear label. |
| Medium | No custom `not-found` / `error` / `loading` boundaries | No `app/not-found.tsx`, `app/error.tsx`, `app/loading.tsx` found | Poor failure UX and weaker resilience. | Add minimal global and docs-specific error/not-found/loading pages. |
| Low | Accessibility gaps in modal behavior (no focus trap / focus return) | `src/components/layout/contact-modal.tsx` | Keyboard users can tab to background content while modal open. | Add focus trap, initial focus, and restore trigger focus on close. |

## Content Accuracy Review
| Severity | Finding | Evidence / File | Risk | Recommended Fix |
|---|---|---|---|---|
| Critical | Non-available datasets still marked `available_now` in core catalog source | `src/content/site.ts:37-42` (ownership-distribution, institutional-ownership, index-constituents, etf-flow, derivatives-market, convertible-bonds) | Frontend promise diverges from backend source of truth; trust risk and sales misalignment. | Rebuild `datasetProducts` from backend-approved production/normalized/preview set only. |
| High | Pricing plans include disallowed capabilities | `src/components/pricing/pricing-shell.tsx:215-220,247-252,278-279,340` | Customers may buy based on unavailable features. | Remove or relabel unsupported features as hidden/pending (not visible on public plans). |
| High | Dashboard playground exposes disallowed endpoint options | `src/components/dashboard/request-response-playground.tsx:26-32` | Demo implies endpoint availability that backend does not provide as available-now. | Restrict options to backend-aligned endpoints only. |
| High | API marketing page states 26 datasets including unsupported categories | `app/api/page.tsx:30` | Public claim is factually inconsistent with backend contract. | Rewrite copy to backend-aligned capability list and status tiers. |
| High | Docs content still contains legacy/non-target references (e.g., analyst estimates) | `src/content/docs-pages.ts:975,1002,1028` and multiple coming-soon blocks | Content drift and credibility loss for TW-only positioning. | Archive/remove legacy sections from rendered docs surface; keep internal notes outside public docs routes. |
| Medium | Contact identity inconsistent in config | `src/config/site.ts:7` (`support@example.com`) vs modal/docs `avenra.platform@gmail.com` | Inconsistent brand/support channel and structured metadata inaccuracies. | Unify to `avenra.platform@gmail.com` in config and downstream metadata usage. |

## SEO / AI Discoverability Review
| Severity | Finding | Evidence / File | Risk | Recommended Fix |
|---|---|---|---|---|
| High | Site URL defaults to `https://example.com` | `src/config/site.ts:6` | Wrong canonical/OG/sitemap URLs if env missing. | Enforce required `NEXT_PUBLIC_SITE_URL` in production; fail build when absent. |
| High | Sitemap does not include docs dynamic pages | `app/sitemap.ts` only static routes + blog | Docs coverage/indexing is incomplete. | Generate sitemap entries from `docsPages` slugs plus canonical aliases. |
| Medium | Global metadata lacks explicit Twitter card config | `app/layout.tsx` has `openGraph` but no `twitter` block | Weaker SERP/social snippet consistency. | Add Twitter metadata (`card`, `title`, `description`, image). |
| Medium | No site-level Organization/Product structured data | JSON-LD only in blog detail (`app/blog/[slug]/page.tsx`) | Lower entity understanding for search/LLM crawlers. | Add global `Organization` + `WebSite` schema in root layout; product schema on homepage/pricing. |
| Medium | `llms.txt` / `llms-full.txt` missing | No files found in repo root/public | Reduced AI-agent discoverability and retrieval quality. | Add controlled `llms.txt` and optional `llms-full.txt` with docs map + usage policy. |
| Medium | Docs metadata lacks canonical per page | `app/docs/[...slug]/page.tsx` generateMetadata has title/description only | Duplicate/alias indexing risk across docs redirects. | Add `alternates.canonical` derived from resolved docs href. |
| Low | No dedicated OG image asset/route for key pages | `public/` only logo found | Lower CTR and inconsistent social previews. | Add standard OG images (home/docs/pricing/blog) and metadata references. |

## Backend Capability Alignment

### Confirmed production datasets
- `GET /v2/datasets/twse-daily-price` (TWSE)
- `GET /v2/datasets/tpex-daily-price` (TPEx)

### Confirmed normalized datasets
- `GET /v2/datasets/monthly-revenue`
- `GET /v2/datasets/income-statement`
- `GET /v2/datasets/balance-sheet`
- `GET /v2/datasets/cash-flow-statement`
- `GET /v2/datasets/valuation-data`
- `GET /v2/datasets/technical-indicators`
- `GET /v2/datasets/institutional-flow`
- `GET /v2/datasets/margin-short`
- `GET /v2/datasets/issuer-profile`
- `GET /v2/datasets/issuer-announcements`
- `GET /v2/datasets/events`
- `GET /v2/datasets/structured-events`
- `GET /v2/datasets/corporate-actions`
- `GET /v2/datasets/dividends`
- `GET /v2/datasets/index-data`
- `GET /v2/datasets/market-breadth`
- `GET /v2/datasets/interest-rate-snapshot`
- `GET /v2/datasets/theme-taxonomy`
- `GET /v2/datasets/index-classification`
- `GET /v2/datasets/features`
- `GET /v2/datasets/factor-data`
- `GET /v2/datasets/time-alignment`
- `POST /v2/datasets/screener`
- `GET /v2/search`
- `GET /v2/query`
- `GET /v2/query/fields`
- `GET /v2/query/examples`

### Preview datasets
- `GET /v2/datasets/company-news`
- `GET /v2/datasets/market-news`

### Items that must not be marketed as available-now
- ETF Flow
- 可轉債
- 衍生品
- 指數成分
- 法人持股
- 持股分布
- 供應鏈資料
- analyst estimates
- SEC filings / CIK
- insider trades
- crypto
- US tickers

## Launch Checklist

### Must fix before launch
- [ ] Fix build-breaking TypeScript error in `billing-credits-page.tsx`.
- [ ] Remove/relable all unsupported capabilities from public marketing surfaces (`site.ts`, pricing, API page, playground, docs-visible pages).
- [ ] Set production-safe `NEXT_PUBLIC_SITE_URL` and support email values.
- [ ] Ensure docs routes/redirects resolve to valid canonical pages.
- [ ] Remove production exposure of demo credentials on login page.

### Should fix before launch
- [ ] Add full docs coverage to sitemap.
- [ ] Add Twitter metadata + consistent OG image strategy.
- [ ] Add Organization/WebSite structured data.
- [ ] Add canonical metadata for docs dynamic pages.
- [ ] Add focus trap/focus-return for contact modal and keyboard QA pass.

### Can fix after launch
- [ ] Add `llms.txt` / `llms-full.txt` for AI retrieval optimization.
- [ ] Add custom global `not-found`, `error`, and `loading` pages.
- [ ] Rationalize legacy docs aliases into a formal redirect map doc.
- [ ] Tighten market-marquee refresh response payload to minimum operational data.

## Recommended Next Codex Task
```text
請執行「Launch Blockers Batch-1」修復（只做必要修正，不做視覺重構）：
1) 修正 build blocker：src/components/dashboard/billing-credits-page.tsx 的 Recharts formatter 型別。
2) 將 src/content/site.ts 的 datasetProducts 僅保留 backend confirmed production/normalized/preview 能力，移除 ETF Flow/可轉債/衍生品/指數成分/法人持股/持股分布/供應鏈等 available_now 宣稱。
3) 同步修正 app/api/page.tsx 與 src/components/pricing/pricing-shell.tsx、src/components/dashboard/request-response-playground.tsx 的能力文案/選項，對齊 backend truth。
4) 修正 src/config/site.ts：supportEmail 改為 avenra.platform@gmail.com；若 NEXT_PUBLIC_SITE_URL 缺失，production build 要 fail fast。
5) 修正 docs 壞連結：app/docs/api/company-profiles/page.tsx 轉向 /docs/api/company/issuer-profile。
完成後執行 npm run lint && npm run build，回報變更檔案、剩餘 blocker、以及是否可進入 Launch Blockers Batch-2（SEO/metadata/sitemap）。
```
