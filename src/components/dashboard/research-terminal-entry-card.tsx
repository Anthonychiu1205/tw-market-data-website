import Link from "next/link";
import { ArrowRight, LineChart } from "lucide-react";

import { buttonClass } from "@/src/components/ui/button";

// T-05 dashboard entry card for the 投研終端 (research terminal).
// 終端已上線 (F 線, terminal.twmarketdata.com) → 正式入口:直接 SSO 直達,不再 gated。
const TERMINAL_URL = "https://terminal.twmarketdata.com";

export function ResearchTerminalEntryCard() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-7">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <LineChart size={18} strokeWidth={1.75} />
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">投研終端</h2>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            以官方台股資料為底的線上投研工作台：因子、資料檢視與研究流程，一站完成。登入後可從此直達，
            無需重新登入。
          </p>

          <div className="mt-5">
            <Link
              href={TERMINAL_URL}
              className={buttonClass("primary", "inline-flex items-center gap-2")}
            >
              進入投研終端
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
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
