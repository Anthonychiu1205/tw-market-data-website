# Public API Launch Checklist

## Environment

- [ ] `AUTH_SECRET`
- [ ] `API_KEY_HASH_SECRET`
- [ ] `API_KEY_ENCRYPTION_SECRET`
- [ ] `BACKEND_API_BASE_URL`
- [ ] `BACKEND_API_TOKEN`
- [ ] `BACKEND_FETCH_TIMEOUT_MS` (dashboard; recommended `2500`)
- [ ] `PUBLIC_API_UPSTREAM_TIMEOUT_MS` (gateway; recommended `8000`)
- [ ] `PUBLIC_API_CREDITS_DEDUCTION_ENABLED` (`false` by default)
- [ ] `PUBLIC_API_CREDITS_DEDUCTION_PRODUCTION_CONFIRM` (`false` by default)

## Backend (Render)

- [ ] `/healthz` returns 200
- [ ] `/health` returns 200
- [ ] dataset smoke on backend direct call (internal key)
- [ ] entitlement smoke (`x-api-key` / plan mapping)
- [ ] DB connection stable (no repeated SSL closed unexpectedly)
- [ ] Neon pooling settings verified

## Gateway (Website /v2)

- [ ] valid-key smoke (`/v2/datasets/twse-daily-price`)
- [ ] invalid-key smoke (`401 invalid_api_key`)
- [ ] unsupported dataset (`404 dataset_not_found`)
- [ ] upstream timeout handling (`504 upstream_timeout`)
- [ ] request tracing header exists (`X-Request-Id`)
- [ ] gateway headers exist (`X-TWMD-*`)

## Billing / Credits

- [ ] wallet exists or auto-created for test account
- [ ] deduction is disabled by default in production
- [ ] seed wallet flow works (`npm run seed:test-wallet`)
- [ ] reconciliation helper returns expected summary
- [ ] integrity check passes (`npm run check:wallet-integrity`)

## Dashboard

- [ ] API key create / copy / revoke works
- [ ] usage page shows request rows + requestId
- [ ] credits page shows wallet + transaction filter
- [ ] reconciliation section visible and sane
- [ ] dashboard loading performance acceptable (no long blank/skeleton stalls)

## Security

- [ ] no raw API keys in logs
- [ ] no DB URL in logs
- [ ] no backend token exposure in response/log
- [ ] revoked key returns `403 api_key_revoked`
- [ ] `encryptedSecret` workflow works for new keys
- [ ] legacy keys without `encryptedSecret` handled safely (copy disabled)

## Pre-launch Command Set

```bash
npm run lint
npm run build
npm run check:ecpay-checkmac
npm run smoke:gateway-dry-run
npm run check:wallet-integrity
```

If env is missing for smoke/integrity, scripts should print `SKIPPED` and exit 0.
