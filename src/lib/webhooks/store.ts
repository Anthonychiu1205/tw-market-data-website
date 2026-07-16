import type { Prisma, PrismaClient } from "@prisma/client";

// The worker talks to this narrow store interface, never to Prisma directly. That is what lets the
// full poll → fan-out → retry → disable pipeline be driven end-to-end in tests against an in-memory
// store (no live DB), while production uses the Prisma-backed store below. Same logic, both paths.

export type DestinationWithSubs = {
  id: string;
  status: string;
  subscriptions: Array<{ eventTypes: string[]; symbolFilter: string[] }>;
};

export type EnsureDeliveryInput = {
  eventId: string;
  destinationId: string;
  eventType: string;
  schemaVer: number;
  payload: unknown; // the delivery envelope (frozen §4 payload under `data` + routing metadata)
};

export type DueDelivery = {
  id: string;
  eventId: string;
  destinationId: string;
  attempt: number;
  firstAttemptedAt: Date | null;
  payload: unknown;
  destination: {
    id: string;
    url: string;
    status: string;
    encryptedSigningSecret: string;
    userEmail: string | null;
  };
};

export type RecordSuccessInput = {
  id: string;
  attempt: number;
  statusCode: number | null;
  latencyMs: number;
  at: Date;
};

export type RecordRetryInput = {
  id: string;
  attempt: number;
  statusCode: number | null;
  latencyMs: number;
  error: string | null;
  nextAttemptAt: Date;
  firstAttemptedAt: Date;
  lastAttemptedAt: Date;
};

export type RecordDeadInput = {
  id: string;
  destinationId: string;
  attempt: number;
  statusCode: number | null;
  latencyMs: number;
  error: string | null;
  lastAttemptedAt: Date;
  disabledReason: string;
  at: Date;
};

export interface DeliveryStore {
  getCursor(source: string): Promise<string>;
  setCursor(source: string, lastCreatedAt: string): Promise<void>;
  listActiveDestinationsWithSubs(): Promise<DestinationWithSubs[]>;
  // Idempotent: creates the delivery only if (eventId, destinationId) does not already exist. This is
  // the durability point — once a delivery row exists, a crash can never drop it.
  ensureDelivery(input: EnsureDeliveryInput): Promise<void>;
  claimDueDeliveries(now: Date, limit: number): Promise<DueDelivery[]>;
  recordSuccess(input: RecordSuccessInput): Promise<void>;
  recordRetry(input: RecordRetryInput): Promise<void>;
  // Marks the delivery dead AND disables the destination atomically (§A3).
  recordDeadAndDisable(input: RecordDeadInput): Promise<void>;
}

const CURSOR_SOURCE_DEFAULT = "events_outbox";
export { CURSOR_SOURCE_DEFAULT };

export class PrismaDeliveryStore implements DeliveryStore {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getCursor(source: string): Promise<string> {
    const row = await this.prisma.webhookOutboxCursor.findUnique({ where: { source } });
    return row?.lastCreatedAt ?? "";
  }

  async setCursor(source: string, lastCreatedAt: string): Promise<void> {
    await this.prisma.webhookOutboxCursor.upsert({
      where: { source },
      create: { source, lastCreatedAt },
      update: { lastCreatedAt },
    });
  }

  async listActiveDestinationsWithSubs(): Promise<DestinationWithSubs[]> {
    const rows = await this.prisma.webhookDestination.findMany({
      where: { status: "active" },
      select: {
        id: true,
        status: true,
        subscriptions: { select: { eventTypes: true, symbolFilter: true } },
      },
    });
    return rows;
  }

  async ensureDelivery(input: EnsureDeliveryInput): Promise<void> {
    await this.prisma.webhookDelivery.upsert({
      where: { eventId_destinationId: { eventId: input.eventId, destinationId: input.destinationId } },
      create: {
        eventId: input.eventId,
        destinationId: input.destinationId,
        eventType: input.eventType,
        schemaVer: input.schemaVer,
        payload: input.payload as Prisma.InputJsonValue,
        status: "active",
      },
      update: {}, // already fanned out — do nothing (idempotent)
    });
  }

  async claimDueDeliveries(now: Date, limit: number): Promise<DueDelivery[]> {
    const rows = await this.prisma.webhookDelivery.findMany({
      where: {
        status: { in: ["active", "retrying"] },
        nextAttemptAt: { lte: now },
        destination: { status: "active" },
      },
      orderBy: { nextAttemptAt: "asc" },
      take: limit,
      select: {
        id: true,
        eventId: true,
        destinationId: true,
        attempt: true,
        firstAttemptedAt: true,
        payload: true,
        destination: {
          select: {
            id: true,
            url: true,
            status: true,
            encryptedSigningSecret: true,
            user: { select: { email: true } },
          },
        },
      },
    });
    return rows.map((row) => ({
      id: row.id,
      eventId: row.eventId,
      destinationId: row.destinationId,
      attempt: row.attempt,
      firstAttemptedAt: row.firstAttemptedAt,
      payload: row.payload,
      destination: {
        id: row.destination.id,
        url: row.destination.url,
        status: row.destination.status,
        encryptedSigningSecret: row.destination.encryptedSigningSecret,
        userEmail: row.destination.user?.email ?? null,
      },
    }));
  }

  async recordSuccess(input: RecordSuccessInput): Promise<void> {
    await this.prisma.webhookDelivery.update({
      where: { id: input.id },
      data: {
        status: "delivered",
        attempt: input.attempt,
        statusCode: input.statusCode,
        latencyMs: input.latencyMs,
        error: null,
        deliveredAt: input.at,
        lastAttemptedAt: input.at,
      },
    });
  }

  async recordRetry(input: RecordRetryInput): Promise<void> {
    await this.prisma.webhookDelivery.update({
      where: { id: input.id },
      data: {
        status: "retrying",
        attempt: input.attempt,
        statusCode: input.statusCode,
        latencyMs: input.latencyMs,
        error: input.error,
        nextAttemptAt: input.nextAttemptAt,
        firstAttemptedAt: input.firstAttemptedAt,
        lastAttemptedAt: input.lastAttemptedAt,
      },
    });
  }

  async recordDeadAndDisable(input: RecordDeadInput): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.webhookDelivery.update({
        where: { id: input.id },
        data: {
          status: "dead",
          attempt: input.attempt,
          statusCode: input.statusCode,
          latencyMs: input.latencyMs,
          error: input.error,
          lastAttemptedAt: input.lastAttemptedAt,
        },
      }),
      this.prisma.webhookDestination.update({
        where: { id: input.destinationId },
        data: { status: "disabled", disabledReason: input.disabledReason, disabledAt: input.at },
      }),
    ]);
  }
}
