import test from "node:test";
import assert from "node:assert/strict";

import { Webhook } from "standardwebhooks";
import { ingestOutbox, deliverDue, runWebhookWorker } from "../src/lib/webhooks/worker.ts";
import { generateSigningSecret } from "../src/lib/webhooks/signing-secret.ts";
import { MAX_ATTEMPTS } from "../src/lib/webhooks/backoff.ts";

// A real whsec_ secret (valid base64 body) so the official signing lib inside the worker signs cleanly.
const VALID_SECRET = generateSigningSecret();

// An in-memory DeliveryStore (structurally identical to PrismaDeliveryStore) so the FULL worker
// pipeline — poll → fan-out → deliver → retry/backoff → disable — runs deterministically with no DB.
// The unique (eventId, destinationId) constraint is modelled by `byKey`, which is exactly what makes a
// kill/restart zero-drop.
function makeStore() {
  const deliveries = new Map();
  const byKey = new Map();
  const destinations = new Map();
  let cursor = "";
  let seq = 0;
  return {
    deliveries,
    destinations,
    addDestination(d) {
      destinations.set(d.id, { disabledReason: null, disabledAt: null, ...d });
    },
    async getCursor() {
      return cursor;
    },
    async setCursor(_s, c) {
      cursor = c;
    },
    async listActiveDestinationsWithSubs() {
      return [...destinations.values()]
        .filter((d) => d.status === "active")
        .map((d) => ({ id: d.id, status: d.status, subscriptions: d.subscriptions }));
    },
    async ensureDelivery(input) {
      const key = `${input.eventId}::${input.destinationId}`;
      if (byKey.has(key)) return; // idempotent — the zero-drop guarantee
      const id = `dlv_${++seq}`;
      byKey.set(key, id);
      deliveries.set(id, {
        id,
        eventId: input.eventId,
        destinationId: input.destinationId,
        eventType: input.eventType,
        schemaVer: input.schemaVer,
        payload: input.payload,
        status: "active",
        attempt: 0,
        nextAttemptAt: new Date(0),
        firstAttemptedAt: null,
        statusCode: null,
        latencyMs: null,
        error: null,
        deliveredAt: null,
      });
    },
    async claimDueDeliveries(now, limit) {
      return [...deliveries.values()]
        .filter(
          (d) =>
            (d.status === "active" || d.status === "retrying") &&
            d.nextAttemptAt.getTime() <= now.getTime() &&
            destinations.get(d.destinationId)?.status === "active",
        )
        .sort((a, b) => a.nextAttemptAt - b.nextAttemptAt)
        .slice(0, limit)
        .map((d) => {
          const dest = destinations.get(d.destinationId);
          return {
            id: d.id,
            eventId: d.eventId,
            destinationId: d.destinationId,
            attempt: d.attempt,
            firstAttemptedAt: d.firstAttemptedAt,
            payload: d.payload,
            destination: {
              id: dest.id,
              url: dest.url,
              status: dest.status,
              encryptedSigningSecret: dest.encryptedSigningSecret,
              userEmail: dest.userEmail,
            },
          };
        });
    },
    async recordSuccess(i) {
      Object.assign(deliveries.get(i.id), {
        status: "delivered",
        attempt: i.attempt,
        statusCode: i.statusCode,
        latencyMs: i.latencyMs,
        error: null,
        deliveredAt: i.at,
        lastAttemptedAt: i.at,
      });
    },
    async recordRetry(i) {
      Object.assign(deliveries.get(i.id), {
        status: "retrying",
        attempt: i.attempt,
        statusCode: i.statusCode,
        latencyMs: i.latencyMs,
        error: i.error,
        nextAttemptAt: i.nextAttemptAt,
        firstAttemptedAt: i.firstAttemptedAt,
        lastAttemptedAt: i.lastAttemptedAt,
      });
    },
    async recordDeadAndDisable(i) {
      Object.assign(deliveries.get(i.id), {
        status: "dead",
        attempt: i.attempt,
        statusCode: i.statusCode,
        latencyMs: i.latencyMs,
        error: i.error,
        lastAttemptedAt: i.lastAttemptedAt,
      });
      const dest = destinations.get(i.destinationId);
      dest.status = "disabled";
      dest.disabledReason = i.disabledReason;
      dest.disabledAt = i.at;
    },
  };
}

function makeOutbox(events) {
  return {
    async poll({ cursor, batch }) {
      return events
        .filter((e) => e.createdAt > cursor)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .slice(0, batch);
    },
  };
}

function revenueEvent(id, symbol, createdAt, dataAsOf) {
  return {
    eventId: id,
    eventType: "revenue.announced",
    occurredAt: createdAt,
    dataset: "monthly-revenue",
    symbol,
    payload: { schema_ver: 1, symbol, revenue_month: "2026-06", revenue: 331109, data_as_of: dataAsOf },
    schemaVer: 1,
    createdAt,
  };
}

test("fan-out honours event-type + delivers the frozen payload verbatim (push == pull), signed", async () => {
  const store = makeStore();
  const rawSecret = generateSigningSecret();
  store.addDestination({
    id: "dest_1",
    url: "https://1.1.1.1/hook",
    status: "active",
    encryptedSigningSecret: "enc",
    userEmail: "owner@example.com",
    subscriptions: [{ eventTypes: ["revenue.announced", "catalog.dataset_listed"], symbolFilter: [] }],
  });

  const events = [
    revenueEvent("evt_rev", "2330", "2026-07-10T00:00:00Z", "2026-07-10"),
    {
      eventId: "evt_fil",
      eventType: "filing.announced", // NOT subscribed
      occurredAt: "2026-07-10T01:00:00Z",
      dataset: "financial-statements",
      symbol: "2330",
      payload: { schema_ver: 1, statement: "income" },
      schemaVer: 1,
      createdAt: "2026-07-10T01:00:00Z",
    },
    {
      eventId: "evt_cat",
      eventType: "catalog.dataset_listed",
      occurredAt: "2026-07-10T02:00:00Z",
      dataset: "derivatives-market",
      symbol: null,
      payload: { schema_ver: 1, dataset: "derivatives-market", reconciliation_badge: "green" },
      schemaVer: 1,
      createdAt: "2026-07-10T02:00:00Z",
    },
  ];

  const sent = [];
  const result = await runWebhookWorker({
    store,
    outbox: makeOutbox(events),
    decryptSecret: () => rawSecret,
    sender: async ({ url, headers, body }) => {
      sent.push({ url, headers, body });
      return { ok: true, statusCode: 200, latencyMs: 5, error: null };
    },
  });

  assert.equal(result.fannedOut, 2, "only the 2 subscribed events fan out");
  assert.equal(result.delivered, 2);
  const types = sent.map((s) => JSON.parse(s.body).type).sort();
  assert.deepEqual(types, ["catalog.dataset_listed", "revenue.announced"]);

  // push == pull: the delivered `data` is the outbox payload verbatim, incl. the same data_as_of.
  const rev = sent.find((s) => JSON.parse(s.body).type === "revenue.announced");
  const body = JSON.parse(rev.body);
  assert.equal(body.data.data_as_of, "2026-07-10");
  assert.equal(body.data.revenue, 331109);
  assert.equal(rev.headers["webhook-id"], "evt_rev");

  // The delivered body verifies under the official library with the destination's secret (§A4 × §A3).
  const wh = new Webhook(rawSecret);
  assert.doesNotThrow(() => wh.verify(rev.body, rev.headers));
});

test("symbol filter: only listed tickers are delivered", async () => {
  const store = makeStore();
  store.addDestination({
    id: "dest_sym",
    url: "https://1.1.1.1/hook",
    status: "active",
    encryptedSigningSecret: "enc",
    userEmail: "o@example.com",
    subscriptions: [{ eventTypes: ["revenue.announced"], symbolFilter: ["2454"] }],
  });
  const events = [
    revenueEvent("r2330", "2330", "2026-07-10T00:00:00Z", "2026-07-10"),
    revenueEvent("r2454", "2454", "2026-07-10T00:01:00Z", "2026-07-10"),
  ];
  const sent = [];
  await runWebhookWorker({
    store,
    outbox: makeOutbox(events),
    decryptSecret: () => VALID_SECRET,
    sender: async (r) => {
      sent.push(JSON.parse(r.body).data.symbol);
      return { ok: true, statusCode: 200, latencyMs: 1, error: null };
    },
  });
  assert.deepEqual(sent, ["2454"]);
});

test("kill/restart is zero-drop: re-poll dedupes, killed-before-deliver still delivers", async () => {
  const store = makeStore();
  store.addDestination({
    id: "dest_zd",
    url: "https://1.1.1.1/hook",
    status: "active",
    encryptedSigningSecret: "enc",
    userEmail: "o@example.com",
    subscriptions: [{ eventTypes: ["revenue.announced"], symbolFilter: [] }],
  });
  const events = [
    revenueEvent("z1", "2330", "2026-07-10T00:00:00Z", "2026-07-10"),
    revenueEvent("z2", "2330", "2026-07-10T00:01:00Z", "2026-07-10"),
    revenueEvent("z3", "2330", "2026-07-10T00:02:00Z", "2026-07-10"),
  ];
  const outbox = makeOutbox(events);

  // Worker instance #1: ingest only, then "crash" before delivering anything.
  await ingestOutbox({ store, outbox });
  assert.equal(store.deliveries.size, 3, "all 3 events fanned out to durable rows");
  assert.equal([...store.deliveries.values()].every((d) => d.status === "active"), true);

  // Simulate a crash BEFORE the cursor commit: reset the cursor and re-ingest. The unique constraint
  // must dedupe — no duplicate deliveries.
  await store.setCursor("events_outbox", "");
  await ingestOutbox({ store, outbox });
  assert.equal(store.deliveries.size, 3, "re-poll after crash does NOT duplicate deliveries");

  // Worker instance #2 (restart): deliver. Nothing was lost — all 3 go out.
  let delivered = 0;
  await deliverDue({
    store,
    outbox,
    decryptSecret: () => VALID_SECRET,
    sender: async () => {
      delivered += 1;
      return { ok: true, statusCode: 200, latencyMs: 1, error: null };
    },
  });
  assert.equal(delivered, 3);
  assert.equal([...store.deliveries.values()].every((d) => d.status === "delivered"), true, "zero drop");
});

test("a mid-batch send failure is retried, not dropped", async () => {
  const store = makeStore();
  store.addDestination({
    id: "dest_mid",
    url: "https://1.1.1.1/hook",
    status: "active",
    encryptedSigningSecret: "enc",
    userEmail: "o@example.com",
    subscriptions: [{ eventTypes: ["revenue.announced"], symbolFilter: [] }],
  });
  const events = [
    revenueEvent("m1", "2330", "2026-07-10T00:00:00Z", "2026-07-10"),
    revenueEvent("m2", "2454", "2026-07-10T00:01:00Z", "2026-07-10"),
  ];
  let n = 0;
  await runWebhookWorker({
    store,
    outbox: makeOutbox(events),
    decryptSecret: () => VALID_SECRET,
    random: () => 0.5,
    sender: async () => {
      n += 1;
      if (n === 1) throw new Error("connection reset"); // first one "killed"
      return { ok: true, statusCode: 200, latencyMs: 1, error: null };
    },
  });
  const statuses = [...store.deliveries.values()].map((d) => d.status).sort();
  assert.deepEqual(statuses, ["delivered", "retrying"], "the failed one is retrying, never lost");
});

test("500 injection → exponential backoff → auto-disable + one email", async () => {
  const store = makeStore();
  store.addDestination({
    id: "dest_500",
    url: "https://1.1.1.1/hook",
    status: "active",
    encryptedSigningSecret: "enc",
    userEmail: "owner500@example.com",
    subscriptions: [{ eventTypes: ["revenue.announced"], symbolFilter: [] }],
  });
  const events = [revenueEvent("e500", "2330", "2026-07-10T00:00:00Z", "2026-07-10")];

  const emails = [];
  const clock = { t: new Date("2026-07-10T00:00:00Z") };
  const deps = {
    store,
    outbox: makeOutbox(events),
    decryptSecret: () => VALID_SECRET,
    random: () => 0.5,
    now: () => clock.t,
    sendDisabledEmail: async (m) => {
      emails.push(m);
      return { ok: true };
    },
    sender: async () => ({ ok: false, statusCode: 500, latencyMs: 2, error: "http_500" }),
  };

  await ingestOutbox(deps);
  const backoffGaps = [];
  let disabled = false;
  for (let i = 0; i < 20 && !disabled; i += 1) {
    const attemptAt = clock.t.getTime();
    await deliverDue(deps);
    const d = [...store.deliveries.values()][0];
    if (d.status === "retrying") {
      // Pure backoff delay = when the next retry is due minus when this attempt ran.
      backoffGaps.push(d.nextAttemptAt.getTime() - attemptAt);
      // Advance the clock to exactly when this retry is due, so total elapsed stays under 24h and the
      // 8-attempt count guard (not the 24h window) is what ends it.
      clock.t = new Date(d.nextAttemptAt.getTime());
    }
    disabled = store.destinations.get("dest_500").status === "disabled";
  }

  const delivery = [...store.deliveries.values()][0];
  assert.equal(delivery.status, "dead");
  assert.equal(delivery.attempt, MAX_ATTEMPTS, "gave up after exactly 8 attempts");
  assert.equal(store.destinations.get("dest_500").status, "disabled");
  assert.match(store.destinations.get("dest_500").disabledReason, /delivery_failed_after_8/);
  assert.equal(emails.length, 1, "owner emailed exactly once");
  assert.equal(emails[0].to, "owner500@example.com");
  // backoff is non-decreasing across the early attempts (exponential until the cap)
  for (let i = 1; i < Math.min(backoffGaps.length, 5); i += 1) {
    assert.ok(backoffGaps[i] >= backoffGaps[i - 1], `backoff should grow: ${backoffGaps}`);
  }
});

test("24h window disables even before 8 attempts", async () => {
  const store = makeStore();
  store.addDestination({
    id: "dest_24h",
    url: "https://1.1.1.1/hook",
    status: "active",
    encryptedSigningSecret: "enc",
    userEmail: "o@example.com",
    subscriptions: [{ eventTypes: ["revenue.announced"], symbolFilter: [] }],
  });
  const events = [revenueEvent("w1", "2330", "2026-07-10T00:00:00Z", "2026-07-10")];
  const clock = { t: new Date("2026-07-10T00:00:00Z") };
  const deps = {
    store,
    outbox: makeOutbox(events),
    decryptSecret: () => VALID_SECRET,
    random: () => 0.5,
    now: () => clock.t,
    sendDisabledEmail: async () => ({ ok: true }),
    sender: async () => ({ ok: false, statusCode: 500, latencyMs: 1, error: "http_500" }),
  };
  await ingestOutbox(deps);
  await deliverDue(deps); // attempt 1 → retrying, firstAttemptedAt = t0
  assert.equal([...store.deliveries.values()][0].status, "retrying");

  clock.t = new Date(clock.t.getTime() + 25 * 60 * 60 * 1000); // 25h later
  await deliverDue(deps); // attempt 2, but window exhausted → dead + disabled
  assert.equal([...store.deliveries.values()][0].status, "dead");
  assert.equal([...store.deliveries.values()][0].attempt, 2, "disabled by the 24h window, not the count");
  assert.equal(store.destinations.get("dest_24h").status, "disabled");
});
