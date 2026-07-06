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

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
