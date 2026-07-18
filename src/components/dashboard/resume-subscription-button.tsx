"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { resumeSubscription } from "@/src/lib/billing/subscription-actions";

/** Undo a scheduled cancellation (sets cancelAtPeriodEnd back to false via Polar). */
export function ResumeSubscriptionButton() {
  const t = useTranslations("billing");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleResume = () => {
    setError(null);
    startTransition(async () => {
      const result = await resumeSubscription();
      if (result.ok) {
        // Re-read the confirmed state from Polar rather than optimistically flipping.
        router.refresh();
      } else {
        setError(t("resume.error"));
      }
    });
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleResume}
        disabled={isPending}
        className="inline-flex h-9 items-center rounded-lg border border-amber-300 bg-white px-3 text-xs font-medium text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"
      >
        {isPending ? t("processing") : t("resume.button")}
      </button>
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
