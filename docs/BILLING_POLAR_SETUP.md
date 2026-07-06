# Billing — Polar setup (website)

The website charges through **Polar** (Merchant of Record). Payments moved off ECPay
in the Phase 1 migration; there is no ECPay code, route, or env left in this repo.

## Architecture (single source of truth = Polar)

- `/pricing` and `/billing` open an **inline embedded checkout** (`@polar-sh/checkout`
  `PolarEmbedCheckout`) — the user never leaves the site.
- A server action creates a Polar **Checkout Session** (`@polar-sh/sdk`
  `checkouts.create`) with `embedOrigin`, `externalCustomerId` (= NextAuth `user.id`),
  `customerEmail`, and `metadata.plan_id` (the tier key), and returns `checkout.url`.
- **Provisioning is NOT done by the website.** The read API service (`tw-feature-engine`)
  owns the Polar webhook: it writes `read_api_subscriptions` and issues API keys in the
  shared Neon DB. The website only *reads* subscription/plan status (via the backend
  adapter) for display and gateway entitlement.
- Subscription management (cancel / invoices / history) uses the Polar **Customer
  Portal** (`@polar-sh/nextjs` `CustomerPortal`).

## Plan ↔ Polar product mapping

Tier keys match the read API canonical ladder
(`free / starter / pro / max / developer / enterprise`). Paid tiers map to the four
Polar subscription products (monthly, USD):

| Tier      | Price   | Env var                       |
| --------- | ------- | ----------------------------- |
| starter   | $20/mo  | `POLAR_PRODUCT_ID_STARTER`    |
| pro       | $100/mo | `POLAR_PRODUCT_ID_PRO`        |
| max       | $200/mo | `POLAR_PRODUCT_ID_MAX`        |
| developer | $2000/mo| `POLAR_PRODUCT_ID_DEVELOPER` |

`free` and `enterprise` (contact sales) have no Polar product.

The Polar **Product** must carry `metadata.plan_id = <tier key>` so the webhook resolves
the plan; the checkout also sends `metadata.plan_id` as a fallback.

## Environment variables

Secrets are set in the deployment environment (Vercel) — never committed, never logged.

- `POLAR_ACCESS_TOKEN` — website-scoped organization access token. Minimal scopes:
  `checkouts:write`, `customers:read` (`events:write` reserved for Phase 2 metering).
- `POLAR_API_BASE` — unset for production (`https://api.polar.sh`); set the sandbox base
  (`https://sandbox-api.polar.sh`) only for testing.
- `NEXT_PUBLIC_SITE_URL` — also used as the Polar `embed_origin`.
- `POLAR_PRODUCT_ID_STARTER` / `_PRO` / `_MAX` / `_DEVELOPER` — the four product ids.

## Phase 2 (not in this migration)

Usage metering moves to Polar **Meters** (Events Ingestion API) and replaces the local
credit wallet. Tracked separately.
