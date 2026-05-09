# TW Market Data Python SDK (Preview)

此 SDK 為 local/dev preview skeleton，尚未發布到 PyPI。

## Local install

```bash
cd /Volumes/DEV_USB/Projects/tw-market-data-website
pip install -e packages/python-sdk
```

## Usage

```python
from twmarketdata import TWMarketDataClient

client = TWMarketDataClient(api_key="twmd_live_xxx")
result = client.twse_daily_price(symbol="2330", limit=1)

print(result.meta.request_id)
print(result.meta.dry_run)
print(result.meta.credits_cost)
print(result.data)
```

## Error handling

```python
from twmarketdata import (
    TWMarketDataClient,
    AuthenticationError,
    EntitlementError,
    InsufficientCreditsError,
    DatasetNotFoundError,
    UpstreamError,
)

client = TWMarketDataClient(api_key="twmd_live_xxx")

try:
    result = client.monthly_revenue(symbol="2330", limit=12)
except AuthenticationError:
    print("API key 無效或已失效")
except EntitlementError:
    print("目前方案未開通此 dataset")
except InsufficientCreditsError:
    print("credits 不足")
except DatasetNotFoundError:
    print("dataset 不存在")
except UpstreamError:
    print("上游服務暫時異常")
```

## Metadata headers

SDK 會將下列 headers 轉成 `result.meta`：

- `X-Request-Id`
- `X-TWMD-Dry-Run`
- `X-TWMD-Credits-Cost`
- `X-TWMD-Credits-Charged`
- `X-TWMD-Plan`

目前 production 預設為 dry-run，`credits_charged` 可能為 `None`。

## Works with AI agents

- 可作為 agent tool wrapper 的資料層（MCP/Tool Calling）。
- 每次回應都可讀取 `request_id` 做追蹤。
- dry-run credits metadata 適合在正式扣點前先驗證 workflow。
