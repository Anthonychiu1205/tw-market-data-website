# API Playground Fill Left + Wrap Code

## Scope
- 只調整 API playground modal 視覺密度與可讀性。
- 不改 backend/API 行為，不發真實 request。

## Root Cause
1. 左側空白感主要來自「內容密度不足」與「卡片視覺節奏」，不是缺少參數資料。
2. 右側水平捲動主因：
   - cURL 把 query 全塞在單行 URL。
   - CodeBlock 預設為 `whitespace-pre` + `overflow-x-auto`。

## Implementation
- 在左側 Query 下新增 compact「資料狀態」區塊。
  - 優先從 `api.notes` / `api.responseSummary` 抽取 coverage/freshness/data_gaps/source相關短句。
  - 若無可用內容，採保守 fallback 提示。
- cURL 改為多行：
  - `--url` 只放 endpoint
  - 有參數時改用 `--get` + `--data-urlencode`（每參數一行）
- `CodeBlock` 新增 `wrapLines` prop：
  - modal 內啟用 `whitespace-pre-wrap`、`break-words`、`overflow-x-hidden`
  - 預設行為維持不變，避免影響其他頁面

## Validation
- `npm run lint`：PASS
- `npm run build`：PASS（含既有 static retry warning，不阻擋）
- 安全掃描：未出現 API key persistence/logging

## Outcome
- 左側不再像「缺一塊」的大空白表單。
- 右側 cURL / JSON 在 modal 寬度下可讀性明顯提升，避免水平捲動。
- 仍維持 endpoint-specific parameters 與安全 preview-only Run 流程。
