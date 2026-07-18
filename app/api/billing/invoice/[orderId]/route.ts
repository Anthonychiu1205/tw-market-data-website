import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/src/auth";
import { getPolarClient } from "@/src/lib/billing/polar";
import { isOrderOwnedByUser } from "@/src/lib/billing/polar-subscription-mappers";

export const runtime = "nodejs";

/**
 * Redirect an authenticated user to their Polar-hosted invoice PDF for a single order.
 *
 * Ownership is enforced by comparing the order's customer externalId to the session user
 * id; a mismatch returns 404 (not 403) so we never confirm the existence of another
 * user's order. When the invoice has not been generated yet we trigger generation and,
 * if it is not immediately ready, tell the user to retry rather than erroring.
 */
export async function GET(request: NextRequest, ctx: { params: Promise<{ orderId: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.redirect(new URL("/login?next=/billing/subscriptions", request.url));
  }

  const { orderId } = await ctx.params;
  if (!orderId) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const polar = getPolarClient();
    const order = await polar.orders.get({ id: orderId });

    if (!isOrderOwnedByUser(order, userId)) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (!order.isInvoiceGenerated) {
      try {
        await polar.orders.generateInvoice({ id: orderId });
      } catch {
        // Generation may already be in flight from a prior request — fall through to fetch.
      }
    }

    try {
      const invoice = await polar.orders.invoice({ id: orderId });
      if (invoice?.url) {
        return NextResponse.redirect(invoice.url);
      }
    } catch {
      // Not ready yet.
    }

    return new NextResponse("發票產生中，請稍後再試。", { status: 202 });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode;
    console.warn(`[billing-invoice] order=${orderId} user=${userId} status=${statusCode ?? "n/a"}`);
    return new NextResponse("Invoice unavailable", { status: 502 });
  }
}
