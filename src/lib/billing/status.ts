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

export function getSubscriptionStatusLabel(status: string, cancelAtPeriodEnd = false) {
  const normalized = status.toLowerCase();

  if (cancelAtPeriodEnd && (normalized === "active" || normalized === "cancelled")) {
    return "已排定取消";
  }

  if (normalized === "pending") return "付款授權確認中";
  if (normalized === "active") return "使用中";
  if (normalized === "cancelled") return "已取消";
  if (normalized === "past_due") return "付款異常";
  if (normalized === "failed") return "付款失敗";

  return "狀態待確認";
}

export function getSubscriptionStatusDescription(subscription: SubscriptionStatusInput) {
  const normalized = subscription.status.toLowerCase();
  const hasFuture = hasFuturePeriodEnd(subscription.currentPeriodEnd);

  if (normalized === "pending") {
    return "系統正在等待付款服務回傳授權結果。";
  }

  if (normalized === "active" && subscription.cancelAtPeriodEnd) {
    if (hasFuture) {
      return "後續不會再自動扣款，服務可使用至目前週期結束。";
    }
    return "已排定取消，系統將依付款狀態更新使用期限。";
  }

  if (normalized === "active") {
    return "你的方案目前有效。";
  }

  if (normalized === "cancelled") {
    if (hasFuture) {
      return "後續不會再自動扣款，服務可使用至目前週期結束。";
    }
    return "此方案已取消，系統將依付款狀態更新使用期限。";
  }

  if (normalized === "past_due") {
    return "最近一次扣款未成功，請更新付款方式或聯繫我們。";
  }

  if (normalized === "failed") {
    return "付款未完成，請重新選擇方案或聯繫我們。";
  }

  return "我們正在同步最新狀態，請稍後再試。";
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
