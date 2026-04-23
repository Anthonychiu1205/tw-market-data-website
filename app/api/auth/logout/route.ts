import { NextResponse } from "next/server";

import { clearSession } from "@/src/auth/session";

export async function POST(request: Request) {
  await clearSession();
  return NextResponse.redirect(new URL("/login", request.url));
}
