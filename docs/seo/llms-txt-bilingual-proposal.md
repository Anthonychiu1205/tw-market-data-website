# /llms.txt 雙語站點導覽 — 提案 + 歸屬說明 (AEO-01 §1.2)

## 稽核結論 (現狀)

| 項目 | 現狀 | 判定 |
|---|---|---|
| `/llms.txt` 存在 | ✅ 200 for all AI UAs | 通過 |
| `/llms-full.txt` 存在 | ✅ 200 for all AI UAs | 通過 |
| 自動生成、禁手維護 | ✅ 由 `tw-feature-engine` 產線生成 | **已符合「禁手維護」** |
| 格式 | ⚠️ Dataset Factory 機讀索引（37 dataset ids + schema/coverage） | 非 llmstxt.org 站點導覽格式 |
| 中英雙語人類可讀導覽 | ❌ 缺（做什麼 / docs 入口 / 定價 / MCP 端點 / 五檔免 key） | **待補** |

## 為何不在本 repo 直接改 `public/llms.txt`

`scripts/check-dataset-factory-docs-sync.mjs` 強制斷言：

```js
assert(llms === sourceLlms, "public/llms.txt is not synced to feature-engine generated llms.txt");
assert(llmsFull === sourceLlmsFull, ...);
```

來源 = `/Volumes/DEV_USB/Projects/tw-feature-engine/docs/generated/llms.txt`。
→ 網站端的 `public/llms.txt` 必須與產線輸出**逐字元相同**。若在網站端手改，此 gate 立刻紅燈，且下次 sync 會覆蓋。

**結論**：站點導覽 + 雙語升級屬產線 (`tw-feature-engine`) 的 llms 生成器職責，不在本 SEO worktree 動手（避免破壞 sync gate、避免重工）。本檔為**待老闆核可後路由給資料引擎 owner** 的提案初稿。

> ⚠️ `tw-feature-engine` 可能在分析凍結區；此提案**不自行改動該 repo**，僅供老闆決策：(a) 由產線加入下列導覽區塊，或 (b) 將 `/llms.txt` 站點導覽的 ownership 移回網站（產線索引改置 `/llms-datasets.txt` 之類路徑）。

---

## 提案：`/llms.txt` 頂部加入雙語站點導覽區塊（產線生成器實作）

> 置於現有 Dataset Factory 索引「之前」，以標準 llmstxt.org 風格開頭；機讀索引原樣保留於其後。C-6：純真實導覽，無對 AI 下指令的文案。

```markdown
# TW Market Data — Taiwan Stock Market Data API

> TWSE-first Taiwan stock market data API. Daily prices, MOPS monthly revenue,
> financial statements, three-major-institutional-investor flows, valuations and
> technical indicators. Every response carries source lineage and preserves disclosed
> data_gaps rather than inferring missing values. Not investment advice.
>
> 台股資料 API（TWSE-first）。日線價格、MOPS 月營收、財報三表、三大法人籌碼、估值與技術指標。
> 每筆回應附來源 lineage 並保留揭露的 data_gaps、不以推測值補洞。非投資建議。

## Docs
- [Introduction / 介紹](https://twmarketdata.com/docs/introduction)
- [Quick start / 快速開始](https://twmarketdata.com/docs/quick-start)
- [Authentication / 認證](https://twmarketdata.com/docs/authentication)
- [Data provenance & lineage / 資料來源與血緣](https://twmarketdata.com/docs/data-provenance)
- [Market coverage / 市場覆蓋](https://twmarketdata.com/docs/market-coverage)

## Datasets / 資料集
- [Dataset catalog / 資料集總覽](https://twmarketdata.com/datasets)
- [TWSE daily price / 日線價格](https://twmarketdata.com/datasets/twse-daily-price)
- [Monthly revenue / 月營收](https://twmarketdata.com/datasets/monthly-revenue)
- [Institutional flow / 三大法人](https://twmarketdata.com/datasets/institutional-flow)

## Tools / 工具
- [MCP server & tools / MCP 端點](https://twmarketdata.com/docs/tools-mcp)
- [OpenAPI spec](https://twmarketdata.com/openapi.json)
- [Full docs (single file) / 全文件單檔](https://twmarketdata.com/llms-full.txt)

## Pricing / 定價
- [Plans / 方案](https://twmarketdata.com/pricing) — Free / Starter / Pro / Max / Developer (USD monthly)

## Policy
- not_investment_advice=true
- preserve_data_gaps_and_unknowns
- no full-market / survivorship claims beyond disclosed coverage
```

（其後接原有 `allowed_dataset_ids:` / `datasets:` / `links:` 機讀索引，維持不變。）

## `/llms-full.txt`
已符合「docs 全文件單檔、自動生成、禁手維護」的規格意圖，維持產線生成。若要中英雙份，同樣於產線加開 `en` 段落，勿手維護。
