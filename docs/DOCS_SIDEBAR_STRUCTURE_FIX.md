# Docs Sidebar Structure Fix

## Scope
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Branch: `main`
- Goal: manually port legacy sidebar taxonomy behavior into current main lineage (no cherry-pick).

## Ported Legacy References
- `c1a9762` (`refactor(docs): reorganize sidebar navigation and icons`)
- `e6a5e54` (`docs: merge FAQ into help center`)
- `de0e3cb` (`docs: move help center to standalone section`)

## Files Changed
- `src/content/docs-sidebar.ts`
- `src/components/docs/docs-page-shell.tsx`

## Applied Sidebar Taxonomy

### OVERVIEW
- 總覽
- 快速開始
- 認證
- 來源政策
- 資料血緣
- API 模型
- Tools / MCP

### APIS
- 市場與價格
  - TWSE 日線價格
  - TPEx 日線價格
  - 還原股價
  - 技術指標
  - 市場指數
  - 市場廣度
  - 利率快照
- 財務與成長
  - 月營收
  - 綜合損益表
  - 資產負債表
  - 現金流量表
  - 財務比率
- 籌碼與資金
  - 三大法人買賣
  - 融資融券
  - 外資持股
  - 借券資料
- 公司與事件
  - 公司主檔 / Security Master
  - 重大訊息
  - 股利與公司行動
  - 注意 / 處置
- 分類與結構
  - 產業分類
  - 題材分類
  - 指數成分
- 策略與量化
  - 特徵資料集
  - AI 研究訊號
  - 回測資料準備
- 查詢與工具
  - Dataset Factory
  - Coverage Registry
  - Release Status
  - Query Examples

### GUIDES
- 查看公司基本面
- 看籌碼
- 看市場狀態
- 快速查資料
- 做策略 / AI

### SDKS
- Release Status
- Python SDK
- JavaScript / TypeScript SDK

### AI AGENTS
- MCP Server Preview
- Tool Manifest
- Agent Workflow Examples

### HELP
- 幫助中心

## Help / FAQ Handling
- Sidebar now keeps only `幫助中心`.
- Removed sidebar entries for `Support` and `常見問題`.
- `FAQ` route/file was not deleted in this task.

## Icon Uniqueness Check (API groups)
Configured group icons in `docsSidebarApiGroups` are unique:
- 市場與價格: `line-chart`
- 財務與成長: `file-spreadsheet`
- 籌碼與資金: `landmark`
- 公司與事件: `building-2`
- 分類與結構: `network`
- 策略與量化: `activity`
- 查詢與工具: `book-open`

No duplicate group icon in APIS section.

## Route Mapping: existing / closest
Most sidebar hrefs map directly to entries in `src/content/docs-pages.ts`.

Closest-route mappings used (no large new docs added):
- `借券資料` -> `/docs/api/capital-flow/margin-short` (closest existing capital-flow route)
- `注意 / 處置` -> `/docs/api/preview/mops-material-events` (closest existing event/notice style route)
- `Coverage Registry` -> `/docs/market-coverage` (existing docs route outside `docs-pages.ts` catalog)
- `幫助中心` -> `/help` (app route; not a `docs-pages.ts` catalog entry)

## Validation
- `npm run lint`: pass
- `npm run build`: started (`prisma generate && next build`), reached `Creating an optimized production build ...`; local run did not return a final success/fail line within this task window.
