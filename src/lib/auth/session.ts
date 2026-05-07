import { redirect } from "next/navigation";

import type { AppSession } from "@/src/auth/session";
import { getSession } from "@/src/auth/session";

export async function getRequiredSession(): Promise<AppSession> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
