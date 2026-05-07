import { signOut } from "@/src/auth";

export async function POST() {
  return await signOut({ redirectTo: "/" });
}
