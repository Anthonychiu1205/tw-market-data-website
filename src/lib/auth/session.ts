import { redirect } from "next/navigation";

import { AuthRuntimeUnavailableError, type AppSession, getSessionWithRuntimeStatus } from "@/src/auth/session";

export async function getRequiredSession(): Promise<AppSession> {
  const resolved = await getSessionWithRuntimeStatus();

  if (resolved.unavailable) {
    throw new AuthRuntimeUnavailableError();
  }

  if (!resolved.session) {
    redirect("/login");
  }

  return resolved.session;
}
