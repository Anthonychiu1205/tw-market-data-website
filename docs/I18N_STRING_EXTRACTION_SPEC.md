# I18N-01 — String Extraction Spec & Bilingual Glossary

Reference for every page/component converted under I18N-01. Follow it exactly so keys, tone, and
terminology stay consistent across the whole surface. Reference implementations already merged:
`src/components/layout/site-header.tsx`, `site-footer.tsx`, `contact-modal.tsx`,
`analytics-controls.tsx`.

## 1. Mechanics

### 1.1 Locale-aware links (mandatory)
Replace `import Link from "next/link"` with the locale-aware navigation primitive:

```tsx
import { Link } from "@/src/i18n/navigation";
```

Callers keep **bare** paths (`/pricing`, `/docs`) — the current locale prefix is added automatically.
Never hardcode `/en/...` or `/zh-TW/...`. `useRouter`, `redirect`, `usePathname`, `getPathname` come
from the same module when needed. (Analytics page-view tracking keeps `next/navigation`'s
`usePathname` — it wants the *real* pathname, prefix included.)

### 1.2 Strings — Client Components
```tsx
import { useTranslations } from "next-intl";
const t = useTranslations("namespace");
// ...
{t("key")}
```

### 1.3 Strings — Server Components (async)
```tsx
import { getTranslations } from "next-intl/server";
const t = await getTranslations("namespace");
```
Server pages that render static content must also call `setRequestLocale(locale)` before any
next-intl API (the `[locale]/layout` already does this for the subtree, but a page that reads
`params.locale` and wants static rendering should call it too).

### 1.4 Module-level arrays
Data arrays defined at module scope cannot call `t()`. Store a `labelKey` (not a `label`) and resolve
in render:
```tsx
const navItems = [{ href: "/pricing", labelKey: "pricing" }] as const;
// render: {t(item.labelKey)}
```

### 1.5 Messages files
`messages/en.json` + `messages/zh-TW.json`, one namespace per surface. Keys identical across both
files (a missing key fails CI — §1.4 of the work order / see telemetry PR). Namespaces so far:
`nav`, `footer`, `contactModal`, `cookieBanner`, `common`. Add one per page/section
(`home`, `pricing`, `product`, `datasets`, `docs`, `faq`, …). Keep keys semantic, not positional
(`hero.title`, not `line1`).

### 1.6 Long-form prose
Short UI chrome → messages JSON. Long-form page prose also goes in messages JSON (namespaced per
page); use `t.rich()` for embedded markup/links. **Structured content data** (`src/content/*.ts` —
datasets, docs-pages, mega-menu) instead gets parallel `*_en` fields + a locale selector, because it
is data, not view. Numbers stay shared (see §2).

## 2. Anti-fabrication (CLAUDE.md 鐵律 — non-negotiable)
- **Mirror numbers exactly.** English copy reproduces the SAME figures as the zh source. Never invent
  coverage counts, dates, prices, RPM, ticker examples, or stats. Pull from the existing SSOT
  (`coverage-facts.ts`, `plans.ts`, `dataset-policies.ts`) — do not restate a number the zh page
  didn't state.
- **No new claims.** If the zh text hedges ("依來源逐步擴展"), the English hedges the same way.
  Translation adds tone, never facts.
- **假不了就不顯示.** If a value can't be sourced truthfully in English, omit it — don't approximate.

## 3. English tone
Target Polygon.io / Alpha Vantage register: factual, developer-first, concise. Active voice, present
tense, no marketing fluff, no exclamation marks. "Daily OHLCV for TWSE-listed stocks — for
backtests, factor research, and AI agent workflows." NOT machine-translated zh phrasing. Prefer the
canonical terms in the glossary below.

## 4. Bilingual glossary (canonical translations)

### Market data
| zh-TW | English |
| --- | --- |
| 台股 | Taiwan stocks / Taiwan equities |
| 上市(TWSE) | TWSE-listed (Taiwan Stock Exchange) |
| 上櫃(TPEx) | TPEx / OTC (Taipei Exchange) |
| 資料集 | dataset |
| 日線價格 | daily prices / daily OHLCV |
| 開高低收 | open/high/low/close (OHLC) |
| 成交量 | volume |
| 成交金額 | turnover (traded value) |
| 月營收 | monthly revenue |
| 損益表 | income statement |
| 資產負債表 | balance sheet |
| 現金流量表 | cash flow statement |
| 三大法人買賣超 | institutional net buy/sell (three major investors) |
| 外資 / 投信 / 自營商 | foreign investors / investment trusts / dealers |
| 借券 | securities lending (SBL) |
| 融資融券 | margin trading & short selling |
| 融資 / 融券 | margin balance / short balance |
| 市場廣度 | market breadth |
| 回測 | backtesting |
| 技術指標 | technical indicators |
| 波動率 / 報酬率 | volatility / returns |
| 基本面 / 估值 | fundamentals / valuation |
| 年增率(YoY) / 月增率(MoM) | year-over-year (YoY) / month-over-month (MoM) |
| 未來函數 | look-ahead bias |
| 逐值對帳 | value-by-value reconciliation |
| 官方來源 | official source |
| 資料血緣(lineage) | data lineage |
| 資料缺口(data_gaps) | data gaps |
| 覆蓋範圍 | coverage |
| 更新頻率 / 延遲 | update cadence / latency |
| 新鮮度(freshness) | freshness |
| point-in-time / as_of | point-in-time / as-of (keep as-is) |

### Product & API
| zh-TW | English |
| --- | --- |
| API 金鑰 | API key |
| 端點 | endpoint |
| 方案 | plan |
| 訂閱 | subscription |
| 額度 / 用量 | quota (credits) / usage |
| 儀表板 | dashboard |
| 計費 | billing |
| 錢包 | wallet |
| 內含額度 | included quota |
| 超量 | overage |
| 加值 | top-up |
| 免費層 | free tier |
| 速率限制(RPM) | rate limit (RPM, requests per minute) |
| 資料授權 | data licensing |
| 企業合作 | enterprise partnership |

### Billing
| zh-TW | English |
| --- | --- |
| 訂閱方案 | subscription plan |
| 取消訂閱 | cancel subscription |
| 期末取消 | cancel at period end |
| 付款方式 | payment method |
| 帳單紀錄 / 發票 | billing history / invoices |
| 補差價(proration) | proration |

### Company & legal
| zh-TW | English |
| --- | --- |
| 非投資建議 | not investment advice |
| 服務條款 / 隱私政策 | Terms of Service / Privacy Policy |
| 退款 | refund |

### Keep untranslated (proper nouns / identifiers)
`TW Market Data`, `TWMD`, `TWSE`, `TPEx`, `MCP`, `OHLCV`, dataset `slug`s, `as_of`, `data_gaps`,
API field names, ticker symbols (e.g. `2330`).

## 5.0 Progress ledger (I18N-01)

**Done (bilingual, tsc-verified, committed):**
- Infra: next-intl + `app/[locale]` migration + `proxy.ts` locale/auth merge (PR #81).
- Chrome: header, footer, contact-modal, cookie-banner; legal disclaimer EN selector.
- Home: homepage body + hero + all `home/*` sections + all `home/*` demos (chrome only) + mega-menu content data.
- Pricing: page + shell + comparison table (plan-card copy deferred — see §5.1).
- Public pages: contact, about, product, refund, terms, privacy, compare, connect,
  connect/which-tier, connect/key-safety.
  (legal EN for terms/privacy/refund + disclaimer EN → pending owner legal sign-off.)
  (connect `pasteLine` copy command still zh — minor, localize later.)
- Auth cluster: login, register, verify-email, forgot-password, reset-password (5 pages + 6 form components).
- Help cluster: help-center.ts (FAQ data → `*_en` + `getHelpCategories(locale)` selectors), help-center-shell,
  help-center page. faq/help are redirect pages (only their metadata remains, SEO PR4).
- Datasets cluster: datasets.ts (10-dataset catalog → `*_en` prose + `getDatasetSeoEntries`/`getDatasetSeoEntry`
  selectors, all facts/numbers/dates/tickers mirrored, no fabrication), datasets page + [slug] + 2 components.
- Answers cluster: answer-pages.ts already per-locale (5 en + 3 zh-Hant entries, distinct slugs) → `getPublishedAnswerPages(locale)`,
  page + [slug] chrome.
- Blog cluster: chrome + category-label map + §2.5 "English coming soon" fallback (article bodies stay zh for human EN copywriting — flag below).
- Message catalog: **564 keys, full en/zh parity**. Multiple full production builds green.

**Remaining content-data files (need `*_en` fields + locale selector, spec §1.6):**
- `src/content/site.ts` — `platformCapabilities` + `sourcePolicy` (product/about) + `datasetProducts` (28 rows, datasets).
- about-page content data (`aboutSections`).
- `src/content/datasets.ts` (337) — dataset catalog EN prose (~18 fields × 10 datasets) — dedicated phase.
- `src/content/answer-pages.ts` (458), `src/content/blog-posts.tsx` (220), `src/content/docs-*` (esp. `docs-pages.ts` **12,149 lines**), `src/content/dashboard.ts` (146, PR3).
- Landmine demo files (home-source-of-truth.ts etc.) — blocked on owner decision (§5).
- DONE: `mega-menu-links.ts`, `help-center.ts`.

**Remaining component clusters:** docs/* (12), dashboard/* (20, PR3). (auth/*, help/*, blog/*, datasets/* DONE.)

**Remaining page bodies:** docs (+[...slug]). **Blog article bodies** (blog-posts.tsx) stay zh with §2.5 fallback — need human EN copywriting (not mechanical).

**Remaining cross-cutting:** page `metadata`/`generateMetadata` + hreflang/canonical/JSON-LD/`sitemap.ts`/`robots.ts` (PR4 SEO); missing-page fallback + missing-key telemetry (PR4).

## 5.1 Deferred: billing-SSOT copy localization (`plans.ts`)
`src/lib/billing/plans.ts` holds plan-card **display copy** in zh: `summary`, `highlights[].text`,
`ctaLabel`, and `datasetLimit` for all 6 tiers (+ `getRequestLimitLabel`, `formatPlanPrice` fallback
"聯繫我們"). It is the SSOT shared by the pricing page (PR2), the billing/subscription pages, and
`cancellation-copy.ts` (PR3). The pricing page's own chrome + comparison table are localized; the
plan CARDS still render these zh strings on `/en`. **Deferred to the billing-localization step** (do
it once, alongside PR3) rather than rushed here — recommended approach: move the display copy to the
messages catalog (`pricing.plans.<code>.*`), keep `plans.ts` as the numeric/structural SSOT (prices,
quotas, icons, order), and have the pricing shell + billing views zip icon+text at render. Numbers
stay in `plans.ts`.

## 5. Open items for owner review
- **Legal disclaimer EN** (`INVESTMENT_DISCLAIMER_EN` in `src/lib/legal/disclaimer.ts`): faithful
  translation of the canonical zh non-investment-advice line; needs legal sign-off. zh string is
  unchanged (STORE-01 masters still match byte-for-byte).
- **🔴 CLAUDE.md 鐵律 2 — SYSTEMIC homepage-demo landmine (pre-existing, surfaced by i18n).**
  The entire homepage demo layer renders **fabricated numbers dressed as real API output on real
  Taiwan tickers** — "禁假數字貼真實 ticker". Four files, all on the public homepage:
  1. `src/components/home/market-coverage-showcase.tsx` → `MARKET_COVERAGE_DEMO_CONFIG`:
     `2330 台積電` 營收成長 18.2% / 毛利率 53.1% / $2.89T, plus 2454/2317/2308/3711/3231.
  2. `src/components/home/agent-workflow-demo.tsx` → `DEFAULT_CONFIG`: `2330 台積電` full income
     statement (營收 $2,894.3B / 毛利率 52.4% / etc., 2020–2024 columns).
  3. `src/content/home-source-of-truth.ts` (rendered by `source-of-truth-section.tsx`): `2330`
     across **7 sample datasets** (monthly_revenue, twse_daily_price OHLCV, income_statement,
     technical_indicators, valuation_data, institutional_flow) + `1101 台泥` day-trading-suspension.
  4. `src/components/home/api-demo-section.tsx` → `buildMockResponse`: fabricated financials for
     `2330 / 2317 / 2454 / 2308` across monthly_revenue, twse_daily_price, income_statement,
     technical_indicators.
  The i18n pass deliberately did NOT localize any of these demo-data blocks (translating them would
  entrench the fabricated numbers into English too). **Owner decision needed** before localizing:
  per file — (a) wire to real sourced values, (b) switch to obviously-fake placeholder tickers
  (e.g. `0000 DEMO CO`), or (c) remove the demo. Until then their in-demo zh labels stay zh on /en.
- **Pricing comparison-table SSOT duplication (鐵律 1, pre-existing):**
  `src/components/pricing/pricing-shell.tsx` hardcodes `QUOTA_ROWS` prices/RPM/included-requests
  ($2,000/$200/$100/$20; 12,000/3,000/1,200/300/60 RPM; 3,000,000/300,000/… included) that
  duplicate `plans.ts` (the pricing CARDS derive the same numbers from that SSOT via
  `getPricingPlanViews`). If `plans.ts` changes, the comparison table drifts. Not an i18n issue, but
  surfaced during the pricing conversion — recommend deriving the table rows from the plan SSOT too.
