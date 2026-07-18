"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle, X } from "lucide-react";

import { buttonClass } from "@/src/components/ui/button";
import { cancelSubscription, type SubscriptionActionResult } from "@/src/lib/billing/subscription-actions";

type CancelSubscriptionButtonProps = {
  /** e.g. "2026-08-15" — the date service remains usable until. */
  periodEndLabel: string;
  /** Canonical /refund §四 clause (period-end, no proration refund). */
  effectiveClause: string;
  /** API-key downgrade warning (free-tier limits from the pricing SSOT). */
  apiKeyWarning: string;
};

export function CancelSubscriptionButton({
  periodEndLabel,
  effectiveClause,
  apiKeyWarning,
}: CancelSubscriptionButtonProps) {
  const t = useTranslations("billing");
  const errorMessage = (error: Exclude<SubscriptionActionResult, { ok: true }>["error"]): string => {
    switch (error) {
      case "unauthenticated":
        return t("cancel.errors.unauthenticated");
      case "no_subscription":
        return t("cancel.errors.noSubscription");
      default:
        return t("cancel.errors.default");
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const dismissButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    lastActiveElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!isPending) setIsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const dialogElement = dialogRef.current;
      if (!dialogElement) return;
      const focusable = Array.from(
        dialogElement.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    dismissButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lastActiveElementRef.current?.focus();
    };
  }, [isOpen, isPending]);

  const closeIfIdle = () => {
    if (!isPending) {
      setIsOpen(false);
      setError(null);
    }
  };

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await cancelSubscription();
      if (result.ok) {
        setIsOpen(false);
        // Re-read the confirmed state from Polar rather than optimistically flipping.
        router.refresh();
      } else {
        setError(errorMessage(result.error));
      }
    });
  };

  return (
    <>
      <button type="button" className={buttonClass("danger")} onClick={() => setIsOpen(true)}>
        {t("cancel.trigger")}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <div aria-hidden="true" className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={closeIfIdle} />
          <div className="fixed inset-0 flex items-center justify-center px-4">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-subscription-title"
              aria-describedby="cancel-subscription-description"
              className="relative w-full max-w-[520px] rounded-2xl bg-white p-7 shadow-2xl ring-1 ring-slate-200"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeIfIdle}
                aria-label={t("cancel.close")}
                disabled={isPending}
                className="absolute right-5 top-5 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={20} strokeWidth={1.9} />
                <h2 id="cancel-subscription-title" className="text-xl font-semibold text-slate-950">
                  {t("cancel.title")}
                </h2>
              </div>

              <div id="cancel-subscription-description" className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>{t("cancel.periodLine", { date: periodEndLabel })}</p>
                <p>{effectiveClause}</p>
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">{apiKeyWarning}</p>
              </div>

              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeIfIdle}
                  disabled={isPending}
                  className={buttonClass("secondary")}
                >
                  {t("cancel.keep")}
                </button>
                <button type="button" onClick={handleConfirm} disabled={isPending} className={buttonClass("danger")}>
                  {isPending ? t("processing") : t("cancel.confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
