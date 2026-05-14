# AI Research Dashboard Handoff / QA

## 1. Executive Summary

- AI Research 目前定位為 TW Market Data dashboard 內的 Pro+ premium feature。
- 目前不是獨立產品，也不是獨立訂閱。
- 目前不改 pricing table（deferred）。
- 目前不做 production API integration。
- 目前可透過 local mock 與 local-only proxy 進行開發驗證。

## 2. Current Completed Scope

- `/dashboard/ai-research` route 已完成。
- dashboard sidebar AI Research 入口已完成。
- interactive local mock 已完成（ticker/date 可操作）。
- response-like local mock object 已完成。
- response-to-view-model adapter 已完成。
- Market Data Analyst 可顯示 `mock_real` 狀態。
- local-only internal proxy 已完成：`POST /api/ai-research/mock-ticker`。
- proxy fallback 行為已完成（回退本地 deterministic mock）。
- proxy mode UX source status 已完成。
- local mock entitlement selector（Free/Developer/Pro/Team/Enterprise）已完成。
- safety disclaimer 已完成。
- 無 production billing/auth/credits integration。

## 3. How to Run Locally

```bash
cd /Volumes/DEV_USB/Projects/tw-market-data-website
npm run dev
```

登入測試帳號：

- email: `dev@twmarketdata.local`
- password: `DevTest123456!`

開啟：

- `http://localhost:3001/dashboard/ai-research`

說明：

- 未登入導向 `/login` 屬正常 dashboard auth guard 行為。

## 4. How to Run With tw-ai Mock Proxy

先啟動 tw-ai mock server（read-only repo，不可改 code）：

```bash
cd /Volumes/DEV_USB/Projects/tw-ai-investment-research
PYTHONPATH=src /tmp/tw-ai-ir-py311/bin/python -m uvicorn \
  tw_ai_investment_research.api.research_firm_app:app \
  --host 127.0.0.1 \
  --port 8010
```

再啟動 website（開啟 proxy flags）：

```bash
cd /Volumes/DEV_USB/Projects/tw-market-data-website
AI_RESEARCH_MOCK_PROXY_ENABLED=true \
AI_RESEARCH_MOCK_API_BASE_URL=http://127.0.0.1:8010 \
NEXT_PUBLIC_AI_RESEARCH_MOCK_PROXY_ENABLED=true \
npm run dev
```

Dashboard 來源狀態會顯示：

- 本地 mock
- tw-ai mock proxy
- proxy 不可用，已切回本地 mock

## 5. Current Safety Boundaries

- research-only
- simulation-only
- not investment advice
- no broker execution
- no live trading
- no guaranteed return
- user final decision required
- local mock / proxy only
- no production backend integration

## 6. Current Plan Entitlement Mock

- Free: blocked
- Developer: mock preview
- Pro: basic
- Team: full
- Enterprise: custom

說明：

- 目前為 local mock entitlement UI。
- 尚未接真 subscription / billing / credits。
- pricing table 暫緩，不在本輪修改。

## 7. Pricing Table Status

- Pricing table update is deferred.
- AI Research rows should not be added yet.
- Current public pricing remains unchanged.
- Future pricing table updates require a separate gate.

## 8. Known Limitations

- Dashboard 尚未做 production API integration。
- Pro+ entitlement 尚未接真實 plan。
- credits 仍為 dry-run。
- tw-ai 回應目前仍為 mock。
- Market Data Analyst 為 mock-real fixture。
- 其他 analysts 仍是 placeholder/missing。
- no live DB / no live provider。
- no LLM。
- no broker。

## 9. Recommended Next Steps

- W4-J:
  - dashboard visual QA / product polish（如需）
- W4-K:
  - production integration gate（僅在 backend/auth/entitlement 決策完成後）
- W4-L:
  - pricing table update gate（後續另開，現階段 deferred）

目前不建議直接改 pricing table。

### W4-J Progress Note

- W4-J 已完成 availability summary display：
  - dashboard 會顯示 `availability.market_price` 的 `readiness / agent_action` 與 coverage 指標。
  - 可直接解釋為何結果為 fallback / skip / no_action。
- 目前 availability 仍屬 mock/local integration 範圍：
  - local deterministic mock
  - tw-ai mock API proxy（dev-only）
- 無 production integration、無 billing/auth/credits/DB 變更。

### W4-K Progress Note

- W4-K 已完成 Technical Analyst dashboard rendering：
  - `research.analysts` 中 `technical` 不再固定 placeholder，可顯示 mock-real。
  - local deterministic mock 與 tw-ai proxy response 都可映射同一 technical row。
- ticker 行為摘要：
  - `2330/2454/2308/3008/3030`：technical 通常為 mock-real
  - `2317`：較保守 fallback / lower confidence
  - `UNKNOWN`：technical missing / unavailable
  - `TPEX:*`：保留 `tpex_historical_depth_deferred` 缺口
- technical 僅屬 deterministic fixture/mock，不代表 production 技術訊號。

## 10. Explicit Non-Goals

- no pricing table change
- no billing implementation
- no credits implementation
- no auth entitlement implementation
- no DB migration
- no production API integration
- no investment advice
- no broker
- no deploy
