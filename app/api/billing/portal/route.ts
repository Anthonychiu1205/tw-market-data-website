import { CustomerPortal } from "@polar-sh/nextjs";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/src/auth";

export const runtime = "nodejs";

function resolvePolarServer(): "sandbox" | "production" {
  const base = process.env.POLAR_API_BASE?.trim().toLowerCase();
  return base && base.includes("sandbox") ? "sandbox" : "production";
}

/**
 * Polar Customer Portal entry point. Authenticated users are redirected to their
 * Polar-hosted portal (manage subscription, invoices, cancellation). The portal is
 * resolved by external customer id = NextAuth user id, matching the id passed at
 * checkout, so no local Polar-customer mapping is needed.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.redirect(new URL("/login?next=/billing", request.url));
  }

  const handler = CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
    server: resolvePolarServer(),
    getExternalCustomerId: async () => userId,
  });

  return handler(request);
}
