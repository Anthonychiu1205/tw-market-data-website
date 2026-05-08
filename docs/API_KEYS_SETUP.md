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
  - metadata (`name`, `status`, timestamps)
- Raw key is **not** stored.
- Raw key is returned only once at creation time.
- After leaving the one-time panel, the secret cannot be retrieved again.
- Revoked keys are marked as `status=revoked` and should be treated as invalid.

## Environment Variables

- `AUTH_SECRET` (required in production)
- `API_KEY_HASH_SECRET` (recommended explicit hash secret)

If `API_KEY_HASH_SECRET` is missing:

- development can fallback to `AUTH_SECRET` (or a dev-only fallback),
- production should provide `API_KEY_HASH_SECRET` or `AUTH_SECRET`.

## Current API Routes

- `GET /api/dashboard/api-keys`
- `POST /api/dashboard/api-keys`
- `DELETE /api/dashboard/api-keys/:id`

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
- Metering is dry-run only (no credit deduction, no usage ledger write).

Phase 3 update:

- Gateway now writes `ApiUsageEvent` as dry-run usage ledger for observability.
- Each request gets a `requestId` for trace/debug.
- Dry-run usage means estimated credits are recorded, but wallet balance is not deducted.

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

### Error Codes

- `401 invalid_api_key`
- `403 api_key_revoked`
- `403 plan_not_entitled`
- `404 dataset_not_found`
- `504 upstream_timeout`
- `502 upstream_error`
- `500 internal_error`

## Notes

- API key lifecycle is local and production-safe (hash-only storage).
- Public gateway is currently skeleton mode with dry-run metering.
- Credits deduction is not enabled in this phase.
- Usage logging is dry-run only and does not perform wallet deduction.
- `PUBLIC_API_FREE_TIER_ENABLED` can control whether free-tier API access is allowed in this dry-run phase (default enabled).
- Missing/malformed API key requests may not enter per-user usage ledger because user identity cannot be resolved.
- Phase 4 is where credits deduction will be implemented.
