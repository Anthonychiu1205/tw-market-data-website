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

## Notes

- This phase only establishes key lifecycle and secure storage.
- Public customer API gateway (`X-API-Key` auth, entitlement, metering, deduction) is planned in later phases.

