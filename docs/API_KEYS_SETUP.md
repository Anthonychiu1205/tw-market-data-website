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

## Notes

- API key lifecycle is local and production-safe (hash-only storage).
- Public gateway is currently skeleton mode with dry-run metering.
- Credits deduction and usage DB logging are not enabled in this phase.
