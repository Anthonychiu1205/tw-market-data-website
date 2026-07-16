import "server-only";

import type { OutboxEvent, OutboxSource } from "@/src/lib/webhooks/outbox-source";
import type { DeliveryStore } from "@/src/lib/webhooks/store";
import { CURSOR_SOURCE_DEFAULT } from "@/src/lib/webhooks/store";
import { destinationWantsEvent } from "@/src/lib/webhooks/matching";
import { signWebhook } from "@/src/lib/webhooks/signing";
import { postWebhook, type WebhookSender } from "@/src/lib/webhooks/delivery";
import { isRetryBudgetExhausted, MAX_ATTEMPTS, nextBackoffMs } from "@/src/lib/webhooks/backoff";
import { decryptSigningSecret } from "@/src/lib/webhooks/signing-secret";
import { sendDestinationDisabledEmail, type DestinationDisabledEmail } from "@/src/lib/webhooks/email";

// §A3 delivery worker. Two phases per run:
//   1. INGEST — poll the outbox from the cursor, fan out one durable delivery per (event, matching
//      active destination), THEN advance the cursor. Because the cursor only advances after every
//      delivery row is committed, a crash mid-run re-polls the same events and re-inserts them
//      conflict-free — this is what makes a kill/restart zero-drop.
//   2. DELIVER — pick due deliveries (new + retries), sign (Standard Webhooks), POST (SSRF-guarded),
//      record the outcome. On failure: exponential backoff + jitter up to 8 attempts / 24h, then the
//      destination is disabled and the owner emailed.
//
// Semantics: at-least-once, NOT ordered. Receivers dedupe on webhook-id (== event_id).

export type WebhookWorkerDeps = {
  store: DeliveryStore;
  outbox: OutboxSource;
  sender?: WebhookSender;
  sendDisabledEmail?: DestinationDisabledEmail;
  decryptSecret?: (encrypted: string) => string;
  now?: () => Date;
  random?: () => number;
  source?: string;
  pollBatch?: number;
  deliverBatch?: number;
};

export type IngestResult = { polled: number; fannedOut: number; cursor: string };
export type DeliverResult = { attempted: number; delivered: number; retried: number; disabled: number };
export type WorkerRunResult = IngestResult & DeliverResult;

// The wire body. `data` is the frozen §4 payload verbatim (push == pull, no double truth); the rest is
// routing metadata read straight off the outbox row. This whole object is the signed body.
export function buildDeliveryEnvelope(event: OutboxEvent): Record<string, unknown> {
  return {
    id: event.eventId,
    type: event.eventType,
    occurred_at: event.occurredAt,
    dataset: event.dataset,
    symbol: event.symbol,
    schema_ver: event.schemaVer,
    data: event.payload,
  };
}

function resolveDeps(deps: WebhookWorkerDeps) {
  return {
    store: deps.store,
    outbox: deps.outbox,
    sender: deps.sender ?? postWebhook,
    sendDisabledEmail: deps.sendDisabledEmail ?? sendDestinationDisabledEmail,
    decryptSecret: deps.decryptSecret ?? decryptSigningSecret,
    now: deps.now ?? (() => new Date()),
    random: deps.random ?? Math.random,
    source: deps.source ?? CURSOR_SOURCE_DEFAULT,
    pollBatch: deps.pollBatch ?? 200,
    deliverBatch: deps.deliverBatch ?? 100,
  };
}

export async function ingestOutbox(deps: WebhookWorkerDeps): Promise<IngestResult> {
  const d = resolveDeps(deps);
  const cursor = await d.store.getCursor(d.source);
  const events = await d.outbox.poll({ cursor, batch: d.pollBatch });
  if (events.length === 0) {
    return { polled: 0, fannedOut: 0, cursor };
  }

  const destinations = await d.store.listActiveDestinationsWithSubs();

  let fannedOut = 0;
  for (const event of events) {
    const envelope = buildDeliveryEnvelope(event);
    for (const destination of destinations) {
      if (!destinationWantsEvent(destination, event)) continue;
      await d.store.ensureDelivery({
        eventId: event.eventId,
        destinationId: destination.id,
        eventType: event.eventType,
        schemaVer: event.schemaVer,
        payload: envelope,
      });
      fannedOut += 1;
    }
  }

  // events are ORDER BY created_at ASC, so the last one carries the high-water mark. Advance the cursor
  // ONLY now — every delivery above is already durable, so nothing polled here can be lost on a crash.
  const maxCreatedAt = events[events.length - 1].createdAt;
  await d.store.setCursor(d.source, maxCreatedAt);
  return { polled: events.length, fannedOut, cursor: maxCreatedAt };
}

export async function deliverDue(deps: WebhookWorkerDeps): Promise<DeliverResult> {
  const d = resolveDeps(deps);
  const now = d.now();
  const due = await d.store.claimDueDeliveries(now, d.deliverBatch);

  let delivered = 0;
  let retried = 0;
  let disabled = 0;

  for (const delivery of due) {
    const attempt = delivery.attempt + 1;
    const at = d.now();
    const body = JSON.stringify(delivery.payload);

    let outcome: { ok: boolean; statusCode: number | null; latencyMs: number; error: string | null };
    try {
      const secret = d.decryptSecret(delivery.destination.encryptedSigningSecret);
      const headers = signWebhook({ secret, messageId: delivery.eventId, timestamp: at, body });
      outcome = await d.sender({ url: delivery.destination.url, headers, body });
    } catch {
      // Secret undecryptable / signing failed — a config fault, not the receiver's. Count it as a
      // failed attempt so it backs off (and eventually surfaces via disable) rather than hot-looping.
      outcome = { ok: false, statusCode: null, latencyMs: 0, error: "signing_error" };
    }

    if (outcome.ok) {
      await d.store.recordSuccess({
        id: delivery.id,
        attempt,
        statusCode: outcome.statusCode,
        latencyMs: outcome.latencyMs,
        at,
      });
      delivered += 1;
      continue;
    }

    const firstAttemptedAt = delivery.firstAttemptedAt ?? at;
    if (isRetryBudgetExhausted({ attempt, firstAttemptedAt, now: at })) {
      const reason = `delivery_failed_after_${attempt}_attempts (last: ${outcome.error ?? "unknown"})`;
      await d.store.recordDeadAndDisable({
        id: delivery.id,
        destinationId: delivery.destinationId,
        attempt,
        statusCode: outcome.statusCode,
        latencyMs: outcome.latencyMs,
        error: outcome.error,
        lastAttemptedAt: at,
        disabledReason: reason,
        at,
      });
      disabled += 1;
      if (delivery.destination.userEmail) {
        await d.sendDisabledEmail({
          to: delivery.destination.userEmail,
          destinationUrl: delivery.destination.url,
          reason,
        });
      }
      continue;
    }

    const delayMs = nextBackoffMs(attempt, d.random);
    await d.store.recordRetry({
      id: delivery.id,
      attempt,
      statusCode: outcome.statusCode,
      latencyMs: outcome.latencyMs,
      error: outcome.error,
      nextAttemptAt: new Date(at.getTime() + delayMs),
      firstAttemptedAt,
      lastAttemptedAt: at,
    });
    retried += 1;
  }

  return { attempted: due.length, delivered, retried, disabled };
}

export async function runWebhookWorker(deps: WebhookWorkerDeps): Promise<WorkerRunResult> {
  const ingest = await ingestOutbox(deps);
  const deliver = await deliverDue(deps);
  return { ...ingest, ...deliver };
}

export { MAX_ATTEMPTS };
