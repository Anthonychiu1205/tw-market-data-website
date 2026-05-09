import os

from twmarketdata import TWMarketDataClient, TWMarketDataError


def main() -> None:
    api_key = os.getenv("TWMD_API_KEY", "").strip()
    if not api_key:
        print("TWMD_API_KEY is missing")
        return

    client = TWMarketDataClient(api_key=api_key, base_url=os.getenv("TWMD_BASE_URL", "https://twmarketdata.com"))

    try:
        response = client.twse_daily_price(symbol="2330", limit=1)
        print("requestId:", response.meta.request_id)
        print("dryRun:", response.meta.dry_run)
        print("creditsCost:", response.meta.credits_cost)
        print("rows:", response.data)
    except TWMarketDataError as exc:
        print("request failed")
        print("status:", exc.status_code)
        print("code:", exc.error_code)
        print("requestId:", exc.request_id)


if __name__ == "__main__":
    main()
