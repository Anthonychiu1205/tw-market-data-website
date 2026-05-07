import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { prisma } from "@/src/lib/auth/prisma";
import { accountProfilePatchSchema } from "@/src/lib/account/profile-schema";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function serializeProfile(user: {
  email: string | null;
  displayName: string | null;
  companyName: string | null;
  userRole: string | null;
  useCase: string | null;
  onboardingCompleted: boolean;
}) {
  return {
    email: user.email ?? "",
    displayName: user.displayName,
    companyName: user.companyName,
    userRole: user.userRole,
    useCase: user.useCase,
    onboardingCompleted: user.onboardingCompleted,
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      email: true,
      displayName: true,
      companyName: true,
      userRole: true,
      useCase: true,
      onboardingCompleted: true,
    },
  });

  if (!user) {
    return NextResponse.json({ ok: false, error: "user_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, profile: serializeProfile(user) });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return unauthorized();
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = accountProfilePatchSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_profile_payload",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const updates = parsed.data;
  if (Object.keys(updates).length === 0) {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        email: true,
        displayName: true,
        companyName: true,
        userRole: true,
        useCase: true,
        onboardingCompleted: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ ok: false, error: "user_not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, profile: serializeProfile(currentUser) });
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.id },
    data: {
      ...updates,
      onboardingCompleted: true,
    },
    select: {
      email: true,
      displayName: true,
      companyName: true,
      userRole: true,
      useCase: true,
      onboardingCompleted: true,
    },
  });

  return NextResponse.json({ ok: true, profile: serializeProfile(updatedUser) });
}
