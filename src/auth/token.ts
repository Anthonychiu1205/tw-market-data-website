import { jwtVerify, SignJWT } from "jose";

export type SessionPayload = {
  email: string;
};

function getSecretKey() {
  const secret =
    process.env.AUTH_SECRET ??
    "dev-only-secret-change-in-production-tw-market-data";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(email: string) {
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.email !== "string") return null;

    return {
      email: payload.email,
    } satisfies SessionPayload;
  } catch {
    return null;
  }
}
