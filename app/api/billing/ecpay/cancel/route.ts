import { NextResponse } from "next/server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/auth/prisma";
import {
  buildPeriodActionParams,
  getEcpayPeriodActionUrl,
  verifyCheckMacValue,
} from "@/src/lib/billing/ecpay";

export const runtime = "nodejs";

type ParsedInput = {
  subscriptionId: string | null;
  expectsJson: boolean;
};

async function parseInput(request: Request): Promise<ParsedInput> {
  const contentType = request.headers.get("content-type") ?? "";
  const expectsJson = contentType.includes("application/json");

  if (expectsJson) {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    return {
      subscriptionId: typeof body?.subscriptionId === "string" ? body.subscriptionId : null,
      expectsJson,
    };
  }

  const formData = await request.formData();
  return {
    subscriptionId: String(formData.get("subscriptionId") ?? "") || null,
    expectsJson,
  };
}

function redirectBilling(request: Request, status: "ok" | "already" | "error", reason?: string) {
  const url = new URL("/billing", request.url);
  if (status === "ok") {
    url.searchParams.set("cancel", "1");
  } else if (status === "already") {
    url.searchParams.set("cancel", "already");
  } else {
    url.searchParams.set("cancel_error", reason ?? "unknown");
  }
  return NextResponse.redirect(url, 303);
}

function parsePeriodActionResponse(rawText: string) {
  const params = new URLSearchParams(rawText);
  if (params.has("RtnCode") || params.has("RtnMsg")) {
    return Object.fromEntries(params.entries());
  }

  try {
    const parsed = JSON.parse(rawText) as Record<string, unknown>;
    const record: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        record[key] = String(value);
      }
    }
    return record;
  } catch {
    return {} as Record<string, string>;
  }
}

export async function POST(request: Request) {
  const { subscriptionId, expectsJson } = await parseInput(request);

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    if (expectsJson) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", "/billing");
    return NextResponse.redirect(loginUrl, 303);
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      id: subscriptionId ?? undefined,
      userId,
      status: "active",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    return expectsJson
      ? NextResponse.json({ ok: false, error: "subscription_not_found" }, { status: 404 })
      : redirectBilling(request, "error", "subscription_not_found");
  }

  if (subscription.cancelAtPeriodEnd) {
    return expectsJson
      ? NextResponse.json({ ok: true, alreadyCancelled: true })
      : redirectBilling(request, "already");
  }

  let actionParams: Record<string, string>;
  try {
    actionParams = buildPeriodActionParams({
      merchantTradeNo: subscription.merchantTradeNo,
      action: "Cancel",
    });
  } catch {
    return expectsJson
      ? NextResponse.json({ ok: false, error: "billing_not_configured" }, { status: 503 })
      : redirectBilling(request, "error", "configuration");
  }

  let rawText = "";
  try {
    const response = await fetch(getEcpayPeriodActionUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(actionParams).toString(),
      cache: "no-store",
    });

    rawText = await response.text();

    if (!response.ok) {
      return expectsJson
        ? NextResponse.json({ ok: false, error: "cancel_request_failed" }, { status: 502 })
        : redirectBilling(request, "error", "request_failed");
    }
  } catch {
    return expectsJson
      ? NextResponse.json({ ok: false, error: "cancel_request_failed" }, { status: 502 })
      : redirectBilling(request, "error", "request_failed");
  }

  const parsed = parsePeriodActionResponse(rawText);
  if (parsed.CheckMacValue && !verifyCheckMacValue(parsed)) {
    return expectsJson
      ? NextResponse.json({ ok: false, error: "cancel_response_invalid" }, { status: 502 })
      : redirectBilling(request, "error", "response_invalid");
  }

  const rtnCode = parsed.RtnCode ?? parsed.rtnCode ?? "";
  if (rtnCode !== "1") {
    return expectsJson
      ? NextResponse.json(
          {
            ok: false,
            error: "cancel_rejected",
            rtnCode,
            message: parsed.RtnMsg ?? null,
          },
          { status: 400 },
        )
      : redirectBilling(request, "error", "rejected");
  }

  const cancelled = await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "cancelled",
      cancelAtPeriodEnd: true,
      cancelledAt: new Date(),
    },
  });

  if (expectsJson) {
    return NextResponse.json({
      ok: true,
      subscription: {
        id: cancelled.id,
        status: cancelled.status,
        cancelAtPeriodEnd: cancelled.cancelAtPeriodEnd,
        cancelledAt: cancelled.cancelledAt,
        currentPeriodEnd: cancelled.currentPeriodEnd,
      },
    });
  }

  return redirectBilling(request, "ok");
}
