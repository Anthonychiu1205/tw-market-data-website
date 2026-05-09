# Public API Rollback Guide

## 1) Disable credits deduction immediately

Set:

- `PUBLIC_API_CREDITS_DEDUCTION_ENABLED=false`
- `PUBLIC_API_CREDITS_DEDUCTION_PRODUCTION_CONFIRM=false`

Then redeploy website.

## 2) Stop backend proxy path quickly

If backend instability is causing user impact, unset or disable:

- `BACKEND_API_BASE_URL`

Expected behavior: gateway requests fail fast with upstream-related errors rather than hanging.

## 3) Pause public API access

Options:

- Vercel env toggle + redeploy to disable effective access path
- temporary middleware maintenance response for `/v2/*`
- short maintenance announcement in docs/dashboard

## 4) Revoke compromised customer API keys

- Use dashboard key revoke flow for individual keys
- If broad compromise suspected, bulk revoke by DB operation in controlled maintenance window
- Require users to re-issue keys

## 5) Rotate API key encryption secret (`API_KEY_ENCRYPTION_SECRET`)

Important:

- rotating encryption secret may make existing encrypted key copies undecryptable
- keyHash-based auth remains valid (hash path does not use encryption secret)
- recommended rotation runbook:
  1. announce maintenance window
  2. rotate secret
  3. mark old keys as copy-unavailable
  4. ask users to re-issue keys for copy convenience

## 6) Rollback Render backend deployment

- Use Render dashboard to rollback to last healthy deployment
- Verify `/healthz` then run dataset smoke
- Confirm website gateway smoke recovers

## 7) Incident communication checklist

- include time window
- impacted routes (`/v2/datasets/*`, dashboard usage/credits if relevant)
- affected error signatures (`502`, `504`, entitlement errors)
- mitigation applied and ETA
