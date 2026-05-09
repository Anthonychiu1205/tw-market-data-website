# TW Market Data JavaScript SDK (Preview)

此 SDK 為 local/dev preview skeleton，尚未發布到 npm。

## Local usage

在專案內可用本地路徑方式測試：

```bash
npm install ./packages/js-sdk
```

或直接在 repo 內 import 原始碼測試。

## Example

```ts
import { TWMarketDataClient } from "@twmarketdata/sdk";

const client = new TWMarketDataClient({
  apiKey: "twmd_live_xxx",
  baseUrl: "https://twmarketdata.com",
  timeoutMs: 10000,
});

const result = await client.twseDailyPrice({ symbol: "2330", limit: 1 });
console.log(result.meta.requestId);
console.log(result.meta.dryRun);
console.log(result.meta.creditsCost);
console.log(result.data);
```

## Error handling

```ts
import {
  TWMarketDataClient,
  AuthenticationError,
  EntitlementError,
  InsufficientCreditsError,
  DatasetNotFoundError,
  UpstreamError,
} from "@twmarketdata/sdk";

const client = new TWMarketDataClient({ apiKey: "twmd_live_xxx" });

try {
  await client.monthlyRevenue({ symbol: "2330", limit: 12 });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("API key 無效");
  } else if (error instanceof EntitlementError) {
    console.error("方案未開通此 dataset");
  } else if (error instanceof InsufficientCreditsError) {
    console.error("credits 不足");
  } else if (error instanceof DatasetNotFoundError) {
    console.error("dataset 不存在");
  } else if (error instanceof UpstreamError) {
    console.error("上游服務異常");
  }
}
```

## Response metadata

`result.meta` 包含：

- `requestId`
- `dryRun`
- `creditsCost`
- `creditsCharged`
- `plan`

目前 production 預設為 dry-run，`creditsCharged` 可能為 `null`。

## Works with AI agents

- 可直接用於 agent tool wrappers（MCP/Tool Calling）。
- 可用 `requestId` 做請求追蹤與客服排查。
- dry-run credits metadata 適合先做安全實驗，不會直接誤導為正式扣點。
