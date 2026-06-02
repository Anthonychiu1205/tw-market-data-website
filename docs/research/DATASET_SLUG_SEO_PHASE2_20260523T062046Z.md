# Dataset Slug SEO Phase2

- Timestamp (UTC): 20260523T062046Z
- Repo: /Volumes/DEV_USB/Projects/tw-market-data-website
- Scope: Add second wave dataset landing pages without backend changes.

## Added slugs
1. /datasets/tpex-daily-price
2. /datasets/technical-indicators
3. /datasets/valuation-data
4. /datasets/issuer-profile
5. /datasets/margin-short
6. /datasets/company-events

## Implementation summary
- Added 6 metadata entries in .
- Reused existing dynamic route  (no route framework rewrite).
- Updated  family tabs links and ItemList JSON-LD URLs.
- Updated sitemap and llms indices to include new slug pages.
- Kept conservative caveats for coverage/freshness/source policy.

## Safety notes
- No cash-flow slug page added.
- No news-intelligence full-text slug page added.
- No false full-coverage claims.
- No investment-advice language.

## Validation
- 
> tw-market-data-website@0.1.0 lint
> eslint: PASS
- 
> tw-market-data-website@0.1.0 build
> prisma generate && next build

Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v6.9.0) to ./node_modules/@prisma/client in 1.09s

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)

Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints

▲ Next.js 16.2.3 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 2.4min
  Running TypeScript ...
  Finished TypeScript in 5.6s ...
  Collecting page data using 9 workers ...
  Generating static pages using 9 workers (0/202) ...
[dashboard-load] stage=auth/session durationMs=4 ok=false
[dashboard-load] stage=total durationMs=4 ok=false
[dashboard-load] stage=auth/session durationMs=0 ok=false
[dashboard-load] stage=total durationMs=1 ok=false
[dashboard-load] stage=auth/session durationMs=0 ok=false
[dashboard-load] stage=total durationMs=0 ok=false
  Generating static pages using 9 workers (50/202) 
  Generating static pages using 9 workers (100/202) 
Failed to build /privacy/page: /privacy (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /product/page: /product (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /refund/page: /refund (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /register/page: /register (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /reset-password/page: /reset-password (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /robots.txt/route: /robots.txt (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /sitemap.xml/route: /sitemap.xml (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /terms/page: /terms (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/filings (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/company-master (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/analyst-estimates (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/institutional-holdings (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/news (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/advanced/rate-limits (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/advanced/error-handling (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/advanced/pagination-and-query-design (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/support/contact (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/authentication (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/data-freshness-lineage (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
  Generating static pages using 9 workers (136/202) 
Failed to build /docs/[...slug]/page: /docs/api/financial-growth/financials-canonical (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/financial-growth/valuations-canonical (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/market-prices/twse-daily-price (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/taxonomy/index-classification (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/query-tools (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/query-tools/search-api (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/query-tools/query-api (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/query-tools/query-fields (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/query-tools/query-examples (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/api/preview (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
  Generating static pages using 9 workers (151/202) 
✓ Generating static pages using 9 workers (202/202) in 2.3min
Failed to build /docs/[...slug]/page: /docs/coming-soon/derivatives-market (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/[...slug]/page: /docs/coming-soon/supply-chain (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/api/capital-flow/margin-short-enhanced/page: /docs/api/capital-flow/margin-short-enhanced (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/api/company-events/company-profile/page: /docs/api/company-events/company-profile (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/api/company-profiles/page: /docs/api/company-profiles (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/api/institutional-ownership/page: /docs/api/institutional-ownership (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/api/market-prices/price-data/page: /docs/api/market-prices/price-data (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
Failed to build /docs/api/prices/page: /docs/api/prices (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
[dashboard-load] stage=auth/session durationMs=1 ok=false
[dashboard-load] stage=total durationMs=1 ok=false
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /api
├ ƒ /api/account/profile
├ ƒ /api/ai-research/mock-ticker
├ ƒ /api/analytics/track
├ ƒ /api/auth/[...nextauth]
├ ƒ /api/auth/forgot-password
├ ƒ /api/auth/login
├ ƒ /api/auth/logout
├ ƒ /api/auth/password-login
├ ƒ /api/auth/register
├ ƒ /api/auth/resend-verification
├ ƒ /api/auth/reset-password
├ ƒ /api/auth/verify-email
├ ƒ /api/billing/ecpay/cancel
├ ƒ /api/billing/ecpay/checkout
├ ƒ /api/billing/ecpay/credits/create
├ ƒ /api/billing/ecpay/credits/notify
├ ƒ /api/billing/ecpay/notify
├ ƒ /api/billing/ecpay/period-notify
├ ƒ /api/dashboard/api-keys
├ ƒ /api/dashboard/api-keys/[id]
├ ƒ /api/dashboard/api-keys/[id]/secret
├ ƒ /api/dashboard/playground
├ ƒ /api/internal/db-health
├ ƒ /api/market-marquee
├ ○ /apple-icon.png
├ ƒ /billing
├ ƒ /billing/credits
├ ƒ /billing/subscriptions
├ ○ /billing/thank-you
├ ○ /blog
├ ● /blog/[slug]
│ └ /blog/verifiable-tw-market-data-for-ai-agents
├ ○ /contact
├ ƒ /dashboard
├ ○ /dashboard/ai-research
├ ○ /datasets
├ ● /datasets/[slug]
│ ├ /datasets/twse-daily-price
│ ├ /datasets/monthly-revenue
│ ├ /datasets/income-statement
│ └ [+8 more paths]
├ ○ /docs
├ ● /docs/[...slug]
│ ├ /docs/introduction
│ ├ /docs/quick-start
│ ├ /docs/data-access
│ └ [+121 more paths]
├ ○ /docs/api/capital-flow/margin-short-enhanced
├ ○ /docs/api/company-events/company-profile
├ ○ /docs/api/company-profiles
├ ○ /docs/api/institutional-ownership
├ ○ /docs/api/market-prices/price-data
├ ○ /docs/api/prices
├ ○ /docs/api/stock-prices
├ ○ /docs/data-provenance
├ ○ /docs/market-coverage
├ ○ /docs/mcp-server
├ ○ /docs/openapi-spec
├ ○ /docs/tools-mcp
├ ○ /faq
├ ƒ /forgot-password
├ ○ /help
├ ○ /icon.png
├ ƒ /login
├ ○ /pricing
├ ○ /privacy
├ ○ /product
├ ○ /refund
├ ƒ /register
├ ƒ /reset-password
├ ○ /robots.txt
├ ○ /sitemap.xml
├ ○ /terms
├ ƒ /usage
├ ƒ /v2/datasets/[dataset]
└ ƒ /verify-email


ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand: PASS (with known non-blocking static retry warnings)

## Gate

