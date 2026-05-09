# Public API Monitoring & Operations Checklist

## Cadence

- Render health checks: every 1 minute
- Gateway smoke (`smoke:gateway-dry-run`): every 15–30 minutes
- Wallet integrity (`check:wallet-integrity`): daily
- Usage reconciliation review: daily
- CSV usage export (`export:usage-csv`): optional daily/weekly audit

## Core monitors

### Render backend

- `/healthz` availability
- p95/p99 latency for key datasets
- DB connection errors (`OperationalError`, SSL closed unexpectedly)

### Gateway

- status code distribution (`2xx`, `4xx`, `5xx`)
- `502 upstream_error` spike alerts
- `504 upstream_timeout` spike alerts
- request volume and requestId traceability

### Credits and usage

- negative wallet balance count
- mismatch count in reconciliation
- orphan usage events
- orphan usage transactions
- duplicate requestId usage transactions

## What to do when alerts trigger

### 502 spikes

1. check backend health and logs
2. verify `BACKEND_API_BASE_URL` reachability
3. confirm backend auth header path still valid
4. if persistent, temporarily reduce traffic and rollback backend release

### 504 spikes

1. verify Render cold starts / DB latency
2. increase `PUBLIC_API_UPSTREAM_TIMEOUT_MS` cautiously if needed
3. validate backend query performance and Neon pool behavior

### Negative wallet detected

1. run `check:wallet-integrity`
2. inspect affected user transaction timeline
3. freeze deduction mode if widespread
4. apply manual adjustment transaction after root cause confirmed

### Duplicate requestId usage transactions

1. verify idempotency guard path (`usage:<requestId>`)
2. inspect retries and race conditions
3. patch before enabling broad deduction rollout

### Orphan usage events

1. classify dry-run or failed requests first (expected in some cases)
2. isolate true mismatch with charged credits but missing usage transaction
3. run reconciliation helper and backfill policy if needed

### Neon outage / DB incident

1. switch to protective mode (keep deduction disabled)
2. preserve gateway error clarity with requestId
3. monitor DB recovery before resuming normal ops

### Render cold starts

1. observe first-hit latency trends
2. tune upstream timeout separately from dashboard timeout
3. consider paid instance/always-on if sustained user impact

## Weekly operational review

- top datasets usage trend
- error code trend (401/403/402/502/504)
- reconciliation health trend
- key revoke/reissue activity
- pending launch blockers for enabling real deduction
