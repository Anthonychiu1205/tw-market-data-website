# PRICING-SSOT-01 — Execution Sequencing (gated; nothing fires early)

Two pieces of work are queued behind explicit triggers. Recorded here so the order is durable and no
customer-facing change ships before its gate clears.

## The controlling gate for everything below
**Owner signs off the canonical ladder** (the four decisions in `CANONICAL_LADDER_PROPOSAL.md`).
Until then, tiers are undecided, so neither the backend matrix nor the securities-lending pricing has a
correct value to converge on. Do not hand-edit `requiredPlan` in the meantime — that just re-creates the
second source of truth we are trying to delete.

---

## Item 1 — website consumes the backend's exported tier matrix (+ CI parity gate)

**Goal:** `requiredPlan` stops being hand-maintained in `dataset-policies.ts`; it is read from a matrix the
backend exports from the ladder-aligned SSOT. `creditsCost` stays website-owned (costs are website-only).
A CI check fails the build when the two disagree.

**Trigger (all must hold):**
1. Owner ladder signed off.
2. Backend produces a **canonical tier matrix export** — a committed, machine-readable artifact
   (slug → requiredPlan) generated from `PRICING_SPEC_V1.md` §3a + the per-dataset table, not hand-typed.
   This is the `pricing_spec_contract.py` work on the backend side.

**Then, website side:**
- Replace the literal `requiredPlan` per entry with a lookup into the imported matrix (single source).
- Keep `creditsCost` literal per entry.
- Add a CI step (wire into `build`, next to the existing CJK guards) that loads both the exported matrix
  and `dataset-policies.ts` and **fails on any slug whose `requiredPlan` disagrees**, and on any slug
  present in one but not the other. This is the anti-drift guard the audit found missing (today nothing
  compares the two).

**Customer-facing price changes** (e.g. the confirmed adjusted-prices→starter, securities-lending→starter,
index-constituents→free) ride this change as the diff of switching to the matrix — **they ship only after
the owner approves that diff**, never as a silent edit.

**Do NOT:** build the consumer before the export exists (there is nothing to consume); change any
`requiredPlan` by hand.

---

## Item 2 — securities-lending labels flip to live

**Goal:** when the dataset is actually reachable, present it truthfully as available + verified + correctly
priced.

**Interim (in effect now):** honest "not yet open".
- `site.ts readiness: "preview"` — **DONE** (PR #110). Stops it rendering as verified/release-grade/available
  while the route 404s.
- `grade: "verified"` left as-is (data is backend n6-green; the grade is a data-maturity class, not an
  availability claim; the v5 docs page already shows a TODO).
- pricing `pro / 2cr` left as-is (a customer-facing price change → gated on owner per Item 1).

**Trigger:** the backend flips `securities_lending` route to production (same one-line
`production_ready: True` pattern as institutional_flow, tw-feature-engine PR — but securities-lending's
`final_gate` is a bespoke token, so it needs the four-field governance edit + owner-accepted token, not a
single bool), **and** that deploy lands so the route no longer 404s.

**Then, together, one PR:**
- `site.ts readiness: "preview" → "available_now"`.
- `requiredPlan` → `starter` — but via the Item 1 matrix, not a hand-edit (securities-lending is starter in
  the ladder, §3-backed).
- Confirm the v5 docs page now captures a real response (re-run the capture script — it will 200 once the
  route is live), replacing its TODO.

**Timing coordination with the backend flip:** the website label change must land **after** the backend
deploy, never before — flipping the site to "available_now" while the route still 404s re-introduces the
exact falsehood PR #110 removed.

---

## Cross-reference
- `CANONICAL_LADDER_PROPOSAL.md` — the four decisions gating everything here.
- `TICKET_DEPLOY-INTEGRITY-ENTITLEMENTS.md` — even after the ladder + matrix, production won't reflect it
  until the entitlement DB is re-seeded; that re-seed is the same launch step.
