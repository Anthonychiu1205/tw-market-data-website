"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { buttonClass } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";

type CancelReasonOption = {
  value: string;
  label: string;
};

const CANCEL_REASON_OPTIONS: CancelReasonOption[] = [
  { value: "price_too_high", label: "價格太高" },
  { value: "temporarily_not_needed", label: "暫時用不到" },
  { value: "dataset_not_fit", label: "資料集不符合需求" },
  { value: "api_or_docs_issue", label: "API / 文件使用上遇到問題" },
  { value: "switching_tool_or_plan", label: "改用其他方案或工具" },
  { value: "other", label: "其他" },
];

type SubscriptionInfo = {
  id: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
};

type CancelSubscriptionDialogProps = {
  subscription: SubscriptionInfo;
};

function isCancelableStatus(status: string) {
  return status === "active";
}

export function CancelSubscriptionDialog({ subscription }: CancelSubscriptionDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canShowCancelButton = useMemo(
    () => isCancelableStatus(subscription.status) && !subscription.cancelAtPeriodEnd,
    [subscription.cancelAtPeriodEnd, subscription.status],
  );

  const disableConfirm = isSubmitting || !reason;

  async function handleConfirmCancel() {
    if (!reason || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/billing/ecpay/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          reason,
          reasonDetail: reason === "other" ? reasonDetail.trim() || null : null,
        }),
      });

      if (!response.ok) {
        throw new Error("cancel_failed");
      }

      setOpen(false);
      setSuccessMessage("已排定取消訂閱，後續不會再自動扣款。");
      setReason("");
      setReasonDetail("");
      router.refresh();
    } catch {
      setErrorMessage("取消失敗，請稍後再試或聯繫我們。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-5 space-y-3">
      {successMessage ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      {canShowCancelButton ? (
        <button
          type="button"
          className={buttonClass("danger-secondary", "h-10 rounded-lg px-4 text-xs")}
          onClick={() => {
            setErrorMessage(null);
            setOpen(true);
          }}
        >
          取消訂閱
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            aria-label="關閉取消訂閱對話框"
            onClick={() => {
              if (isSubmitting) return;
              setOpen(false);
            }}
          />
          <div className="relative z-10 w-full max-w-[560px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">取消訂閱</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              取消後將停止後續自動扣款。若你的方案仍在有效期內，服務會保留到目前週期結束。
            </p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">取消原因</span>
                <select
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">請選擇</option>
                  {CANCEL_REASON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {reason === "other" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">其他說明（選填）</span>
                  <textarea
                    value={reasonDetail}
                    onChange={(event) => setReasonDetail(event.target.value)}
                    placeholder="請簡短說明原因（選填）"
                    className="min-h-[108px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                    maxLength={500}
                  />
                </label>
              ) : null}
            </div>

            {errorMessage ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className={buttonClass("secondary", "h-10 rounded-lg px-4 text-xs")}
                onClick={() => {
                  if (isSubmitting) return;
                  setOpen(false);
                }}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={disableConfirm}
                className={cn(
                  buttonClass("danger-secondary", "h-10 rounded-lg px-4 text-xs"),
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                {isSubmitting ? "取消中..." : "確定取消訂閱"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
