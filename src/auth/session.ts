import { auth } from "@/src/auth";

export type AppSession = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
};

export async function getSession(): Promise<AppSession | null> {
  const session = await auth();
  const email = session?.user?.email;
  const id = session?.user?.id;

  if (!email || !id) {
    return null;
  }

  return {
    id,
    email,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
    role: session.user.role ?? "user",
  };
}
