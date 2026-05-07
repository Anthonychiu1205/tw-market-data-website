export type AuthRuntimeEnvCheck =
  | { ok: true }
  | { ok: false; status: number; message: string; missing: string[] };

function requiredAuthEnvKeys() {
  if (process.env.NODE_ENV === "production") {
    return [
      "DATABASE_URL",
      "AUTH_SECRET",
      "NEXTAUTH_URL",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
    ] as const;
  }

  return ["DATABASE_URL"] as const;
}

export function checkAuthRuntimeEnv(): AuthRuntimeEnvCheck {
  const requiredKeys = requiredAuthEnvKeys();
  const missing = requiredKeys.filter((key) => !process.env[key] || !process.env[key]?.trim());

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
  const requiredKeys = ["DATABASE_URL", "AUTH_SECRET"] as const;
  const missing = requiredKeys.filter((key) => !process.env[key] || !process.env[key]?.trim());

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
