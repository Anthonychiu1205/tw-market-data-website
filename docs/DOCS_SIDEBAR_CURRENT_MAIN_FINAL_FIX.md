# Docs Sidebar Current Main Final Fix

## 舊 item 殘留來源
- `Support` 殘留於 `src/content/docs-pages.ts` 的 legacy sidebar exports（`docsSidebarOverviewItems` 舊資料）。
- `常見問題` 殘留於 `src/content/docs-pages.ts` 的 FAQ docs page metadata（`navLabel/title`），不是 sidebar 的實際資料源，但會造成維護混淆。

## 實際 sidebar render source
- 實際 sidebar component：`src/components/docs/docs-page-shell.tsx`
- 實際讀取的 sidebar object/array：
  - `docsSidebarOverviewItems`
  - `docsSidebarApiGroups`
  - `docsSidebarGuideItems`
  - `docsSidebarSdkItems`
  - `docsSidebarAiAgentItems`
  - `docsSidebarHelpItems`
- 上述目前由 `src/content/docs-sidebar.ts` 匯入並渲染。

## 本輪修改檔案
- `src/content/docs-sidebar.ts`
- `src/content/docs-pages.ts`
- `docs/DOCS_SIDEBAR_CURRENT_MAIN_FINAL_FIX.md`

## 最終 sidebar 結構
- OVERVIEW：總覽 / 快速開始 / 認證 / 來源政策 / 資料血緣 / API 模型 / Tools / MCP
- APIS：
  - 市場與價格（TWSE 日線價格、TPEx 日線價格、還原股價、技術指標、市場指數、市場廣度、利率快照）
  - 財務與成長（月營收、綜合損益表、資產負債表、現金流量表、財務比率）
  - 籌碼與資金（三大法人買賣、融資融券、外資持股、借券資料）
  - 公司與事件（公司主檔 / Security Master、重大訊息、股利與公司行動、注意 / 處置）
  - 分類與結構（產業分類、題材分類、指數成分）
  - 策略與量化（特徵資料集、AI 研究訊號、回測資料準備）
  - 查詢與工具（Dataset Factory、Coverage Registry、Release Status、Query Examples）
- GUIDES：查看公司基本面 / 看籌碼 / 看市場狀態 / 快速查資料 / 做策略 / AI
- SDKS：Release Status / Python SDK / JavaScript / TypeScript SDK
- AI AGENTS：MCP Server Preview / Tool Manifest / Agent Workflow Examples
- HELP：幫助中心

## 移除確認
- Sidebar 已移除 `Support`
- Sidebar 已移除 `常見問題`
- `幫助中心` 僅保留在 HELP 區塊下
- `/faq` route 與 FAQ 檔案未刪除（仍可保留 redirect 流程）

## 幫助中心 href
- HELP -> 幫助中心：`/help-center`

## icon 唯一性
- API group icon 使用：
  - 市場與價格 `line-chart`
  - 財務與成長 `file-spreadsheet`
  - 籌碼與資金 `landmark`
  - 公司與事件 `building-2`
  - 分類與結構 `network`
  - 策略與量化 `activity`
  - 查詢與工具 `search-code`
- 同層 API groups 無重複 icon。

## Missing / placeholder notes
- 個別 href 若對應 preview/placeholder docs page，沿用既有 route，不新增大型內容。

## Validation
- `npm run lint`
- `NEXT_TELEMETRY_DISABLED=1 npm run build`
