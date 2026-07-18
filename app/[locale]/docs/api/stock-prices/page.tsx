import { redirect } from "next/navigation";

export default function StockPricesRedirectPage() {
  redirect("/docs/api/prices");
}
