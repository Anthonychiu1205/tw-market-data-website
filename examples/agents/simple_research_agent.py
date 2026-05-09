import json
import os

from twmarketdata import TWMarketDataClient


def main() -> None:
    api_key = (os.getenv("TWMD_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError("TWMD_API_KEY is required")

    symbol = os.getenv("TWMD_SYMBOL", "2330")
    client = TWMarketDataClient(
        api_key=api_key,
        base_url=os.getenv("TWMD_BASE_URL", "https://twmarketdata.com"),
        timeout=10,
    )

    issuer = client.issuer_profile(symbol=symbol)
    prices = client.twse_daily_price(symbol=symbol, limit=5)
    revenue = client.monthly_revenue(symbol=symbol, limit=12)

    context = {
        "symbol": symbol,
        "issuerProfile": issuer.data,
        "latestPriceRows": prices.data,
        "monthlyRevenueRows": revenue.data,
        "trace": {
            "issuerProfileRequestId": issuer.meta.request_id,
            "twsePriceRequestId": prices.meta.request_id,
            "monthlyRevenueRequestId": revenue.meta.request_id,
            "dryRun": issuer.meta.dry_run,
            "estimatedCreditsCost": (issuer.meta.credits_cost or 0)
            + (prices.meta.credits_cost or 0)
            + (revenue.meta.credits_cost or 0),
        },
    }

    print(json.dumps(context, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
