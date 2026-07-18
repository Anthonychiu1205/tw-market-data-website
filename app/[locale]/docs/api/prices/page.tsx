import { redirect } from "next/navigation";

export default function LegacyPricesPageRedirect() {
  redirect("/docs/api/market-prices/twse-daily-price");
}
