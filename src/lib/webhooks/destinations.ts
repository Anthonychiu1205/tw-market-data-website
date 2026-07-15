import "server-only";

import { prisma } from "@/src/lib/auth/prisma";
import { assertSafeDestinationUrl } from "@/src/lib/webhooks/ssrf";
import {
  decryptSigningSecret,
  encryptSigningSecret,
  generateSigningSecret,
  signingSecretHint,
} from "@/src/lib/webhooks/signing-secret";

// §A2 destinations/subscriptions service. Owns the account-facing lifecycle: create, list, reveal the
// signing secret (through the existing key-reveal chain — never stored or listed in plaintext), rotate,
// pause/resume/re-enable. Every write is scoped by userId so one account can never touch another's rows.

export const KNOWN_EVENT_TYPES = [
  "revenue.announced",
  "filing.announced",
  "catalog.dataset_listed",
] as const;

const DESTINATION_TYPES = new Set(["https", "discord", "slack", "email"]);

export type CreateDestinationInput = {
  userId: string;
  url: string;
  type?: string;
  eventTypes: string[];
  symbolFilter?: string[];
};

export type CreateDestinationResult =
  | {
      ok: true;
      destinationId: string;
      // The raw whsec_ secret — returned EXACTLY ONCE here, never retrievable except via reveal.
      signingSecret: string;
    }
  | { ok: false; error: string; detail?: string };

function sanitizeEventTypes(eventTypes: string[]): string[] {
  const set = new Set<string>();
  for (const raw of eventTypes) {
    const value = String(raw || "").trim();
    if ((KNOWN_EVENT_TYPES as readonly string[]).includes(value)) set.add(value);
  }
  return [...set];
}

function sanitizeSymbolFilter(symbolFilter: string[] | undefined): string[] {
  if (!symbolFilter) return [];
  const set = new Set<string>();
  for (const raw of symbolFilter) {
    const value = String(raw || "").trim().toUpperCase();
    if (value) set.add(value);
  }
  return [...set];
}

export async function createDestination(input: CreateDestinationInput): Promise<CreateDestinationResult> {
  const type = (input.type ?? "https").trim();
  if (!DESTINATION_TYPES.has(type)) {
    return { ok: false, error: "invalid_type", detail: type };
  }

  const eventTypes = sanitizeEventTypes(input.eventTypes);
  if (eventTypes.length === 0) {
    return { ok: false, error: "no_event_types" };
  }

  // The URL must pass the FULL SSRF pre-flight at creation time — https-only, resolves to public IPs.
  // (It is re-checked on every delivery too, since DNS can change later.)
  const preflight = await assertSafeDestinationUrl(input.url);
  if (!preflight.ok) {
    return { ok: false, error: "unsafe_url", detail: preflight.reason };
  }

  const rawSecret = generateSigningSecret();
  const { encrypted, version } = encryptSigningSecret(rawSecret);

  const destination = await prisma.webhookDestination.create({
    data: {
      userId: input.userId,
      url: input.url,
      type,
      encryptedSigningSecret: encrypted,
      signingSecretVersion: version,
      status: "active",
      subscriptions: {
        create: [{ eventTypes, symbolFilter: sanitizeSymbolFilter(input.symbolFilter) }],
      },
    },
    select: { id: true },
  });

  return { ok: true, destinationId: destination.id, signingSecret: rawSecret };
}

export async function listDestinations(userId: string) {
  const rows = await prisma.webhookDestination.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      url: true,
      type: true,
      status: true,
      disabledReason: true,
      disabledAt: true,
      secretRotatedAt: true,
      createdAt: true,
      encryptedSigningSecret: true,
      subscriptions: { select: { id: true, eventTypes: true, symbolFilter: true } },
    },
  });

  // Never return the raw secret in a list — only a non-secret hint (whsec_…AbCd) so the UI can label it.
  return rows.map((row) => {
    const { encryptedSigningSecret, ...rest } = row;
    let secretHint: string | null = null;
    try {
      secretHint = signingSecretHint(decryptSigningSecret(encryptedSigningSecret));
    } catch {
      secretHint = null;
    }
    return { ...rest, secretHint };
  });
}

export type RevealResult =
  | { ok: true; signingSecret: string }
  | { ok: false; error: "not_found" | "reveal_failed" };

export async function revealSigningSecret(input: { userId: string; destinationId: string }): Promise<RevealResult> {
  const row = await prisma.webhookDestination.findFirst({
    where: { id: input.destinationId, userId: input.userId },
    select: { encryptedSigningSecret: true },
  });
  if (!row) return { ok: false, error: "not_found" };
  try {
    return { ok: true, signingSecret: decryptSigningSecret(row.encryptedSigningSecret) };
  } catch {
    return { ok: false, error: "reveal_failed" };
  }
}

export type RotateResult =
  | { ok: true; signingSecret: string }
  | { ok: false; error: "not_found" };

// Rotate: issue a fresh secret, re-encrypt, stamp secretRotatedAt. Returns the new raw once. The old
// value is overwritten — after rotation the previous secret can never sign or be revealed.
export async function rotateSigningSecret(input: { userId: string; destinationId: string }): Promise<RotateResult> {
  const row = await prisma.webhookDestination.findFirst({
    where: { id: input.destinationId, userId: input.userId },
    select: { id: true },
  });
  if (!row) return { ok: false, error: "not_found" };

  const rawSecret = generateSigningSecret();
  const { encrypted, version } = encryptSigningSecret(rawSecret);
  await prisma.webhookDestination.update({
    where: { id: row.id },
    data: {
      encryptedSigningSecret: encrypted,
      signingSecretVersion: version,
      secretRotatedAt: new Date(),
    },
  });
  return { ok: true, signingSecret: rawSecret };
}

export type StatusChange = "pause" | "resume" | "enable";

// pause/resume/enable. `enable` clears a disabled state (the worker auto-disables on repeated failure);
// resume un-pauses. We never let the account set an arbitrary status string.
export async function setDestinationStatus(input: {
  userId: string;
  destinationId: string;
  action: StatusChange;
}): Promise<{ ok: boolean; error?: string }> {
  const row = await prisma.webhookDestination.findFirst({
    where: { id: input.destinationId, userId: input.userId },
    select: { id: true },
  });
  if (!row) return { ok: false, error: "not_found" };

  const status = input.action === "pause" ? "paused" : "active";
  await prisma.webhookDestination.update({
    where: { id: row.id },
    data: {
      status,
      ...(status === "active" ? { disabledReason: null, disabledAt: null } : {}),
    },
  });
  return { ok: true };
}
