"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, LineChart } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { buttonClass } from "@/src/components/ui/button";

// T-05 dashboard entry card for the 投研終端 (research terminal).
// Feature-flagged: default OFF → 顯示「即將推出」、入口關閉。
// 正式開放時在 Vercel 設 NEXT_PUBLIC_RESEARCH_TERMINAL_ENABLED=1 並重新部署（不需改碼、不會誤開）。
const TERMINAL_URL = "https://terminal.twmarketdata.com";
const TERMINAL_ENABLED = process.env.NEXT_PUBLIC_RESEARCH_TERMINAL_ENABLED === "1";

export function ResearchTerminalEntryCard() {
  const t = useTranslations("aiResearch");

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-7">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <LineChart size={18} strokeWidth={1.75} />
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">{t("terminal.title")}</h2>
            {!TERMINAL_ENABLED && (
              <span className="ml-1 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                {t("terminal.comingSoon")}
              </span>
            )}
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {t("terminal.description")}
            {TERMINAL_ENABLED ? t("terminal.descriptionEnabled") : t("terminal.descriptionDisabled")}
          </p>

          <div className="mt-5">
            {TERMINAL_ENABLED ? (
              <Link
                href={TERMINAL_URL}
                className={buttonClass("primary", "inline-flex items-center gap-2")}
              >
                {t("terminal.enter")}
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400"
              >
                {t("terminal.comingSoon")}
              </span>
            )}
          </div>
        </div>

        {/* Preview placeholder — pure CSS, no external asset (CSP-safe). */}
        <div className="hidden w-full max-w-[280px] shrink-0 sm:block" aria-hidden="true">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-3/4 rounded bg-slate-200" />
              <div className="h-2 w-1/2 rounded bg-slate-200" />
            </div>
            <div className="mt-4 flex h-16 items-end gap-1.5">
              {[40, 62, 48, 78, 55, 88, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-slate-300" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
