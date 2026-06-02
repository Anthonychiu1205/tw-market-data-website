# API Playground Icons + Left Hierarchy Refine

## Goal
強化 API playground modal 的語言選單辨識度與左側參數資訊層級，不新增功能、不改 backend。

## Changes
- 語言選單從文字縮寫改為「icon + label」：
  - Trigger：icon + 語言名 + chevron
  - Menu：每個語言都有 icon + label + selected check
- 左側 Authorization / Query row 視覺層級調整：
  - 參數名稱更明確
  - type/badge 轉為輔助資訊
  - description 可讀性提高
  - input 欄位對齊並維持一致
- 確認 modal 內沒有資料狀態區塊。
- response card header 維持狀態標籤與 tabs 內聚。

## Safety
- Query 仍來自 `apiReference.queryParameters`
- 不發真實 request
- API key 僅存在 React state
- 無 local/session/cookie persistence

## Validation
- `npm run lint` PASS
- `npm run build` PASS
