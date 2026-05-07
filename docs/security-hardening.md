# Security Hardening Notes

## Required Production Env
- `NEXT_PUBLIC_SITE_URL`
- `AUTH_SECRET` (at least 32 chars)
- `BACKEND_API_BASE_URL`
- `BACKEND_API_TOKEN` (or equivalent backend auth env)
- `MARKET_MARQUEE_REFRESH_SECRET` or `CRON_SECRET`

## Security Headers
The site sets baseline headers via `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `X-DNS-Prefetch-Control: on`
- `Content-Security-Policy` (production-focused baseline)

Note: current CSP keeps `unsafe-inline` and `unsafe-eval` for Next runtime/hydration compatibility. Tightening should be done in a controlled follow-up.

## Demo Credentials Policy
- Demo credentials are never rendered in production login HTML.
- Demo credentials may be shown only in local development mode.

## Market Marquee Refresh Policy
- Public `GET /api/market-marquee` returns summary snapshot fields only.
- Refresh triggers (`GET ?refresh=1` and `POST`) require refresh secret.
- Refresh responses are minimized and do not return raw payloads or backend token data.

## Contact
- `avenra.platform@gmail.com`
