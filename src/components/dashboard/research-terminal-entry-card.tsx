import { LineChart } from "lucide-react";

// T-05 dashboard entry card for the 投研終端 (research terminal).
// 暫未開放 — 顯示「即將推出」，入口連結關閉（owner request 2026-07-16，尚未對外開放）。
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
            <span className="ml-1 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              即將推出
            </span>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            以官方台股資料為底的線上投研工作台：因子、資料檢視與研究流程，一站完成。敬請期待。
          </p>

          <div className="mt-5">
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400"
            >
              即將推出
            </span>
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
