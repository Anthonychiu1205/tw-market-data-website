import { redirect } from "next/navigation";

export default function LegacyPriceDataPageRedirect() {
  redirect("/docs/api/market-prices/twse-daily-price");
}
