import type { AppLocale } from "@/src/i18n/locales";

export type SubscriptionStatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export type SubscriptionStatusInput = {
  status: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: Date | null;
};

function hasFuturePeriodEnd(currentPeriodEnd: Date | null | undefined) {
  if (!currentPeriodEnd) {
    return false;
  }

  const periodEnd = currentPeriodEnd.getTime();
  return Number.isFinite(periodEnd) && periodEnd > Date.now();
}

export function getSubscriptionStatusLabel(status: string, cancelAtPeriodEnd = false, locale: AppLocale = "zh-TW") {
  const normalized = status.toLowerCase();
  const isEn = locale === "en";

  if (cancelAtPeriodEnd && (normalized === "active" || normalized === "cancelled")) {
    return isEn ? "Cancellation scheduled" : "已排定取消";
  }

  if (normalized === "pending") return isEn ? "Confirming payment authorization" : "付款授權確認中";
  if (normalized === "active") return isEn ? "Active" : "使用中";
  if (normalized === "cancelled") return isEn ? "Cancelled" : "已取消";
  if (normalized === "past_due") return isEn ? "Payment issue" : "付款異常";
  if (normalized === "failed") return isEn ? "Payment failed" : "付款失敗";

  return isEn ? "Status pending" : "狀態待確認";
}

export function getSubscriptionStatusDescription(subscription: SubscriptionStatusInput, locale: AppLocale = "zh-TW") {
  const normalized = subscription.status.toLowerCase();
  const hasFuture = hasFuturePeriodEnd(subscription.currentPeriodEnd);
  const isEn = locale === "en";

  if (normalized === "pending") {
    return isEn
      ? "Waiting for the payment provider to return the authorization result."
      : "系統正在等待付款服務回傳授權結果。";
  }

  if (normalized === "active" && subscription.cancelAtPeriodEnd) {
    if (hasFuture) {
      return isEn
        ? "No further automatic charges — service remains available until the end of the current period."
        : "後續不會再自動扣款，服務可使用至目前週期結束。";
    }
    return isEn
      ? "Cancellation is scheduled; the access period will update based on payment status."
      : "已排定取消，系統將依付款狀態更新使用期限。";
  }

  if (normalized === "active") {
    return isEn ? "Your plan is currently active." : "你的方案目前有效。";
  }

  if (normalized === "cancelled") {
    if (hasFuture) {
      return isEn
        ? "No further automatic charges — service remains available until the end of the current period."
        : "後續不會再自動扣款，服務可使用至目前週期結束。";
    }
    return isEn
      ? "This plan has been cancelled; the access period will update based on payment status."
      : "此方案已取消，系統將依付款狀態更新使用期限。";
  }

  if (normalized === "past_due") {
    return isEn
      ? "The most recent charge did not go through. Please update your payment method or contact us."
      : "最近一次扣款未成功，請更新付款方式或聯繫我們。";
  }

  if (normalized === "failed") {
    return isEn
      ? "Payment did not complete. Please choose a plan again or contact us."
      : "付款未完成，請重新選擇方案或聯繫我們。";
  }

  return isEn ? "We're syncing the latest status — please try again shortly." : "我們正在同步最新狀態，請稍後再試。";
}

export function getSubscriptionStatusTone(status: string, cancelAtPeriodEnd = false): SubscriptionStatusTone {
  const normalized = status.toLowerCase();

  if (cancelAtPeriodEnd && (normalized === "active" || normalized === "cancelled")) {
    return "warning";
  }

  if (normalized === "pending") return "info";
  if (normalized === "active") return "success";
  if (normalized === "cancelled") return "neutral";
  if (normalized === "past_due") return "warning";
  if (normalized === "failed") return "danger";

  return "neutral";
}

export function isSubscriptionCancelable(subscription: SubscriptionStatusInput) {
  const normalized = subscription.status.toLowerCase();
  return normalized === "active" && !subscription.cancelAtPeriodEnd;
}

export function needsPlanRetryAction(status: string) {
  const normalized = status.toLowerCase();
  return normalized === "past_due" || normalized === "failed";
}

export function isPendingAuthorization(status: string) {
  return status.toLowerCase() === "pending";
}
