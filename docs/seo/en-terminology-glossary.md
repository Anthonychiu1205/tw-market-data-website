# TW Market Data — 英譯術語表 (EN Terminology Glossary)

**用途**：管制所有中→英內容（docs / 首頁 / datasets / blog / answer-shaped pages）的術語一致性。
**紀律 (SEO-01 §3 / AEO-01)**：禁機器翻譯直出——任何英文內容先過此表，缺詞先補表再譯。金融術語錯一個，開發者信任歸零。

> 狀態：v0.1 初版種子表。新詞由譯者補入，PR 內審。 `x-default = en`。

---

## 1. 品牌 / 產品 (Brand & Product — 固定不譯 / do-not-translate)

| 中文 | English (canonical) | 備註 |
|---|---|---|
| TW Market Data | **TW Market Data** | 品牌名，永不翻譯、不加冠詞變形 |
| 台股資料 API | **Taiwan stock market data API** | 錢詞 (money phrase)；title 用 `Taiwan Stock Market Data API` |
| 投研終端 | **research terminal** | 產品線；避免 "investment terminal" |
| 資料集 | **dataset** | 一律小寫，schema.org `Dataset` 型別大寫 |
| 資料集總覽 / 目錄 | **dataset catalog** | 非 "dataset list" |

## 2. 交易所 / 來源機構 (Exchanges & Sources — 用官方英文名)

| 中文 | English (canonical) | 禁用 (do NOT use) |
|---|---|---|
| 台灣證券交易所 / 上市 | **TWSE** (Taiwan Stock Exchange) | "Taiwan Stock Market" 泛稱時可，機構名須 TWSE |
| 櫃買 / 上櫃 | **TPEx** (Taipei Exchange) | ~~OTC~~（TPEx 才精確） |
| 公開資訊觀測站 | **MOPS** (Market Observation Post System) | 不自創全名縮寫 |
| 期交所 | **TAIFEX** (Taiwan Futures Exchange) | |
| 官方 / 第一手來源 | **first-party / official source** | 不用 "primary source"（歧義） |

## 3. 資料集名稱 (Dataset Names — 對齊 API route / docs)

| 中文 | English (canonical) | route 對照 |
|---|---|---|
| 日線價格 | **daily price** (OHLCV) | `twse-daily-price` |
| 月營收 | **monthly revenue** | `monthly-revenue` |
| 財報三表 | **financial statements** (income statement, balance sheet, cash flow) | — |
| 損益表 | **income statement** | `income-statement` |
| 資產負債表 | **balance sheet** | `balance-sheet` |
| 現金流量表 | **cash flow statement** | `cash-flow-statement` |
| 三大法人 | **three major institutional investors** | 首次全稱，之後 "institutional investors / institutional flow" |
| 法人買賣超 | **institutional net buy/sell (flow)** | `institutional-flow` |
| 融資融券 | **margin trading & short selling** | `margin-short` |
| 借券 | **securities lending** | `securities-lending` |
| 技術指標 | **technical indicators** | `technical-indicators` |
| 估值資料 | **valuation data** (PER/PBR/dividend yield) | `valuation-data` |
| 市場廣度 | **market breadth** | `market-breadth` |
| 已下市股票 | **delisted stocks** | `stock-delisting-lifecycle` |

## 4. 誠實 / 資料品質術語 (Data-honesty terms — TWMD 核心差異化，務必精準)

| 中文 | English (canonical) | 備註 |
|---|---|---|
| 覆蓋範圍 / 覆蓋窗 | **coverage / coverage window** | |
| 對帳 / 抽樣對帳 | **reconciliation / sampled reconciliation** | 不用 "checking" |
| 資料缺口 | **data gaps** (`data_gaps`) | 保留欄位名原樣 |
| 保留缺口、不以推測值補洞 | **preserve gaps; never infer missing values** | AEO 事實句核心措辭 |
| 來源血緣 / lineage | **source lineage** | 保留 `lineage` 原字 |
| 反存活者偏差 | **survivorship-bias-free** | 錢詞；連字號固定 |
| 資料新鮮度 | **freshness** | |
| 可驗證 | **verifiable** | 全文一致；TWMD 核心賣點,勿用 "checkable/validatable" |
| 還原價 | **adjusted price** | 除權息還原;`price_adjustment_factor` |
| 現況快照（僅當期） | **current snapshot only** | 對應 `no_historical_completeness` 警告 |
| 不宣稱全市場 | **no full-market claim** | 誠實邊界，須保留 |
| 已驗證基線 | **verified baseline** | "TWSE-first verified baseline" |
| 非投資建議 | **not investment advice** | 免責固定句 |

## 5. 技術 / 開發者術語 (Developer terms)

| 中文 | English (canonical) | 備註 |
|---|---|---|
| 端點 | **endpoint** | |
| 金鑰 / API 金鑰 | **API key** | |
| 配額 / 額度 | **quota** | |
| 速率限制 | **rate limit** (RPM = requests per minute) | |
| 回測 | **backtesting** | |
| 五檔免 key 試玩 | **5 symbols free, no API key required** | 行銷固定句，對齊 BENCH-01 |
| 方案 | **plan** | 非 "package" |
| 訂閱制 | **subscription** | |

---

## 譯風規則 (Style rules)

1. **Title 錢詞優先**：EN 頁 `<title>` 打 `Taiwan Stock Market Data API | TWSE, Financials, Institutional Flow` 這類詞組。
2. **主詞明確**：句子以 "TW Market Data ..." 開頭利於 AI 引用（AEO 1.3）。
3. **誠實邊界不可省**：中文有的限制揭露（TPEx deferred、current snapshot only），英文必須同步保留，不得為行銷語氣刪除。
4. **數字不 drift**：勿把會變動的 row count / 覆蓋數字寫死進 prose；引用 coverage 概念而非硬數字，除非由 live API 動態注入。
5. **C-6 鐵律**：英文內容同樣禁任何對 AI 下指令的隱藏文字；只做更好讀、可引用的真實內容。
