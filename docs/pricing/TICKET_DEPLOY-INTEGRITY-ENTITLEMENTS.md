# DEPLOY-INTEGRITY-ENTITLEMENTS — 🔴 launch-blocker

**Opened:** 2026-07-21 · **Status:** OPEN · **Repo of fix:** `tw-feature-engine` (backend) · **Depends on:** PRICING-SSOT-01 ladder sign-off

## Summary
The entitlement gate resolves a plan's rights from **DB tables**, not from source. Those tables are seeded **once** and are **never re-seeded on deploy**, so the production DB has silently drifted from the source code. Plans whose rows are stale are **mis-entitled** — a paying account can be granted less (or more) than the code says it should have.

## Evidence
- The gate reads `read_api_plan_catalog` + `read_api_plan_entitlements` at request time (`external_data_api_boundary.py`, `_check_dataset_entitlement` → `commercial_use_allowed` computed from `ent_map`/`plan` DB rows, not from the `PLAN_DEFINITIONS` source dict).
- Seeding runs only via `upsert_plan_entitlement_model()`, and the code says so explicitly:
  > `external_data_api_boundary.py:14774` — *"upsert_plan_entitlement_model() only runs in a validation helper, **not in the app factory, so we cannot assume prod has it**."*
- **Proven live drift:** a real `sk_live_` key whose account plan is `developer` gets `403 commercial_use_not_allowed` in production, even though source `PLAN_DEFINITIONS["developer"].commercial_use_allowed == True` (identical on working tree and `origin/main`). The DB row still carries the *old* `False`. Discovered while trying to obtain a docs-capture key (DOCS-CAPTURE-01 / #108).

## Blast radius
Any of the six plans could be stale in either direction. `developer` is confirmed stale-restrictive (under-entitled). The reverse — a stale row granting more than intended — is equally possible and is a **revenue / access-control** risk, not just a capture inconvenience. This compounds PRICING-SSOT-01: even after the ladder is agreed and the source is fixed, production will not reflect it until the DB is re-seeded.

## Fix (execute AFTER the ladder is signed off — re-seeding now would bake in the wrong values)
1. Re-seed the catalog + entitlements from the corrected source:
   `scripts/run_plan_entitlement_model_export.py --seed-db` (needs prod `DATABASE_URL`).
2. Add a **deploy-time seed + reconcile step** so the DB can never again drift from source: on deploy, re-run the seed and assert `read_api_plan_catalog`/`read_api_plan_entitlements` match `PLAN_DEFINITIONS` (fail the deploy on mismatch). This is the root-cause fix — item 1 alone repeats the same one-shot seeding that caused the drift.
3. Fold into the same reconcile the PRICING-SSOT-01 contract (spec §3a as authority) so tier drift and seed drift are caught by one gate.

## Interim (does not need the ladder)
To unblock the owner's existing key for DOCS-CAPTURE-01 without a full re-seed: grant the account `enterprise` via the owner-gated admin endpoint, then **verify** the enterprise DB row is not itself stale by testing the key against a paid dataset. If that test 403s, the enterprise row is stale too and the re-seed cannot be deferred. (Minimal-path invocation prepared for the owner separately; not committed.)

## Do NOT
- Re-seed production before the ladder is final.
- Run the full `provision_personal_pro_read_api_key.py` (it re-seeds everything) while the ladder is undecided.
