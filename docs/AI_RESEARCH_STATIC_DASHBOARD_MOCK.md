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
