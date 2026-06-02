# API Playground Layout Rhythm and Code Wrap

## Summary
本輪只調整 API playground modal 的閱讀節奏與程式碼呈現，不改 API 行為。

## What Changed
- 左側查詢參數區由「表格感」改成「API 參數參考列」：
  - 移除 `參數 / 值` 表頭
  - 參數名稱字級提升、型別與必填狀態視覺層級更清楚
  - description 可讀性提升，input 尺寸一致
- 左側維持資料狀態區塊，避免空白感且不新增假參數。
- 右側請求/回應卡片維持 compact 高度，modal 內 code 以 wrap 為主。
- CodeBlock token 再降飽和：JSON key/string/number/boolean/cURL token 顏色更克制。

## Safety
- Query params 仍由 `apiReference.queryParameters` 驅動。
- 不發真實 request，不儲存 API key，不寫入 local/session/cookie，不做 console log。
- 未觸及 backend/auth/billing/database/API route 行為。

## Validation
- `npm run lint` PASS
- `npm run build` PASS（含既有 Next dynamic warnings，不影響通過）
