# API Keys Lifecycle (Dashboard)

## Scope

This document covers the local dashboard API key lifecycle only:

- Create API key
- List API keys
- Revoke API key
- One-time secret reveal

It does **not** enable public API gateway access yet.

## Security Behavior

- API keys are generated in server routes with secure random bytes.
- Stored fields in DB:
  - `keyPrefix`
  - `keyHash`
  - `encryptedSecret` (AES-256-GCM encrypted)
  - metadata (`name`, `status`, timestamps)
- Raw key is **not** stored.
- Raw key is returned only once at creation time.
- After leaving the one-time panel, the secret cannot be retrieved again.
- Revoked keys are marked as `status=revoked` and should be treated as invalid.
- New version keys can be copied again through authenticated server-side decrypt endpoint.

## Environment Variables

- `AUTH_SECRET` (required in production)
- `API_KEY_HASH_SECRET` (recommended explicit hash secret)
- `API_KEY_ENCRYPTION_SECRET` (required for encrypted secret copy workflow)

If `API_KEY_HASH_SECRET` is missing:

- development can fallback to `AUTH_SECRET` (or a dev-only fallback),
- production should provide `API_KEY_HASH_SECRET` or `AUTH_SECRET`.

If `API_KEY_ENCRYPTION_SECRET` is missing:

- production create/copy secret flow returns safe error,
- old hash-only keys can still be listed and revoked.

## Current API Routes

- `GET /api/dashboard/api-keys`
- `POST /api/dashboard/api-keys`
- `DELETE /api/dashboard/api-keys/:id`
- `GET /api/dashboard/api-keys/:id/secret` (authenticated, active key only, `Cache-Control: no-store`)

Auth is required for all routes.

## Public Gateway (Phase 2a)

Gateway beta route (dry-run metering):

- `GET /v2/datasets/:dataset`

Example:

```bash
curl \
  -H "X-API-Key: twmd_live_xxx" \
  "https://twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=5"
```

Current phase behavior:

- API key authentication is required.
- Dataset entitlement is checked by plan policy.
- Request is proxied to backend with internal credentials.
- Metering supports guarded rollout:
  - default: dry-run only (no wallet deduction)
  - when `PUBLIC_API_CREDITS_DEDUCTION_ENABLED=true`: successful 2xx requests can charge credits

Phase 3/4 update:

- Gateway now writes `ApiUsageEvent` as dry-run usage ledger for observability.
- Each request gets a `requestId` for trace/debug.
- Dry-run usage means estimated credits are recorded, but wallet balance is not deducted.
- In deduction-enabled mode, only successful 2xx requests are charged.
- `insufficient_credits` returns HTTP 402 and does not charge wallet.

### Gateway Dry-Run Smoke Test

Set local test env (do not commit real keys):

- `GATEWAY_SMOKE_BASE_URL` (default `http://localhost:3000`)
- `GATEWAY_SMOKE_API_KEY` (a real key created from dashboard)

Run:

```bash
npm run smoke:gateway-dry-run
```

Expected checks:

- valid key + supported dataset returns upstream response
- missing key returns `401 invalid_api_key`
- unsupported dataset returns `404 dataset_not_found`
- malformed key returns `401 invalid_api_key`
- if upstream is temporarily failing, script may report `gateway-auth-ok-upstream-failed` while still confirming gateway auth + headers.

### Usage Ledger Check

Check latest dry-run usage events from local DB:

```bash
npm run check:usage-ledger
```

Optional envs:

- `USAGE_CHECK_USER_EMAIL`
- `USAGE_CHECK_API_KEY_PREFIX`
- `PUBLIC_API_CREDITS_DEDUCTION_ENABLED` (`false` by default)

Notes:

- Script prints sanitized event fields only (`createdAt`, `datasetSlug`, `statusCode`, `creditsCharged`, `requestId`, `errorCode`, `latencyMs`).
- It never prints raw API key or key hash.
- Empty result is allowed and will not fail the script.

### Standardized Error Shape

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key."
  },
  "requestId": "..."
}
```

### Response Headers

- `X-Request-Id`
- `X-TWMD-Plan`
- `X-TWMD-Credits-Cost`
- `X-TWMD-Dry-Run`
- `X-TWMD-Credits-Charged` (when deduction mode is enabled)

Example:

```bash
curl \
  -H "X-API-Key: twmd_live_xxx" \
  "https://twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330"
```

You should see gateway headers including:

- `X-TWMD-Credits-Cost`
- `X-TWMD-Dry-Run`
- `X-Request-Id`

When deduction mode is enabled, response headers will also include:

- `X-TWMD-Credits-Charged`

### Error Codes

- `401 invalid_api_key`
- `403 api_key_revoked`
- `403 plan_not_entitled`
- `402 insufficient_credits`
- `404 dataset_not_found`
- `504 upstream_timeout`
- `502 upstream_error`
- `500 internal_error`

## Notes

- API key lifecycle is local and production-safe (hash-only storage).
- Public gateway is currently skeleton mode with dry-run metering.
- Credits deduction is guarded by env flag:
  - `PUBLIC_API_CREDITS_DEDUCTION_ENABLED=false` (default) => dry-run only
  - `PUBLIC_API_CREDITS_DEDUCTION_ENABLED=true` => successful 2xx responses can charge credits
- Usage logging always writes `ApiUsageEvent`; dry-run mode records estimated cost, deduction mode records charged cost.
- `PUBLIC_API_FREE_TIER_ENABLED` can control whether free-tier API access is allowed in this dry-run phase (default enabled).
- Missing/malformed API key requests may not enter per-user usage ledger because user identity cannot be resolved.
- Run guarded deduction smoke only when explicitly confirmed:
  - `npm run smoke:gateway-deduction-mode`
  - requires `PUBLIC_API_CREDITS_DEDUCTION_ENABLED=true` and `CONFIRM_DEDUCTION_SMOKE=true`.
