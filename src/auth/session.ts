import { auth } from "@/src/auth";

export type AppSession = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
};

export class AuthRuntimeUnavailableError extends Error {
  constructor(message = "auth_runtime_unavailable") {
    super(message);
    this.name = "AuthRuntimeUnavailableError";
  }
}

type SessionResolution = {
  session: AppSession | null;
  unavailable: boolean;
};

function sanitizeAuthRuntimeMessage(error: unknown) {
  if (!(error instanceof Error)) return "auth_runtime_unavailable";
  return error.message
    .replace(/\bpostgres(?:ql)?:\/\/[^\s]+/gi, "[REDACTED_DB_URL]")
    .replace(/\b[A-Z0-9_]*(?:SECRET|TOKEN|API_KEY)[A-Z0-9_]*\b/gi, "[REDACTED_SECRET_NAME]")
    .slice(0, 200);
}

export async function getSessionWithRuntimeStatus(): Promise<SessionResolution> {
  try {
    const session = await auth();
    const email = session?.user?.email;
    const id = session?.user?.id;

    if (!email || !id) {
      return {
        session: null,
        unavailable: false,
      };
    }

    return {
      session: {
        id,
        email,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
        role: session.user.role ?? "user",
      },
      unavailable: false,
    };
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    const sanitizedMessage = sanitizeAuthRuntimeMessage(error);
    console.error(`[auth-runtime] stage=session_lookup ok=false errorName=${errorName} message=${sanitizedMessage}`);
    return {
      session: null,
      unavailable: true,
    };
  }
}

export async function getSession(): Promise<AppSession | null> {
  const resolved = await getSessionWithRuntimeStatus();
  return resolved.session;
}
