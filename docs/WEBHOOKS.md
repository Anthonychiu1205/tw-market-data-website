# Webhooks (Phase A) — TW Market Data

Push notifications for data events. When a data change happens that you could also *pull* from
`/freshness`, we *push* the same frozen payload to your HTTPS endpoint — **push == pull, no double
truth**. Delivery is signed with [Standard Webhooks](https://www.standardwebhooks.com/), retried with
backoff, and guarded against SSRF.

> Phase A ships three events over signed HTTPS push. `discord` / `slack` / `email` transports and the
> MCP subscription transport are later phases; the **event definitions here are frozen** and will not
> change when the transport does (`schema_ver` versioning, below).

## Delivery semantics — at-least-once, NOT ordered

- **At-least-once.** The same event may arrive more than once (a retry, a redeploy mid-flight).
  **Dedupe on `webhook-id`** (it equals the event's stable `id`). Do not assume exactly-once.
- **Not ordered.** Events are not guaranteed to arrive in `occurred_at` order. If you need ordering,
  sort by `occurred_at` on your side.
- Cross-check anytime against `/freshness` — the pushed `data_as_of` / badge is read from the *same*
  state the pull endpoints expose.

## The request

`POST` to your destination URL, `Content-Type: application/json`. Headers (Standard Webhooks):

| header | meaning |
|---|---|
| `webhook-id` | the event's stable id — **dedupe on this** |
| `webhook-timestamp` | unix seconds; a 5-minute tolerance is enforced by the verifier |
| `webhook-signature` | `v1,<base64 HMAC-SHA256>` over `{id}.{timestamp}.{body}` |

Body envelope (routing metadata read straight off the event, plus the frozen payload under `data`):

```json
{
  "id": "3f2b0c9e-…",
  "type": "revenue.announced",
  "occurred_at": "2026-07-10T09:00:00Z",
  "dataset": "monthly-revenue",
  "symbol": "2330",
  "schema_ver": 1,
  "data": { "…frozen event payload, verbatim…": true }
}
```

## Verifying the signature — use the official library, never hand-roll

Signatures are standard HMAC-SHA256 per Standard Webhooks. Use the official verifier so a tampered
body, a wrong secret, or a stale timestamp is rejected for you. Runnable samples:

- Node: [`examples/webhooks/verify_signature.mjs`](../examples/webhooks/verify_signature.mjs) — `npm i standardwebhooks`
- Python: [`examples/webhooks/verify_signature.py`](../examples/webhooks/verify_signature.py) — `pip install standardwebhooks`

```js
import { Webhook } from "standardwebhooks";
const wh = new Webhook(process.env.WEBHOOK_SIGNING_SECRET); // whsec_…
const event = wh.verify(rawRequestBody, {
  "webhook-id": req.headers["webhook-id"],
  "webhook-timestamp": req.headers["webhook-timestamp"],
  "webhook-signature": req.headers["webhook-signature"],
}); // throws on any mismatch
```

Pass the **raw** request body (bytes as received) — re-serializing changes the signed bytes.

## The three events (schema_ver = 1)

All payloads carry `schema_ver: 1` and `not_investment_advice: true`. These structures are frozen.

### `revenue.announced` — a monthly-revenue disclosure

```json
{
  "schema_ver": 1,
  "symbol": "2330",
  "revenue_month": "2026-06",
  "revenue": 331109,
  "unit": { "currency": "TWD", "scale": "thousand_twd" },
  "data_as_of": "2026-07-10",
  "not_investment_advice": true
}
```
`data_as_of` is exactly what `/freshness` reports for monthly revenue.

### `filing.announced` — a financial-statement disclosure

```json
{
  "schema_ver": 1,
  "symbol": "2330",
  "statement": "income",
  "fiscal_period": "2026-Q1",
  "report_date": "2026-05-15",
  "data_as_of": "2026-05-15",
  "not_investment_advice": true
}
```
`statement` is one of `income` | `balance` | `cash_flow`.

### `catalog.dataset_listed` — a dataset becomes publicly listed

```json
{
  "schema_ver": 1,
  "dataset": "derivatives-market",
  "exposure_status": "public_sellable",
  "reconciliation_badge": "green",
  "not_investment_advice": true
}
```
`reconciliation_badge` is the same badge the customer sees. This event has no `symbol`, so it only
matches subscriptions with no symbol filter.

## Retries, backoff, auto-disable

- Failed deliveries (non-2xx, timeout, connection error, **a redirect**) are retried with **exponential
  backoff + jitter**, up to **8 attempts within 24 hours**.
- After the budget is exhausted the destination is **disabled** and the account owner is **emailed**.
  Re-enable it in the dashboard once your endpoint is healthy.
- Every attempt is recorded per-row (status code, latency, attempt number, error).

## Destination rules (SSRF — enforced on create AND on every send)

- **HTTPS only.** No `http`, no other scheme.
- The host must resolve to **public** IPs only. Private/loopback/link-local/CGNAT ranges and the cloud
  **metadata** address (`169.254.169.254` / `fd00:ec2::254`) are rejected — IPv4 and IPv6, including
  IPv4-mapped / 6to4 / NAT64 embeddings.
- **Redirects are never followed** — a `3xx` is a hard delivery failure (a classic SSRF pivot).
- Default port only; no URL credentials; payload size is capped.

## Signing secret — reveal & rotate

Each destination has a `whsec_…` signing secret. It is stored **encrypted at rest** (the same
key-reveal chain as API keys), shown in full **once** at creation, and otherwise only through the
throttled reveal endpoint. **Rotate** it anytime — the new secret is returned once and the old one
stops signing immediately.

## `schema_ver` — versioning from day one

Every event carries `schema_ver` (starts at 1, never goes backward). Any change to a payload's
structure bumps `schema_ver` with a coexistence period, so your integration keeps working and the
event definition stays frozen even when the transport later changes (HTTPS push → MCP subscription).
