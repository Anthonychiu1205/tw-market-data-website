# TW Market Data Domain Deployment Checklist

## Domain
- twmarketdata.com
- www.twmarketdata.com

## Vercel Domain Setup
- Add twmarketdata.com to Vercel Project Domains
- Add www.twmarketdata.com
- Set primary domain to twmarketdata.com
- Redirect www to apex domain if desired

## Namecheap DNS
建議 DNS：

A Record:
Host: @
Value: 76.76.21.21
TTL: Automatic

CNAME:
Host: www
Value: cname.vercel-dns.com
TTL: Automatic

備註：若 Vercel 顯示不同 DNS value，以 Vercel 顯示為準。

## Required Vercel Env
- NEXT_PUBLIC_SITE_URL=https://twmarketdata.com
- AUTH_SECRET=<at least 32 chars>
- BACKEND_API_BASE_URL
- BACKEND_API_TOKEN or BACKEND_API_KEY / BACKEND_BEARER_TOKEN / STAGING_BACKEND_API_TOKEN
- CRON_SECRET or MARKET_MARQUEE_REFRESH_SECRET

## Post Deploy Smoke Test
測試以下 URL：
- https://twmarketdata.com
- https://twmarketdata.com/pricing
- https://twmarketdata.com/docs
- https://twmarketdata.com/docs/quick-start
- https://twmarketdata.com/api
- https://twmarketdata.com/blog
- https://twmarketdata.com/login
- https://twmarketdata.com/sitemap.xml
- https://twmarketdata.com/robots.txt
- https://twmarketdata.com/llms.txt
- https://twmarketdata.com/llms-full.txt
- https://twmarketdata.com/api/market-marquee

## OAuth Next Step
Google OAuth requires:
- Authorized JavaScript origin:
  https://twmarketdata.com
- Authorized redirect URI:
  https://twmarketdata.com/api/auth/google/callback
  or the actual callback path implemented by the project

Apple Sign In requires:
- verified HTTPS domain
- Service ID
- return URL
- domain association file if needed
