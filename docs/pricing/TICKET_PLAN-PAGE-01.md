# PLAN-PAGE-01 — retire / rename the `developer` plan

**Opened:** 2026-07-21 · **Status:** OPEN — ticket only, do not implement yet · **Owner gate:** brand copy

## Decision (already made)
PRICING-RETIER-V2 collapses the ladder to **5 rungs**: `free / starter / pro / max / enterprise`.
`developer` is removed as a distinct rung; the backend now **aliases `developer` → `starter`**.

## Why this is a ticket, not part of #111
#111 syncs per-dataset `requiredPlan` (none require `developer`, so the guard is green). The `developer`
**plan** itself is a separate, brand-facing product surface. Retiring/renaming it changes copy, prices,
Polar products and quota limits — the owner will define the brand copy later, so **no work happens now**.

## What still references `developer` on the website (scope for the eventual change)
- `src/lib/billing/plans.ts`: `PlanCode` union; `BILLING_PLANS.developer` ($2,000/mo, 20 keys, RPM 12,000,
  3,000,000/mo); `PRICING_PLAN_ORDER`; `BILLING_SUBSCRIPTION_PLAN_ORDER`; `PAID_PLAN_CODES`; tier_limits
  (`developer: { monthlyRequestQuota: 3_000_000, rateLimitPerMin: 12_000 }`).
- `src/lib/gateway/dataset-policies.ts`: `GatewayPlanCode` union includes `"developer"`; `PLAN_LEVEL.developer = 4`.
- Env / Polar: `POLAR_PRODUCT_ID_DEVELOPER` — a live Polar product to delist or rename.
- Pricing page + any plan-comparison copy that renders the developer column.

## ⚠️ Reconciliation risk to resolve BEFORE delisting (not just cosmetic)
The website and backend now disagree on what `developer` *means*:
- Website `PLAN_LEVEL.developer = 4` — treated as **above** pro(2) and max(3).
- Backend alias `developer → starter` — treated as **rank 1**.

If any customer currently holds a `developer` subscription, the website billing gateway would grant them
**rank-4** access while the backend grants **starter**. That is an entitlement inconsistency, not just a
label. **Pre-work step:** enumerate existing `developer` subscribers in Polar/billing first; if any exist,
migrate them (to starter, per the alias, or whatever the owner rules) so nobody's plan silently breaks or
over-grants when the rung is removed.

## Options for the owner (brand copy)
1. **Remove entirely** — drop the column; existing developer subscribers migrate to starter (the alias).
2. **Rename** the $2,000 rung to a new premium name (if a premium tier is still wanted above max).
3. **Fold** into enterprise.

## Do NOT (until this ticket is picked up)
- Edit `plans.ts` / `PLAN_LEVEL` / `GatewayPlanCode` for `developer`.
- Delist or rename the Polar product.
- Change the pricing page developer copy.

## Cross-reference
- See #111 (PRICING-RETIER-V2 dataset sync) and the backend matrix
  `PRICING_RETIER_V2_MATRIX.json` (5-rung ladder, developer absent).
