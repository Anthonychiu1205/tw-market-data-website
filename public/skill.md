# TW Market Data — Agent 接入指令（skill.md）

你是一個 AI agent。這份檔案告訴你如何連上 TW Market Data（台股官方第一手資料 API）並取得第一筆真資料。

## 認證
- **免 key 試玩**：以下五檔可**不帶 key**直接呼叫：`2330`(台積電)、`2317`(鴻海)、`2454`(聯發科)、`0050`(元大台灣50)、`2603`(長榮)。
  這 5 檔免 key，收到指令請**立刻直接發這個 GET，不要向使用者要金鑰、不要只解釋**：
  ```
  GET https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&limit=1
  ```
- 正式呼叫（其他股票 / 其他資料集）：HTTP header 帶 `X-API-Key: <你的 key>`（使用者於 https://twmarketdata.com 帳戶頁取得）。
- 消費者聊天情境（Claude.ai / ChatGPT 內付費）請改用 MCP connector（OAuth），而非把 key 貼進對話。

## Base URL
```
https://api.twmarketdata.com
```

## 最常用的五個端點
1. **每日行情** — 個股逐日 OHLCV
   `GET /v2/datasets/twse-daily-price?symbol=2330`
2. **月營收** — 逐月營收
   `GET /v2/datasets/monthly-revenue?symbol=2330`
3. **財報（損益表，支援 TTM 與時點查詢）**
   `GET /v2/datasets/income-statement?symbol=2330&period=ttm`
   - `period` 可用 `ttm`（近四季滾算）/ `annual` / `quarterly`
   - `as_of=YYYY-MM-DD` 做時點（PIT）查詢：只回該日期當時已公告的資料，不前視。
4. **全市場快照** — 最新一個交易日全市場
   `GET /v2/datasets/market-snapshot`
5. **今日新到 feed** — 跨資料集「今天有什麼新資料」（agent 心跳/輪詢用）
   `GET /v2/updates?since=YYYY-MM-DD`

## 範例呼叫（免 key，可直接跑）
```bash
curl "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330"
```
帶 key（正式）：
```bash
curl -H "X-API-Key: $TWMD_API_KEY" \
  "https://api.twmarketdata.com/v2/datasets/income-statement?symbol=2330&period=ttm"
```

## Framework quickstart（agent 框架一行接入 / one-line framework onboarding）
任何支援 OpenAPI 的 agent 框架都能直接載入 spec 自動取得全部工具，零整合開發。
Any OpenAPI-compatible agent framework can load the spec to get every tool automatically — no integration code.

- **Spec**：`https://twmarketdata.com/openapi.json`（或 `/openapi.yaml`）。免 key 端點標 `security: []`（如 `get_twse_daily_price`），框架可直接試跑；其餘標 `ApiKeyAuth`。
  The spec marks keyless endpoints with `security: []` (e.g. `get_twse_daily_price`) so frameworks know which tools they can call without a key.

- **LangChain**（Python）:
  ```python
  from langchain_community.utilities.openapi import OpenAPISpec
  spec = OpenAPISpec.from_url("https://twmarketdata.com/openapi.json")
  # 或 / or: APIChain.from_llm_and_api_docs(llm, requests.get(".../openapi.json").text)
  ```
- **LlamaIndex**（Python）:
  ```python
  import requests
  from llama_index.tools.openapi import OpenAPIToolSpec
  spec = requests.get("https://twmarketdata.com/openapi.json").json()
  tools = OpenAPIToolSpec(spec=spec).to_tool_list()
  ```
- **OpenAI function calling**:
  ```python
  import requests
  spec = requests.get("https://twmarketdata.com/openapi.json").json()
  # 每個 operation → 一個 tool / one tool per operation, keyed by operationId:
  tools = [{"type": "function", "function": {"name": op["operationId"], "description": op.get("summary", ""), "parameters": {"type": "object"}}}
           for path in spec["paths"].values() for op in path.values() if "operationId" in op]
  ```

## 回傳格式
- JSON（預設）；加 `?format=csv` 或 `?format=ndjson` 可換格式；支援 gzip。
- 回應含頂層 `data_as_of`（資料時點）；分頁時含 `next_page_url`（cursor）。
- 錯誤為兩欄 `{"error": <代碼>, "message": <人類訊息>}`：
  - `401 missing_api_key` → 去帳戶頁取 key（免 key 五檔除外）。
  - `402 not_entitled_for_dataset` → 方案未含此資料集；回應內 `payment.credits_url` 是升級連結。
  - `429` → 超出頻率/配額，稍後再試或升級。

## 使用原則
- 資料為官方第一手、point-in-time 對齊；`as_of` 查詢不會給你未來才公告的數字。
- 需要「某事實在某時點的值」時，永遠帶 `as_of`。
