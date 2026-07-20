# Canonical Plan Ladder — Proposal for Owner Sign-off

**PRICING-SSOT-01.** Purpose: one owner decision that fixes website↔backend tier drift before launch.
Authority order used here: **§3a family table = authoritative** (it declares itself *"entitlement gate 的單一真相"*), **§3 prose = secondary** (disambiguates), **backend enforcement = reference** (what actually runs today).

Status of the three sources today: website 39/64 aligned with backend; §3 and §3a contradict each other on three families; and the backend's `pro` tier is doubling as a silent fallback default. Nothing recommended below is applied yet.

---

## Part 1 — Recommended ladder

§3a's own model: **pro / max / developer / enterprise all receive every dataset**; the family→tier table only sets *"the lowest tier at which this family first appears."* So the **data-access** ladder is really three rungs (free / starter / pro-and-up), and max / developer / enterprise differentiate on **quota, rate, keys, support — not data** (numbers from the website `plans.ts`, already consistent with §1 of the spec).

| tier | $/mo | recommended DATA access (per §3a) | differentiator above pro |
|---|---|---|---|
| **free** | 0 | Reference + alignment only: `time_alignment`, `company_profile`, `classification`, `index_constituents`. **+ daily OHLCV** once ENTITLE-02 lands (see gap note). Non-commercial. | — |
| **starter** | 20 | free **+** `prices`, `market_breadth`, **+** the "paid-first-tier" items §3 names explicitly: adjusted-prices, margin/short balance, securities-lending, institutional-flow (合計), industry-index. Commercial use allowed. 1-yr history. | — |
| **pro** | 100 | **All remaining datasets**: fundamentals (3 statements, metrics, valuation, dividends, revenue), full chip-deep, events, technical-indicators, interest-rate, convertible-bonds, index-data. 5-yr history. | product tier — "most popular" |
| **max** | 200 | Same data as pro **+** `derivatives_market` (TAIFEX futures/options, settlement, OI). Full history. | +quota, +rpm, exclusive derivatives |
| **developer** | 2,000 | Same as max **+** international cross-asset per §3 (US treasury yields, US indices, FX, commodities+VIX, FRED, SEC). 20 keys, RPM 12k, 3M/mo, webhook. | **⚠ positioning undefined in §3a — see Decision (a)** |
| **enterprise** | custom | Everything **+** `macro` (full) **+** `documents` (raw filings, transcripts, announcements full-text). Custom SLA, dedicated. | raw docs + macro + SLA |

**Recommended slug fixes that are NOT open questions** (spec §3 explicit, confirmed revenue leaks — safe to apply the moment you approve the ladder):

| slug | website now | → recommended | why |
|---|---|---|---|
| `adjusted-prices` | free | **starter** | §3:46 explicit: *"還原因子表…正確性從付費第一階就給"* — currently leaking |
| `securities-lending` | pro | **starter** | §3:47 lists 借券 under starter — currently overcharging |
| `index-constituents` | starter | **free** | §3:41 + §3a free family `index_constituents` — currently overcharging |

---

## Part 2 — Four decisions only you can make

### (a) — What IS the `developer` tier? 🔴 highest-stakes
The authoritative §3a table has **no developer row** (it defers: *"國際跨資產已含在 derivatives_market/macro 對映"*). So the single source of truth does not define it — every system invented its own:

| | says developer is… |
|---|---|
| Website `plans.ts` / `PLAN_LEVEL` | rank **4** — *above* pro & max. **$2,000/mo.** "all datasets, full history, webhook" |
| Backend `plan_entitlement_model` | rank 4, commercial-use allowed (in source) — but **production blocks this key as non-commercial** (unresolved; being traced) |
| Backend error copy | a tier that should **"upgrade to Pro"** — i.e. treats it as *below* pro (leftover from the old ladder where developer was rank-1 cheapest-paid) |
| §3 prose | the international-cross-asset tier (US/FX/FRED/SEC) |

**Options:** (i) keep it rank-4 = "pro + international data + high quota + webhook" (matches website price, my recommendation in Part 1); (ii) demote to a cheap non-commercial dev/test tier (matches the error copy + the name's plain meaning) — but then the $2,000 price is wrong; (iii) rename/retire it. **This decision unblocks: the error-message bug fix, the "all datasets" copy, and the entitlement grant path.**

### (b) — §3 vs §3a contradict each other on three families
The canonical document disagrees with itself. §3a is authoritative, so my recommendation follows §3a, but each has a real product consequence:

| family | §3a (authoritative) | §3 (prose) | recommended | consequence to confirm |
|---|---|---|---|---|
| `interest_rate` | **pro** | max | **pro** | interest-rate-snapshot drops from max→pro |
| `convertible_bonds` | **pro** | max | **pro** | but the MCP id `convertible_bond` is max via one path, pro via REST — same data, two prices, must unify |
| `macro` | **enterprise** (whole family) | Taiwan=max, intl=developer | **split, not enterprise** | §3a would make Taiwan CPI/景氣 enterprise-only — likely too steep. I recommend overriding §3a here toward §3's split. **Your call.** |

### (c) — 40 datasets are `pro` by accident, not decision
The backend defaults any unmapped slug to `pro`. That silently sets the tier for **~30 slugs nobody classified** + creates **10 "undercharges"** that may not be undercharges at all — they might be intended as free reference data.

My recommendation, for you to confirm in one pass:

- **→ free** (metadata / reference, no market values): `fund-etf-metadata`, `warrants-reference`, `broker-branch-reference`, `bond-convertible-reference`, `theme-taxonomy`, `stock-delisting-lifecycle`, `stock-split-par-value-events`, `market-snapshot`*, `market-overview-snapshots`
- **→ stays pro** (real derived/analytic data): `esg-tesg`, `screener`, `etf-flow`, `etf-holdings`, `margin-short-enhanced`, `corporate-actions*`, `stock-price-limit-daily`, `valuation-core-daily`, `day-trading-suspension`
- **→ higher, spec-backed**: `interest-rate-snapshot` free→pro, `macro-global` starter→developer (§3)

\* `market-snapshot` has **no backend route** — resolve under Decision (c) or drop it (see blocker list).

### (d) — `price-enhanced` direction
Website starter / backend free / **spec silent**. It is "enhanced price fields" (derived beyond raw OHLCV). By the same logic §3 applies to adjusted-prices (*"正確性從付費第一階就給"*), a derived-price product fits **starter**. Recommendation: **starter** (i.e. website is already right; make the backend match). But because the spec is silent, this is your call, not a lookup.

---

## Part 3 — What each decision unblocks (so nothing is done prematurely)

- **(a) developer** → unblocks the error-copy bug fix (wrong "upgrade to Pro" + wrong price quoted) and the `plans.ts` "all datasets" claim.
- **(a)+(entitlement trace)** → the owner-gated grant command for a full-entitlement capture key (in progress).
- **All four** → then, and only then: `pricing_spec_contract.py` parses §3a as the authority, the website consumes an exported matrix, and a CI check fails on any drift. Building that before the ladder is fixed would just harden the wrong numbers.

## Separate top blocker (not a tier question) — verify with the live key
**8 sold slugs return 403 `family_not_entitled` for *every* plan including enterprise** — their endpoints declare families absent from the allowlist: `taifex-options-settlement-price`, `convertible-bonds`, `derivatives-market`, `options-daily-taifex`, `macro-global`, `macro-worldbank`, `taifex-institutional-flow`, `tax-business-registration`. This is sold-but-unreachable inventory. It is inferred from static code reading; **must be confirmed against a full-entitlement key**, then patched by adding the missing families to the allowlist.
