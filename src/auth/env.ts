export type AuthRuntimeEnvCheck =
  | { ok: true }
  | { ok: false; status: number; message: string; missing: string[] };

const AUTH_UNAVAILABLE_MESSAGE = "Auth service is temporarily unavailable";

function hasValue(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

function requiredAuthEnvMissingKeys() {
  const missing = [];

  if (!hasValue(process.env.DATABASE_URL)) {
    missing.push("DATABASE_URL");
  }

  if (process.env.NODE_ENV === "production" && !hasValue(process.env.AUTH_SECRET)) {
    missing.push("AUTH_SECRET");
  }

  const hasAuthUrl = hasValue(process.env.NEXTAUTH_URL) || hasValue(process.env.AUTH_URL);
  if (process.env.NODE_ENV === "production" && !hasAuthUrl) {
    missing.push("NEXTAUTH_URL or AUTH_URL");
  }

  const hasGooglePrimary =
    hasValue(process.env.GOOGLE_CLIENT_ID) && hasValue(process.env.GOOGLE_CLIENT_SECRET);
  const hasGoogleFallback =
    hasValue(process.env.AUTH_GOOGLE_ID) && hasValue(process.env.AUTH_GOOGLE_SECRET);
  if (process.env.NODE_ENV === "production" && !hasGooglePrimary && !hasGoogleFallback) {
    missing.push("GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET or AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET");
  }

  return missing;
}

export function checkAuthRuntimeEnv(): AuthRuntimeEnvCheck {
  const missing = requiredAuthEnvMissingKeys();

  if (missing.length === 0) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 503,
    message:
      "Authentication is not configured. Missing required environment variables for auth runtime.",
    missing: [...missing],
  };
}

export function checkEmailAuthRuntimeEnv(): AuthRuntimeEnvCheck {
  const missing = ["DATABASE_URL", "AUTH_SECRET"].filter((key) => !hasValue(process.env[key]));

  if (missing.length === 0) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 503,
    message:
      "Email authentication is not configured. Missing required environment variables.",
    missing: [...missing],
  };
}

export function logAuthRuntimeEnvMissing(scope: string, check: AuthRuntimeEnvCheck) {
  if (check.ok) return;
  console.error(`[${scope}] auth runtime env missing: ${check.missing.join(", ")}`);
}

export function buildAuthRuntimeErrorPayload(
  check: AuthRuntimeEnvCheck,
  options?: { devErrorCode?: string; prodErrorCode?: string },
) {
  if (check.ok) return null;

  const devErrorCode = options?.devErrorCode ?? "auth_runtime_env_missing";
  const prodErrorCode = options?.prodErrorCode ?? "auth_unavailable";

  if (isProductionRuntime()) {
    return {
      ok: false,
      error: prodErrorCode,
      message: AUTH_UNAVAILABLE_MESSAGE,
    };
  }

  return {
    ok: false,
    error: devErrorCode,
    message: check.message,
    missing: check.missing,
  };
}
