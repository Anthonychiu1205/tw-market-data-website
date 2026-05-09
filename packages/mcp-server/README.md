# TW Market Data MCP Server Skeleton (Preview)

此目錄提供 local/dev MCP integration skeleton，目標是讓 AI agents 可透過工具調用 TW Market Data API。

目前狀態：
- Preview only
- Local/dev only
- 未發布
- 不依賴 LLM API key

## Environment

- `TWMD_API_KEY`（必填）
- `TWMD_BASE_URL`（可選，預設 `https://twmarketdata.com`）

## Available tools

- `get_twse_daily_price`
- `get_tpex_daily_price`
- `get_issuer_profile`
- `get_monthly_revenue`
- `get_valuation_data`
- `get_technical_indicators`

每個工具都會回傳：

```json
{
  "data": {},
  "meta": {
    "requestId": "...",
    "dryRun": true,
    "creditsCost": 1,
    "creditsCharged": null,
    "plan": "free"
  }
}
```

## Build

```bash
cd packages/mcp-server
npm install --ignore-scripts
npm run build
```

## Run CLI skeleton

```bash
TWMD_API_KEY=twmd_live_xxx node dist/index.js get_twse_daily_price '{"symbol":"2330","limit":1}'
```

## MCP SDK wiring (future)

目前僅提供 tool registry + callable adapter，尚未直接整合 `@modelcontextprotocol/sdk` transport。下一步可把 `toolDefinitions` 與 `callTool()` 掛到 stdio MCP server。
