import { NextRequest, NextResponse } from "next/server";

import { handlers } from "@/src/auth";
import { checkAuthRuntimeEnv } from "@/src/auth/env";

export async function GET(request: NextRequest) {
  const check = checkAuthRuntimeEnv();
  if (!check.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "auth_runtime_env_missing",
        message: check.message,
        missing: check.missing,
      },
      { status: check.status },
    );
  }

  return await handlers.GET(request);
}

export async function POST(request: NextRequest) {
  const check = checkAuthRuntimeEnv();
  if (!check.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "auth_runtime_env_missing",
        message: check.message,
        missing: check.missing,
      },
      { status: check.status },
    );
  }

  return await handlers.POST(request);
}
