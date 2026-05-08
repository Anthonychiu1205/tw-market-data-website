import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/auth/prisma";
import {
  getCreditPackage,
  getOrCreateCreditWallet,
  isCreditPackageCode,
} from "@/src/lib/billing/credits";
import {
  buildEcpayCreditsCheckoutPayload,
  generateMerchantTradeNo,
  getEcpayCheckoutUrl,
  renderAutoSubmitForm,
} from "@/src/lib/billing/ecpay";

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
      <a href="/billing/credits">返回 Credits 頁</a>
    </div>
  </div>
</body>
</html>`;
}

async function parsePackageCode(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    return typeof body?.packageCode === "string" ? body.packageCode : "";
  }

  const formData = await request.formData();
  return String(formData.get("packageCode") ?? "");
}

async function createPendingCreditTransaction(input: {
  userId: string;
  walletId: string;
  packageCode: string;
  amountTwd: number;
  credits: number;
}) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const merchantTradeNo = generateMerchantTradeNo();
    try {
      const transaction = await prisma.creditTransaction.create({
        data: {
          userId: input.userId,
          walletId: input.walletId,
          type: "purchase",
          status: "pending",
          amountTwd: input.amountTwd,
          credits: input.credits,
          provider: "ecpay",
          packageCode: input.packageCode,
          merchantTradeNo,
          description: `Credits top-up (${input.packageCode})`,
        },
      });
      return transaction;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Unable to create unique merchant trade number");
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", "/billing/credits");
    return NextResponse.redirect(loginUrl, 303);
  }

  const packageCode = (await parsePackageCode(request)).trim();
  if (!isCreditPackageCode(packageCode)) {
    return new Response(renderCheckoutErrorHtml("請先選擇有效的 credits 儲值方案。"), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const selectedPackage = getCreditPackage(packageCode);

  try {
    const wallet = await getOrCreateCreditWallet(userId);
    const pendingTransaction = await createPendingCreditTransaction({
      userId,
      walletId: wallet.id,
      packageCode,
      amountTwd: selectedPackage.priceTwd,
      credits: selectedPackage.credits,
    });
    if (!pendingTransaction.merchantTradeNo) {
      throw new Error("Missing merchant trade number");
    }

    const params = buildEcpayCreditsCheckoutPayload({
      merchantTradeNo: pendingTransaction.merchantTradeNo,
      amountTwd: selectedPackage.priceTwd,
      credits: selectedPackage.credits,
      clientBackPath: "/billing/credits",
    });

    const html = renderAutoSubmitForm(getEcpayCheckoutUrl(), params, {
      title: "正在前往綠界付款",
      description: "付款將於新分頁完成，原頁會保留。",
      helperText: "付款完成後請返回 Credits 頁刷新餘額；最終狀態以伺服器通知為準。",
      submitLabel: "前往付款",
      packageCode,
      amount: selectedPackage.priceTwd,
      credits: selectedPackage.credits,
    });

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
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
