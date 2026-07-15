import type { OutboxEvent } from "@/src/lib/webhooks/outbox-source";

// Which subscriptions want a given event. Pure, so it is unit-tested in isolation.
//
// Rules (§A2/§A3):
//   - the subscription's eventTypes must include the event's type;
//   - symbolFilter empty/absent = "all symbols";
//   - a non-empty symbolFilter matches only when the event HAS a symbol and it is listed. A symbol-less
//     event (e.g. catalog.dataset_listed) therefore never matches a symbol-filtered subscription.

export type SubscriptionMatchInput = {
  eventTypes: string[];
  symbolFilter: string[];
};

export function subscriptionMatchesEvent(
  subscription: SubscriptionMatchInput,
  event: Pick<OutboxEvent, "eventType" | "symbol">,
): boolean {
  if (!subscription.eventTypes.includes(event.eventType)) return false;
  if (subscription.symbolFilter.length === 0) return true;
  if (!event.symbol) return false;
  return subscription.symbolFilter.includes(event.symbol);
}

// A destination is a fan-out target for an event when it is active and at least one of its
// subscriptions matches. Exactly one delivery is created per (event, destination) regardless of how
// many of its subscriptions match — dedupe is the DB unique constraint (eventId, destinationId).
export function destinationWantsEvent(
  destination: { status: string; subscriptions: SubscriptionMatchInput[] },
  event: Pick<OutboxEvent, "eventType" | "symbol">,
): boolean {
  if (destination.status !== "active") return false;
  return destination.subscriptions.some((sub) => subscriptionMatchesEvent(sub, event));
}
