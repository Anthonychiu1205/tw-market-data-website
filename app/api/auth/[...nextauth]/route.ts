import { NextRequest, NextResponse } from "next/server";

import { handlers } from "@/src/auth";
import {
  buildAuthRuntimeErrorPayload,
  checkAuthRuntimeEnv,
  logAuthRuntimeEnvMissing,
} from "@/src/auth/env";

export async function GET(request: NextRequest) {
  const check = checkAuthRuntimeEnv();
  if (!check.ok) {
    logAuthRuntimeEnvMissing("api/auth/[...nextauth]:GET", check);
    return NextResponse.json(buildAuthRuntimeErrorPayload(check), { status: check.status });
  }

  return await handlers.GET(request);
}

export async function POST(request: NextRequest) {
  const check = checkAuthRuntimeEnv();
  if (!check.ok) {
    logAuthRuntimeEnvMissing("api/auth/[...nextauth]:POST", check);
    return NextResponse.json(buildAuthRuntimeErrorPayload(check), { status: check.status });
  }

  return await handlers.POST(request);
}
