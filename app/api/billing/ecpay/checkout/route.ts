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

function renderCheckoutErrorHtml(message: string) {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>付款暫時無法進行</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", sans-serif; background: #f8fafc; color: #0f172a; }
    .container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .panel { width: 100%; max-width: 520px; border-radius: 20px; border: 1px solid #e2e8f0; background: #fff; padding: 28px; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08); }
    h1 { margin: 0; font-size: 22px; font-weight: 650; line-height: 1.35; color: #020617; }
    p { margin: 12px 0 0; font-size: 14px; line-height: 1.7; color: #475569; }
    a { display: inline-flex; margin-top: 20px; height: 42px; align-items: center; justify-content: center; border-radius: 12px; padding: 0 16px; background: #0f172a; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; }
    a:hover { background: #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="panel">
      <h1>付款暫時無法進行</h1>
      <p>${message}</p>
      <a href="/pricing">返回方案頁</a>
    </div>
  </div>
</body>
</html>`;
}

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

    const html = renderAutoSubmitForm(getEcpayCheckoutUrl(), params, {
      planCode,
      billingCycle: normalizedCycle,
      amount,
    });

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "failed" },
    });

    const errorMessage =
      error instanceof Error && error.message === "ECPAY configuration missing"
        ? "付款服務設定尚未完成，請稍後再試，或聯繫我們協助。"
        : "系統目前無法建立付款請求，請稍後再試。";

    return new Response(renderCheckoutErrorHtml(errorMessage), {
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }
}
