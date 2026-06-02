# API Run Playground Compact Refactor

## Goal
讓 API playground modal 在桌面版更接近一屏可讀，減少長距離上下滾動，同時維持中文、低彩度、開發者文件風格。

## What Changed
- 調整 modal 高寬：`h-[min(760px,calc(100vh-64px))]`、`max-w-[1200px]`。
- Header 變成 endpoint bar：`GET + endpoint + title + Run + close`。
- 左欄改為緊湊式結構：
  - 授權區一行化
  - 查詢參數改為 compact grid/table（不再每列獨立大卡片）
- 右欄改為兩塊：
  - 回應範例（status tabs + JSON）
  - 請求範例（cURL）
- CodeBlock 新增 `contentClassName`，供 modal 內限制區塊高度並保留 icon-only copy + highlighting。

## Run Behavior
- Run 只做本地預覽，不發送真實 request。
- 缺必填參數：切到 `400` 範例並顯示提示。
- 必填完整：切回 `200` 範例並顯示已更新提示。

## Security
- API key 僅存在 component state。
- 未使用 localStorage/sessionStorage/cookie。
- 未 console.log API key。

## Validation
- `npm run lint` PASS
- `npm run build` PASS
