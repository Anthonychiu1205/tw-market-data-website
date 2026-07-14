import "server-only";

import { Polar } from "@polar-sh/sdk";

import type { CreditPackCode } from "@/src/lib/billing/credit-packs";

/**
 * Paid tiers that map to a Polar subscription product. These keys match the read
 * API canonical plan ladder (starter/pro/max/developer) and the Polar product
 * `metadata.plan_id`, so the shared Polar webhook resolves the plan correctly.
 */
export type PolarPaidPlanCode = "starter" | "pro" | "max" | "developer";

const POLAR_PAID_PLAN_CODES: readonly PolarPaidPlanCode[] = ["starter", "pro", "max", "developer"];

const PRODUCT_ENV_BY_PLAN: Record<PolarPaidPlanCode, string> = {
  starter: "POLAR_PRODUCT_ID_STARTER",
  pro: "POLAR_PRODUCT_ID_PRO",
  max: "POLAR_PRODUCT_ID_MAX",
  developer: "POLAR_PRODUCT_ID_DEVELOPER",
};

export function isPolarPaidPlanCode(value: string): value is PolarPaidPlanCode {
  return (POLAR_PAID_PLAN_CODES as readonly string[]).includes(value);
}

/**
 * Build a Polar API client. Production is the default; set POLAR_API_BASE to the
 * sandbox base URL only for testing. The access token is read from the deployment
 * environment and never logged.
 */
export function getPolarClient(): Polar {
  const accessToken = process.env.POLAR_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    throw new Error("POLAR_ACCESS_TOKEN is not configured");
  }

  const apiBase = process.env.POLAR_API_BASE?.trim();
  if (apiBase) {
    return new Polar({ accessToken, serverURL: apiBase });
  }
  return new Polar({ accessToken, server: "production" });
}

export function getPolarProductId(plan: PolarPaidPlanCode): string {
  const envName = PRODUCT_ENV_BY_PLAN[plan];
  const value = process.env[envName]?.trim();
  if (!value) {
    throw new Error(`${envName} is not configured`);
  }
  return value;
}

export function getEmbedOrigin(): string | undefined {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || undefined;
}

const CREDIT_PACK_PRODUCT_ENV: Record<CreditPackCode, string> = {
  small: "POLAR_CREDIT_PACK_SMALL",
  builder: "POLAR_CREDIT_PACK_BUILDER",
  pro: "POLAR_CREDIT_PACK_PRO",
  scale: "POLAR_CREDIT_PACK_SCALE",
  bulk: "POLAR_CREDIT_PACK_BULK",
};

/** Polar product id for a prepaid credit pack. Throws when the pack is not configured. */
export function getPolarCreditPackProductId(pack: CreditPackCode): string {
  const envName = CREDIT_PACK_PRODUCT_ENV[pack];
  const value = process.env[envName]?.trim();
  if (!value) {
    throw new Error(`${envName} is not configured`);
  }
  return value;
}

/** A pack can only be offered for sale once its Polar product is configured. */
export function isCreditPackPurchasable(pack: CreditPackCode): boolean {
  return Boolean(process.env[CREDIT_PACK_PRODUCT_ENV[pack]]?.trim());
}
