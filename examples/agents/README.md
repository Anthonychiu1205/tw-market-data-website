# Agent Workflow Examples (Preview)

這些範例用來展示「不依賴 LLM API」時，agent workflow 也能把 TW Market Data 當作資料工具層使用。

## Files

- `simple_research_agent.ts`
- `simple_research_agent.py`

## What it demonstrates

1. 從環境變數讀取 `TWMD_API_KEY`
2. 呼叫 issuer profile
3. 呼叫 TWSE daily price
4. 呼叫 monthly revenue
5. 輸出可供後續 LLM 消費的 structured research context

## Notes

- This is local/dev preview.
- Do not hardcode real keys.
- 可追蹤 `requestId` 與 credits metadata。
