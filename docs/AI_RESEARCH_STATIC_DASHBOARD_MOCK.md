# AI Research Static Dashboard Mock

## Summary

- Added static mock route: `/dashboard/ai-research`
- Scope is UI-only mock for Pro+ feature exploration.
- No backend/API integration is included in this phase.
- Visual style is aligned to existing TW Market Data dashboard language:
  - clean
  - minimal
  - low-chroma
  - professional SaaS workspace

## What Was Added

- New page:
  - `app/dashboard/ai-research/page.tsx`
- New mock UI component:
  - `src/components/dashboard/ai-research-static-mock-page.tsx`
- Dashboard nav entry:
  - `src/content/dashboard.ts`
  - `src/components/dashboard/dashboard-sidebar.tsx`

## Visual QA / Polish Notes

- Reduced card fragmentation by consolidating most content into one primary workspace panel with section dividers.
- Avoided nested cards and excessive border density.
- Kept grayscale-first chart and status presentation for dashboard consistency.
- Improved Analyst Overview readability with compact status badges and spacing.
- Kept risk/simulation/disclaimer copy explicit and audit-oriented.

## Static Mock Boundary

- No tw-ai backend call.
- No API proxy route.
- No server action.
- No production fetch/API request.
- No billing change.
- No credits deduction logic.
- No auth entitlement wiring.
- No DB read/write/migration.

## Pro+ Design Intent

- Position AI Research as Pro / Team / Enterprise dashboard bonus feature.
- Keep Developer as mock-preview concept.
- Keep Free as upgrade-only for this feature.
- Preserve research-only and simulation-only product boundary.

## Safety Copy Included in Mock

- Simulation only
- Not investment advice
- No broker execution
- User final decision required
- Data gaps and warnings are shown explicitly

## Future Integration Steps

1. Connect route to entitlement-aware session/plan gate.
2. Integrate mock response path from internal AI Research API boundary.
3. Add usage/credits dry-run display for AI Research runs.
4. Keep simulation-only constraints until separate broker/live gates are approved.

## Localization And Layout Update

- 完成繁體中文 UI 文案調整，保留少量必要英文術語（如 AI Research、Pro+、Replay fingerprint）。
- 修正 Research Flow Timeline 內部 overflow / scrollbar，改為可換行的 grid 佈局並移除橫向捲動依賴。
- 優化 Analyst Overview 欄位換行與欄寬比例，降低中文內容截斷。
- 仍為 static mock，無 API / billing / auth / credits / DB 整合。

## Timeline Dot And Overflow Refinement

- 移除研究流程節點標題前的小圓點，釋放節點文字空間並降低不必要換行。
- 修正流程區塊文字換行與 overflow，避免節點狀態出現不自然斷行與內部 scrollbar。
- 仍為 static mock。
- 無 API / auth / billing / credits / DB 整合。

## W4-B Response Adapter Refactor

- 本輪已將 dashboard static data 改為 tw-ai response-like local mock object：
  - `src/components/dashboard/ai-research-mock-response.ts`
- 新增純函式 adapter：
  - `mapAiResearchResponseToViewModel(response)`
- `/dashboard/ai-research` 元件改為使用 response → view model 映射資料，不再在 UI 檔案散落硬編資料。
- 仍未接 API / proxy / server action。
- 市場資料分析師顯示為 `mock-real`，其餘分析師維持 `placeholder` / `missing`。
- 無 billing / auth / credits / DB 變更。

## W4-C Interactive Static Mock Sprint

- 本輪新增本地互動式 static mock：
  - 可輸入股票代號與研究日期，點擊「執行研究」後更新畫面。
- ticker/date controls 只會更新 local deterministic mock response。
- 無 API call、無 proxy、無 server action。
- Market Data Analyst 會依 ticker 顯示不同 mock-real 摘要；其餘分析師維持 placeholder/missing。
- 仍維持 research-only / simulation-only / not investment advice 邊界。
- 無 billing / auth / credits / DB 整合。

## W4-D Local Proxy Gate Note

- W4-D 已新增 local mock API proxy gate 文件：`docs/AI_RESEARCH_LOCAL_MOCK_API_PROXY_GATE.md`。
- 目前 dashboard 仍使用本地 deterministic mock response。
- 尚未實作 proxy / fetch。

## W4-E Local-only Proxy Integration

- 新增 website internal route：`POST /api/ai-research/mock-ticker`（local/dev guard）。
- `/dashboard/ai-research` 在 proxy flag 開啟時可嘗試呼叫 internal route。
- proxy 不可用時自動回退本地 deterministic mock，不影響頁面可用性。
- 仍不做 production proxy，不做 auth/billing/credits/DB 整合。

## W4-G Proxy Mode UX Polish

- 新增「資料來源狀態」小型 badge + 說明文字：
  - 本地 mock
  - tw-ai mock proxy
  - proxy 不可用，已切回本地 mock
- 按下「執行研究」時提供克制的執行中回饋（按鈕顯示 `執行中...`）。
- fallback 不再以錯誤樣式呈現，而是平穩回退提示，維持 dashboard 專業感。
- 不顯示 backend URL / secrets，不新增 debug 面板。
- 仍為 local/dev mock 邊界，無 auth/credits/billing/DB 變更。

## W4-H Entitlement Mock UI Gate

- 新增本地 mock entitlement UI，可在頁面中切換方案預覽：
  - Free
  - Developer
  - Pro
  - Team
  - Enterprise
- entitlement 僅為前端本地常數，不讀取真 subscription / billing / auth plan。
- Free 方案會停用「執行研究」按鈕並顯示升級提示。
- Developer 方案顯示 preview-only 與非商業使用提示。
- Pro / Team / Enterprise 顯示對應模式與配額文案（UI mock，無 quota enforcement）。
- 仍為 local mock 邊界，無 auth/credits/billing/DB 變更。

## W4-J Availability Summary Display

- dashboard 已可顯示 `availability.market_price` 摘要（資料覆蓋狀態）。
- 可在畫面上看到：
  - `readiness / agent_action`
  - `rows_in_range`
  - coverage window
  - OHLC / volume / duplicate 指標
  - data_gaps / warnings 摘要
- availability 值可來自：
  - local deterministic mock response
  - tw-ai mock API proxy response（若已啟用 proxy）
- 此狀態用於說明資料覆蓋與 fallback 原因，不構成投資建議。
- 仍無 production integration，且無 billing/auth/credits/DB 變更。

## W4-K Technical Analyst Mock-Real Display

- dashboard 現在會渲染 `technical` analyst（若回應包含）並顯示 `mock-real` 狀態。
- local deterministic mock response 針對核心 ticker（如 `2330/2454/2308/3008/3030`）提供 technical mock-real 輸出。
- `2317` 走較保守 technical fallback 內容；`UNKNOWN` 為 missing/unavailable；`TPEX:*` 會帶 `tpex_historical_depth_deferred` 缺口。
- `availability.market_price` 與 technical row 會一起呈現，方便解釋 fallback/no_action。
- technical 輸出仍為 deterministic fixture/mock，不代表 production 技術訊號。
- 無 production integration，且無 billing/auth/credits/DB 變更。
