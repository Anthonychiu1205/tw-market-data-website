import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// The Neon serverless driver talks to Neon over a WebSocket, which avoids the slow
// TCP+TLS handshake to a scaled-to-zero Postgres — the main cause of cold-start latency
// on the per-request session lookup. In Node runtimes it needs a WebSocket constructor;
// all Prisma usage here runs on the Node runtime (no Edge middleware/routes).
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Local dev often points DATABASE_URL at a plain TCP Postgres (localhost). The Neon serverless
// driver would try wss://localhost/v2 and fail (ECONNREFUSED), which broke writes (e.g. dev-login).
// Use the Neon adapter only for a real Neon host; localhost falls back to the standard TCP engine.
// Prod behaviour is UNCHANGED (prod DATABASE_URL is a Neon host → adapter as before).
function isLocalDatabase(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

function useNeonAdapter(url: string | undefined): boolean {
  // Explicit override wins (USE_NEON_ADAPTER=0 forces the TCP engine, =1 forces Neon);
  // otherwise auto-detect: Neon for a remote host, standard TCP for localhost.
  const flag = process.env.USE_NEON_ADAPTER;
  if (flag === "0") return false;
  if (flag === "1") return true;
  return !isLocalDatabase(url);
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!useNeonAdapter(url)) {
    return new PrismaClient();
  }
  const adapter = new PrismaNeon({ connectionString: url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
