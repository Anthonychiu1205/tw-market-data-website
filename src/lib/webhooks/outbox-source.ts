import "server-only";

import { neon } from "@neondatabase/serverless";

// The events_outbox lives in the READ API's database (A台 owns it, append-only). The delivery worker
// POLLS it read-only with the exact query from the interface (WEBHOOK01_OUTBOX_INTERFACE §3):
//
//   SELECT event_id, event_type, occurred_at, dataset, symbol, payload, schema_ver, created_at
//   FROM events_outbox
//   WHERE created_at > :cursor
//   ORDER BY created_at ASC
//   LIMIT :batch;
//
// We advance the cursor by created_at and NEVER write back to the outbox — delivery state is entirely
// in our WebhookDelivery table. Connection is a dedicated OUTBOX_DATABASE_URL (a read-only grant on the
// read API's DB); if it is unset the worker fails closed (no fabricated events), it never guesses.

export type OutboxEvent = {
  eventId: string;
  eventType: string;
  occurredAt: string;
  dataset: string;
  symbol: string | null;
  payload: Record<string, unknown>;
  schemaVer: number;
  createdAt: string;
};

// Injectable so the worker can be driven end-to-end in tests without a live read-API DB.
export interface OutboxSource {
  poll(input: { cursor: string; batch: number }): Promise<OutboxEvent[]>;
}

export class OutboxNotConfiguredError extends Error {
  constructor() {
    super("outbox_not_configured");
    this.name = "OutboxNotConfiguredError";
  }
}

function coercePayload(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, unknown>;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // fall through
    }
  }
  return {};
}

function normalizeRow(row: Record<string, unknown>): OutboxEvent {
  return {
    eventId: String(row.event_id),
    eventType: String(row.event_type),
    occurredAt: String(row.occurred_at),
    dataset: String(row.dataset),
    symbol: row.symbol == null ? null : String(row.symbol),
    payload: coercePayload(row.payload),
    schemaVer: Number(row.schema_ver),
    createdAt: String(row.created_at),
  };
}

// The production source: a read-only HTTP connection to the read API's Postgres.
export function createOutboxSource(connectionString = process.env.OUTBOX_DATABASE_URL): OutboxSource {
  if (!connectionString) {
    return {
      async poll() {
        throw new OutboxNotConfiguredError();
      },
    };
  }
  const sql = neon(connectionString);
  return {
    async poll({ cursor, batch }) {
      // Parameterized (no string interpolation). `created_at > ''` on the initial empty cursor returns
      // all rows, which is the correct cold-start behaviour.
      const rows = (await sql`
        SELECT event_id, event_type, occurred_at, dataset, symbol, payload, schema_ver, created_at
        FROM events_outbox
        WHERE created_at > ${cursor}
        ORDER BY created_at ASC
        LIMIT ${batch}
      `) as Record<string, unknown>[];
      return rows.map(normalizeRow);
    },
  };
}
