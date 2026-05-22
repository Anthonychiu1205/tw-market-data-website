import { NextResponse } from "next/server";

import { hashPassword } from "@/src/lib/auth/email-password";
import { prisma } from "@/src/lib/auth/prisma";
import { normalizeEmail } from "@/src/lib/auth/email-verification";

const REVIEW_EMAIL = "payment-review@twmarketdata.com";
const REVIEW_PASSWORD = "TWMdataReview#2026";
const SETUP_SECRET_HEADER = "x-payment-review-setup-secret";

export async function POST(request: Request) {
  const setupSecret = process.env.PAYMENT_REVIEW_ACCOUNT_SETUP_SECRET?.trim();
  if (!setupSecret) {
    return NextResponse.json({ ok: false, error: "setup_secret_missing" }, { status: 500 });
  }

  const requestSecret = request.headers.get(SETUP_SECRET_HEADER);
  if (!requestSecret || requestSecret !== setupSecret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const email = normalizeEmail(REVIEW_EMAIL);
  const passwordHash = await hashPassword(REVIEW_PASSWORD);

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        role: "user",
        passwordHash,
        emailVerified: now,
        emailVerifiedAt: now,
      },
    });

    return NextResponse.json({
      ok: true,
      action: "updated",
      email,
      role: "user",
      emailVerified: true,
      retention: "manual_delete_after_payment_review",
    });
  }

  await prisma.user.create({
    data: {
      email,
      name: "Payment Review Account",
      role: "user",
      passwordHash,
      emailVerified: now,
      emailVerifiedAt: now,
    },
  });

  return NextResponse.json({
    ok: true,
    action: "created",
    email,
    role: "user",
    emailVerified: true,
    retention: "manual_delete_after_payment_review",
  });
}
