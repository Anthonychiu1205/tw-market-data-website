import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/src/auth";
import { getPolarClient } from "@/src/lib/billing/polar";
import { isPolarCustomerMissing } from "@/src/lib/billing/polar-subscription-mappers";

export const runtime = "nodejs";

/**
 * Polar Customer Portal entry point. Creates a customer session and redirects to the Polar-hosted
 * portal (manage subscription / payment method / invoices), keyed on externalCustomerId = NextAuth
 * user id. We call customerSessions.create directly (not the @polar-sh/nextjs CustomerPortal helper)
 * so we can catch failures: an entitlement-only user with no Polar customer gets a 422
 * "Customer does not exist" — the helper crashed on it (RangeError: Invalid status code 0 → 500).
 * All failures now redirect back to /billing/subscriptions with a friendly note — never a 500.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.redirect(new URL("/login?next=/billing/subscriptions", request.url));
  }

  try {
    const polar = getPolarClient();
    const customerSession = await polar.customerSessions.create({ externalCustomerId: userId });
    if (!customerSession?.customerPortalUrl) {
      return NextResponse.redirect(new URL("/billing/subscriptions?portal=unavailable", request.url));
    }
    return NextResponse.redirect(customerSession.customerPortalUrl);
  } catch (error) {
    // No Polar customer yet (entitlement-only / never checked out): send them back with a note that
    // a subscription is required first, rather than 500ing.
    if (isPolarCustomerMissing(error)) {
      return NextResponse.redirect(new URL("/billing/subscriptions?portal=no-subscription", request.url));
    }
    // Any other failure (Polar down, bad token): friendly error, still never a 500.
    const statusCode = (error as { statusCode?: number })?.statusCode;
    console.warn(`[billing-portal] user=${userId} status=${statusCode ?? "n/a"}`);
    return NextResponse.redirect(new URL("/billing/subscriptions?portal=unavailable", request.url));
  }
}
