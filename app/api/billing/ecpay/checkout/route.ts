import { NextResponse } from "next/server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/auth/prisma";
import {
  buildPeriodicCheckoutParams,
  generateMerchantTradeNo,
  getEcpayCheckoutUrl,
  renderAutoSubmitForm,
} from "@/src/lib/billing/ecpay";
import {
  getPlanAmount,
  getPlanDisplayLabel,
  isPaidPlanCode,
  normalizeBillingCycle,
} from "@/src/lib/billing/plans";

export const runtime = "nodejs";

async function parseBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    return {
      planCode: typeof body?.planCode === "string" ? body.planCode : "",
      billingCycle: typeof body?.billingCycle === "string" ? body.billingCycle : "",
    };
  }

  const formData = await request.formData();
  return {
    planCode: String(formData.get("planCode") ?? ""),
    billingCycle: String(formData.get("billingCycle") ?? ""),
  };
}

function redirectToLogin(request: Request, planCode: string, billingCycle: string) {
  const url = new URL(request.url);
  const loginUrl = new URL("/login", url.origin);
  const next = `/pricing?plan=${encodeURIComponent(planCode)}&billingCycle=${encodeURIComponent(billingCycle)}`;
  loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl, 303);
}

export async function POST(request: Request) {
  const { planCode, billingCycle } = await parseBody(request);

  const normalizedCycle = normalizeBillingCycle(billingCycle);
  if (!isPaidPlanCode(planCode) || !normalizedCycle) {
    return NextResponse.redirect(new URL("/pricing?checkout_error=invalid_selection", request.url), 303);
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return redirectToLogin(request, planCode, normalizedCycle);
  }

  const amount = getPlanAmount(planCode, normalizedCycle);
  if (!amount || amount <= 0) {
    return NextResponse.redirect(new URL("/pricing?checkout_error=invalid_amount", request.url), 303);
  }

  let subscription;
  try {
    const merchantTradeNo = generateMerchantTradeNo();
    subscription = await prisma.subscription.create({
      data: {
        userId,
        provider: "ecpay",
        planCode,
        billingCycle: normalizedCycle,
        status: "pending",
        amount,
        currency: "TWD",
        merchantTradeNo,
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/pricing?checkout_error=unavailable", request.url), 303);
  }

  try {
    const params = buildPeriodicCheckoutParams({
      merchantTradeNo: subscription.merchantTradeNo,
      amount,
      billingCycle: normalizedCycle,
      itemName: `TW Market Data ${getPlanDisplayLabel(planCode, normalizedCycle)}`,
      clientBackPath: "/billing/thank-you",
    });

    const html = renderAutoSubmitForm(getEcpayCheckoutUrl(), params);

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "failed" },
    });

    return NextResponse.redirect(new URL("/pricing?checkout_error=configuration", request.url), 303);
  }
}
