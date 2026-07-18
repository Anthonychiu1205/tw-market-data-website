export type CreditsMode = "dry_run" | "charged" | "blocked";

export type CreditsDeductionRuntimeState = {
  enabled: boolean;
  requested: boolean;
  blockedInProduction: boolean;
  mode: CreditsMode;
};

const TRUTHY = new Set(["1", "true", "yes", "on"]);

function isTruthy(value: string | undefined) {
  if (!value) return false;
  return TRUTHY.has(value.trim().toLowerCase());
}

export function assertCreditsDeductionRuntimeSafe(): CreditsDeductionRuntimeState {
  const requested = isTruthy(process.env.PUBLIC_API_CREDITS_DEDUCTION_ENABLED);
  const isProduction = process.env.NODE_ENV === "production";
  const productionConfirm = isTruthy(process.env.PUBLIC_API_CREDITS_DEDUCTION_PRODUCTION_CONFIRM);

  if (!requested) {
    return {
      enabled: false,
      requested: false,
      blockedInProduction: false,
      mode: "dry_run",
    };
  }

  if (isProduction && !productionConfirm) {
    console.warn(
      "[credits-mode] deduction_requested_but_blocked: PUBLIC_API_CREDITS_DEDUCTION_PRODUCTION_CONFIRM is not enabled in production",
    );
    return {
      enabled: false,
      requested: true,
      blockedInProduction: true,
      mode: "blocked",
    };
  }

  return {
    enabled: true,
    requested: true,
    blockedInProduction: false,
    mode: "charged",
  };
}

export function isCreditsDeductionEnabled() {
  return assertCreditsDeductionRuntimeSafe().enabled;
}

function normalizeModeInput(input: boolean | CreditsDeductionRuntimeState) {
  if (typeof input === "boolean") {
    return input ? "charged" : "dry_run";
  }
  return input.mode;
}

export function getCreditsModeLabel(input: boolean | CreditsDeductionRuntimeState) {
  const mode = normalizeModeInput(input);
  if (mode === "charged") return "已扣點";
  if (mode === "blocked") return "扣點未啟用";
  return "試算模式";
}

/**
 * Label for a credits AMOUNT/column (usage table header, expanded detail, overview total).
 * It must make explicit whether the numbers are a real wallet charge or an estimate —
 * in dry_run they are the ESTIMATED cost, no wallet deduction (audit P0-2: an estimate
 * shown as a bare "credits" number was misread — even by the owner — as a real charge).
 */
export function getCreditsAmountLabel(input: boolean | CreditsDeductionRuntimeState) {
  const mode = normalizeModeInput(input);
  if (mode === "charged") return "已實扣 credits";
  if (mode === "blocked") return "credits（未啟用）";
  return "credits（試算・未實扣）";
}

export function getCreditsModeDescription(input: boolean | CreditsDeductionRuntimeState) {
  const mode = normalizeModeInput(input);
  if (mode === "charged") return "API credits 已啟用正式扣點。";
  if (mode === "blocked") return "偵測到扣點模式設定不完整，扣點未啟用。";
  return "目前 API credits 為試算模式，尚未正式扣點。";
}
