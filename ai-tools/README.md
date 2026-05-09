# TW Market Data AI Tool Manifest (Preview)

此目錄提供 agent/tool-calling 可讀的工具定義清單，供 OpenAI function calling、LangChain、MCP adapter 或自建 agent framework 使用。

- Manifest: `twmd_tools.json`
- Mode: local/dev preview
- Not published

## Design goals

- 統一 dataset tool naming
- 明確 input schema
- 顯示 required plan 與 credits cost（供規劃與提示）
- 提供 example prompt 方便 agent workflow 快速接入

## Notes

- 客戶端請使用 Dashboard 產生的 `twmd_live_...` key。
- `BACKEND_API_TOKEN` 是 server-to-backend token，不可暴露給 agent。
- request tracing 可使用 `X-Request-Id`。
