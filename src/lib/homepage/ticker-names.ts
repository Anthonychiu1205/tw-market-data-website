// English display names for the demo tickers (I18N-FIX-04 item 6). On /en a Chinese company name must
// never render; we show "<symbol> <English name>" (or just the symbol if we have no mapping), and the
// real zh name on /zh-TW. Pure module (no server-only) so client components can import it.

export const TICKER_EN_NAME: Record<string, string> = {
  "2330": "TSMC",
  "2317": "Hon Hai",
  "2454": "MediaTek",
  "2308": "Delta",
  "3711": "ASE",
  "3231": "Wistron",
};

// "2330 台積電" (zh) / "2330 TSMC" (en) / "2330" (en with no mapping — never the zh name on /en).
export function tickerDisplayName(symbol: string, zhName: string, locale: string): string {
  if (locale === "en") {
    const en = TICKER_EN_NAME[symbol];
    return en ? `${symbol} ${en}` : symbol;
  }
  return zhName ? `${symbol} ${zhName}` : symbol;
}
