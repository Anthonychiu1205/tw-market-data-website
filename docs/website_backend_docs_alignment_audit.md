# Website ↔ Backend Docs Alignment Audit

Date: 2026-04-23 (Asia/Taipei)

## Scope & Source of Truth
Compared website docs content against backend runtime/product contracts using:

- Backend contracts: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/public_datasets/*.md`
- Backend runtime routes/contracts: `/Volumes/DEV_USB/Projects/tw-feature-engine/src/feature_engine/read_api/external_data_api_boundary.py`
- Backend registry metadata: `/Volumes/DEV_USB/Projects/tw-feature-engine/src/feature_engine/read_api/registry.py`
- Website docs source: `/Users/ant/Documents/Playground/tw-market-data-website/src/content/docs-pages.ts`

Productized backend dataset contracts currently confirmed in `docs/public_datasets/`:

- `twse_daily_price`
- `tpex_daily_price`
- `monthly_revenue`
- `valuation_data`
- `technical_indicators`
- `income_statement`
- `cash_flow_statement`
- `balance_sheet`
- `institutional_flow`
- `margin_short`

---

## Page-Level Alignment

| page/route | current status | mismatch summary | recommended action |
|---|---|---|---|
| `/docs/api/market-prices/twse-daily-price` | aligned | Endpoint/params/auth/envelope align with runtime (`symbol`, `start_date`, `end_date`, `limit`; `X-API-Key`; `dataset/rows/count` + `meta`) | keep |
| `/docs/api/market-prices/tpex-daily-price` | aligned | Same as TWSE path; contract matches runtime behavior | keep |
| `/docs/api/financial-growth/monthly-revenue` | partially aligned | Page contract itself aligns to `/v2/datasets/monthly-revenue`, but sidebar/topic mapping still points `topicId=monthly_revenue_enhanced` and group metadata endpoint `/v2/datasets/monthly-revenue-enhanced` | rewrite |
| `/docs/api/financial-growth/valuation-data` | aligned | Route/params/envelope match productized backend route | keep |
| `/docs/api/market-prices/technical-indicators` | aligned | Route/params/envelope match productized backend route | keep |
| `/docs/api/financial-growth/income-statement` | aligned | Matches productized route and endpoint-style contract | keep |
| `/docs/api/financial-growth/cash-flow-statement` | aligned | Matches productized route and endpoint-style contract | keep |
| `/docs/api/financial-growth/financial-statements` | partially aligned | Concept page exists, but not a direct endpoint contract; no direct coverage for balance sheet endpoint on website side | rewrite |
| `/docs/api/financial-growth/balance-sheet` | stale/legacy (missing) | Backend productized route `/v2/datasets/balance-sheet` exists, but no corresponding endpoint-style website page entry in current taxonomy | replace with productized page |
| `/docs/api/capital-flow/institutional-flow` | partially aligned | Route exists and backend is productized, but page is still generic/fallback style (not full endpoint-style parity level of core productized pages) | rewrite |
| `/docs/api/capital-flow/margin-short-enhanced` | stale/legacy | Website highlights enhanced route; backend productized public contract is `/v2/datasets/margin-short` | replace with productized page |
| `/docs/api/capital-flow/chip-flows` | partially aligned | Runtime route exists, but not in backend `docs/public_datasets/` productized contract set; currently presented as product-like | rewrite |
| `/docs/api/market-prices/price-data` | stale/legacy | Uses `/v2/datasets/price-enhanced` generic/enhanced surface; not part of current productized contract set | replace with productized page |
| `/docs/api/market-prices/index-data` | partially aligned | Runtime route exists and docs reflect canonical-style envelope, but not in backend productized contract set | rewrite |
| `/docs/api/market-prices/market-breadth` | partially aligned | Same pattern as index-data: runtime exists, not in productized contract set | rewrite |
| `/docs/api/market-prices/interest-rate` | stale/legacy | Sidebar entry exists, but lacks endpoint-style parity and is not in current productized contract set | rewrite |
| `/docs/api/prices` | stale/legacy | Old generic API page (`price-enhanced`) coexists with new endpoint-style pages; risks user confusion | remove |
| `/docs/api/financial-metrics` | stale/legacy | Old base API page (legacy lineage) still present in content source and can conflict with current taxonomy route | remove |
| `/docs/api/analyst-estimates` | stale/legacy | Legacy `/v1/*` surface in docs source, not aligned with current productized backend routes | remove |
| `/docs/api/earnings` | stale/legacy | Legacy `/v1/*` surface; not part of current productized dataset list | remove |

---

## Focus Area Findings

### 市場與價格
- **Aligned**: TWSE/TPEx 日線價格。
- **Partially aligned**: 指數資料、市場廣度（runtime 存在但非目前 productized contract 集合）。
- **Stale/legacy**: 股價資料（price-enhanced）、舊 `/docs/api/prices` generic 頁。

### 財務與成長
- **Aligned**: 月營收、估值資料、損益表、現金流量表（頁面契約）。
- **Partially aligned**: 月營收在 sidebar metadata 仍殘留 enhanced topic 對應；財報資料父頁未完整承接 balance-sheet productized contract。
- **Stale/legacy**: 缺少 balance-sheet 對應網站 endpoint-style 頁；舊 financial-metrics/`/v1` 型頁面仍在內容源。

### 籌碼與資金
- **Partially aligned**: institutional-flow（需補 endpoint-style parity）。
- **Stale/legacy**: margin-short-enhanced 被當主要入口，但 backend productized route 已是 `/v2/datasets/margin-short`。
- **Partially aligned**: chip-flows 目前呈現接近產品頁，但 backend 尚未納入 productized public contract docs 集。

---

## Recommended Next Actions (ordered)

1. **Replace `margin-short-enhanced` docs entry with `margin-short` productized entry** (highest user-facing contract risk in 籌碼主線)。
2. **Add/restore website endpoint-style page for `/v2/datasets/balance-sheet`** to complete existing backend productized financial statements set。
3. **Normalize monthly revenue sidebar/topic mapping** from `monthly_revenue_enhanced` metadata to `monthly_revenue` to avoid contract ambiguity。
4. Remove legacy generic pages (`/docs/api/prices`, `/docs/api/financial-metrics`, `/docs/api/analyst-estimates`, `/docs/api/earnings`) from active docs content source.
5. Keep index-data/market-breadth/chip-flows clearly marked as non-productized/canonical-supplemental until backend productized contracts are added.

---

## Single Recommended Next Update Target

**`/docs/api/capital-flow/margin-short-enhanced` → replace with `/v2/datasets/margin-short` productized contract page**.

Reason: backend has already productized `margin_short` with contract doc/runtime/auth/entitlement/limits, while website still leads users to enhanced legacy surface in a core "籌碼與資金" path.
