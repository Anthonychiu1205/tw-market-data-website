"use client";

import { buttonClass } from "@/src/components/ui/button";

type AnalystRow = {
  analyst: string;
  stance: string;
  confidence: number;
  status: "mock-real" | "placeholder" | "missing";
  keyData: string;
  dataGaps: string;
};

const analystRows: AnalystRow[] = [
  {
    analyst: "Market Data Analyst",
    stance: "Neutral",
    confidence: 0.72,
    status: "mock-real",
    keyData: "TWSE daily price fixture",
    dataGaps: "live read pending",
  },
  {
    analyst: "Technical Analyst",
    stance: "Mixed",
    confidence: 0.0,
    status: "placeholder",
    keyData: "—",
    dataGaps: "indicators not connected",
  },
  {
    analyst: "Monthly Revenue Analyst",
    stance: "Unavailable",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "revenue mapping pending",
  },
  {
    analyst: "Financial Statement Analyst",
    stance: "Unavailable",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "statements not connected",
  },
  {
    analyst: "Valuation Analyst",
    stance: "Unavailable",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "valuation data pending",
  },
  {
    analyst: "News Event Analyst",
    stance: "Neutral",
    confidence: 0.0,
    status: "placeholder",
    keyData: "fixture boundary",
    dataGaps: "no live event tool",
  },
  {
    analyst: "Chip / Institutional Analyst",
    stance: "Unavailable",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "institutional data pending",
  },
  {
    analyst: "Macro / Sector Analyst",
    stance: "Unavailable",
    confidence: 0.0,
    status: "missing",
    keyData: "—",
    dataGaps: "macro data pending",
  },
];

const confidenceChartData = analystRows.map((row) => ({
  name: row.analyst.replace(" Analyst", ""),
  confidence: row.confidence,
}));

const coverageChartData = [
  { name: "Available", value: 1, colorClass: "bg-slate-900" },
  { name: "Placeholder", value: 2, colorClass: "bg-slate-500" },
  { name: "Missing", value: 5, colorClass: "bg-slate-300" },
];

const timelineSteps = [
  { stage: "Market Data", status: "mock-real" },
  { stage: "Analysts", status: "partial" },
  { stage: "Bull / Bear", status: "placeholder" },
  { stage: "Trader", status: "conservative" },
  { stage: "Risk", status: "needs more data" },
  { stage: "Portfolio", status: "no action" },
  { stage: "Simulated Order", status: "paper only" },
];

function formatConfidence(value: number) {
  return value.toFixed(2);
}

function statusBadgeClass(status: AnalystRow["status"]) {
  if (status === "mock-real") {
    return "bg-slate-900 text-white";
  }
  if (status === "placeholder") {
    return "bg-slate-200 text-slate-700";
  }
  return "bg-slate-100 text-slate-500";
}

export function AiResearchStaticMockPage() {
  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">AI Research</h1>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                Pro+ feature
              </span>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                Simulation only
              </span>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                Not investment advice
              </span>
            </div>
            <p className="max-w-3xl text-sm text-slate-600">
              使用台股資料流程產生可審計的研究結論、風險檢查與模擬決策。
            </p>
            <p className="text-xs text-slate-500">
              Available on Pro, Team, and Enterprise plans. Developer accounts can preview mock research only.
            </p>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-[420px]">
            <label className="space-y-1">
              <span className="text-xs text-slate-500">Ticker</span>
              <input
                defaultValue="2330"
                readOnly
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-slate-500">As of date</span>
              <input
                defaultValue="2026-05-13"
                readOnly
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              />
            </label>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Mode</span>
              <div className="h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm leading-10 text-slate-700">
                Mock
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-transparent">Run</span>
              <button type="button" disabled className={buttonClass("primary", "h-10 w-full rounded-lg text-sm")}>
                Run research
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-5">
          <div>
            <p className="text-xs text-slate-500">Research action candidate</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">Hold</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Confidence</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">0.62</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Risk decision</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">Needs more data</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Portfolio action</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">No action</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Simulation</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">Paper only</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Replay fingerprint
          <span className="ml-2 font-mono text-slate-700">rf_2330_20260513_mock</span>
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">Research Flow Timeline</h2>
          <div className="mt-4 overflow-x-auto">
            <div className="flex min-w-[860px] items-start gap-3">
              {timelineSteps.map((step, index) => (
                <div key={step.stage} className="flex items-start gap-3">
                  <div className="w-[108px]">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-slate-700" />
                      <p className="text-xs font-medium text-slate-900">{step.stage}</p>
                    </div>
                    <p className="mt-1 pl-4 text-xs text-slate-500">{step.status}</p>
                  </div>
                  {index < timelineSteps.length - 1 ? <span className="pt-[2px] text-xs text-slate-400">→</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">Analyst Overview</h2>
            <div className="text-xs text-slate-500">Current plan: Pro · Feature: Enabled</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4 font-medium">Analyst</th>
                  <th className="py-2 pr-4 font-medium">Stance</th>
                  <th className="py-2 pr-4 font-medium">Confidence</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Key data</th>
                  <th className="py-2 font-medium">Data gaps</th>
                </tr>
              </thead>
              <tbody>
                {analystRows.map((row) => (
                  <tr key={row.analyst} className="border-b border-slate-100 align-top text-slate-700 last:border-b-0">
                    <td className="py-2.5 pr-4 font-medium text-slate-900">{row.analyst}</td>
                    <td className="py-2.5 pr-4">{row.stance}</td>
                    <td className="py-2.5 pr-4">{formatConfidence(row.confidence)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">{row.keyData}</td>
                    <td className="py-2.5">{row.dataGaps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">Bull Case</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Price data fixture is structurally valid.</li>
                <li>Market data path is audit-ready.</li>
                <li>Research engine can produce repeatable decision records.</li>
                <li>Future TWSE read-only integration can improve confidence.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">Bear Case</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>No live market data has been connected in this run.</li>
                <li>Technical / valuation / fundamentals are still missing.</li>
                <li>News event signal is placeholder.</li>
                <li>Output should remain conservative until coverage improves.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">Chart Analysis</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs text-slate-500">Confidence by analyst</p>
              <div className="space-y-2">
                {confidenceChartData.map((row) => (
                  <div key={row.name} className="grid grid-cols-[150px_minmax(0,1fr)_40px] items-center gap-3">
                    <span className="truncate text-xs text-slate-600">{row.name}</span>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-slate-800" style={{ width: `${Math.max(4, row.confidence * 100)}%` }} />
                    </div>
                    <span className="text-right text-xs text-slate-500">{formatConfidence(row.confidence)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">Research coverage</p>
              <div className="space-y-3">
                {coverageChartData.map((row) => {
                  const pct = (row.value / 8) * 100;
                  return (
                    <div key={row.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">{row.name}</span>
                        <span className="text-slate-500">{row.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div className={`h-2 rounded-full ${row.colorClass}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">Risk Review</h2>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <dt className="text-slate-500">Risk decision</dt>
                <dd className="font-medium text-slate-900">Needs more data</dd>
                <dt className="text-slate-500">Max allocation</dt>
                <dd className="font-medium text-slate-900">0%</dd>
                <dt className="text-slate-500">Required user confirmation</dt>
                <dd className="font-medium text-slate-900">Yes</dd>
              </dl>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li>Missing technical indicators</li>
                <li>Missing valuation data</li>
                <li>News signal placeholder</li>
                <li>No live provider used</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">Simulated Order</h2>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <dt className="text-slate-500">Order status</dt>
                <dd className="font-medium text-slate-900">Rejected / No action</dd>
                <dt className="text-slate-500">Simulation only</dt>
                <dd className="font-medium text-slate-900">true</dd>
                <dt className="text-slate-500">Broker execution</dt>
                <dd className="font-medium text-slate-900">false</dd>
              </dl>
              <p className="mt-3 text-sm text-slate-700">Reason: Risk review requires more data.</p>
              <p className="mt-2 text-xs text-slate-500">This is a simulated research output. No broker order is created.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">Data gaps</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li>Technical indicators are not connected.</li>
                <li>Monthly revenue mapping is pending.</li>
                <li>Financial statement adapter is pending.</li>
                <li>Valuation data is pending.</li>
                <li>NewsEventTool is not executed in this mock run.</li>
                <li>TPEx historical depth is deferred.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">Warnings</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li>Mock mode only.</li>
                <li>Not investment advice.</li>
                <li>No live provider used.</li>
                <li>No broker execution.</li>
                <li>User final decision required.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-4">
          <p className="text-sm text-slate-700">
            本頁內容僅為研究與模擬用途，不構成投資建議，不保證報酬，亦不會進行任何真實下單。所有決策應由使用者自行判斷。
          </p>
        </div>
      </section>
    </div>
  );
}
