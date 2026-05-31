# Homepage Daily Market Data And Metrics

## Scope
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Task: add homepage server-side market data adapter and conservative credibility metrics.
- Constraints honored: no backend change, no deploy, no push, no secrets output.

## Files Changed
- `app/page.tsx`
- `src/components/home/hero-market-intel.tsx`
- `src/components/home/market-marquee.tsx`
- `src/lib/homepage/homepage-market-data.ts` (new)

## Homepage Sections Updated
- Infrastructure 4-card block now includes lightweight metrics line per card (no layout redesign).
- Hero right panel `市場指標` now reads from server adapter.
- Ticker marquee now reads from server adapter.

## Backend Endpoint Mapping
Adapter probes (server-side only):
- `/v2/datasets/market-index?index_code=TWSE_TAIEX&market=TWSE&latest=true&limit=1&include_data_gaps=true`
- `/v2/datasets/institutional-flow-market-aggregate?market=TWSE&latest=true&limit=1`

Environment base URL resolution (in order):
- `TW_FEATURE_ENGINE_API_BASE`
- `FEATURE_ENGINE_API_BASE_URL`
- `NEXT_PUBLIC_FEATURE_ENGINE_API_BASE_URL`
- `BACKEND_API_BASE_URL`
- `NEXT_PUBLIC_BACKEND_API_BASE_URL`
- `API_BASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`

Optional header key envs:
- `TW_FEATURE_ENGINE_API_KEY`
- `BACKEND_API_TOKEN`
- `BACKEND_API_KEY`

## Live / Fallback Behavior
- `sourceMode` contract: `live_api | fallback_static | unavailable`.
- Homepage never crashes if backend is unavailable.
- Timeout guard: `4500ms`.
- On API miss/failure, adapter returns conservative fallback rows with explicit status labels:
  - `每日更新 · fallback demo（非完整 live 指標）`
  - `每日更新 · fallback demo（非完整 live 跑馬）`
- If only TAIEX is live, status explicitly marks partial live coverage.

## Revalidate Cadence
- Server fetch uses Next revalidate: `86400` seconds (daily).
- No client polling added.

## Added Metrics And Evidence
- `1,080 檔主檔（TWSE）`
  - Evidence: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/P1_SECURITY_MASTER_TWSE_OFFICIAL_CONTROLLED_WRITE_20260530T172524Z.md`
- `11,870 列籌碼 closeout`
  - Evidence: `/Volumes/DEV_USB/Projects/tw-feature-engine/src/feature_engine/read_api/registry.py`
- `37,196 筆月營收`
  - Evidence: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/llms-full.txt`
- `12,268 / 12,689 / 12,685 財報列`
  - Evidence: `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/research/P1_FUNDAMENTALS_CORE_DAILY_READINESS_AND_AI_ALIGNMENT_20260531T164229Z.md`

## No-Overclaim Notes
- No claim of full-market, adjusted price completion, survivorship-safe, or investment advice.
- Fallback data is explicitly labeled as display/demo.

## Validation
- `npm run lint`: PASS
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: PASS
