"use client";

import { buttonClass } from "@/src/components/ui/button";
import {
  aiResearchMockResponse,
  mapAiResearchResponseToViewModel,
  type AiResearchViewModel,
} from "@/src/components/dashboard/ai-research-mock-response";

function formatConfidence(value: number) {
  return value.toFixed(2);
}

function statusBadgeClass(status: AiResearchViewModel["analystRows"][number]["status"]) {
  if (status === "mock-real") {
    return "bg-slate-900 text-white";
  }
  if (status === "placeholder") {
    return "bg-slate-200 text-slate-700";
  }
  return "bg-slate-100 text-slate-500";
}

export function AiResearchStaticMockPage() {
  const viewModel = mapAiResearchResponseToViewModel(aiResearchMockResponse);

  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">AI Research</h1>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                Pro+ 功能
              </span>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                僅模擬
              </span>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                非投資建議
              </span>
            </div>
            <p className="max-w-3xl text-sm text-slate-600">
              使用台股資料流程產生可審計的研究結論、風險檢查與模擬決策。
            </p>
            <p className="text-xs text-slate-500">
              開放 Pro、Team、Enterprise 方案使用；Developer 僅提供 mock 預覽。
            </p>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-[420px]">
            <label className="space-y-1">
              <span className="text-xs text-slate-500">股票代碼</span>
              <input
                defaultValue={viewModel.ticker}
                readOnly
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-slate-500">資料日期</span>
              <input
                defaultValue={viewModel.asOfDate}
                readOnly
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              />
            </label>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">模式</span>
              <div className="h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm leading-10 text-slate-700">
                {viewModel.modeLabel}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-transparent">執行</span>
              <button type="button" disabled className={buttonClass("primary", "h-10 w-full rounded-lg text-sm")}>
                執行研究
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-5">
          <div>
            <p className="text-xs text-slate-500">研究動作候選</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.actionCandidate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">信心分數</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.confidence}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">風控判斷</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.riskDecision}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">投組動作</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.portfolioAction}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">模擬狀態</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.simulationStatus}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Replay fingerprint
          <span className="ml-2 font-mono text-slate-700">{viewModel.replayFingerprint}</span>
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">研究流程</h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-7">
            {viewModel.timelineSteps.map((step, index) => (
              <div key={step.stage} className="min-w-0 rounded-lg bg-slate-50/80 px-3 py-2">
                <div className="flex items-center gap-2">
                  <p className="min-w-0 break-words text-sm font-medium leading-tight text-slate-900">{step.stage}</p>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <p className="min-w-0 break-words text-sm leading-tight text-slate-500">{step.status}</p>
                  {index < viewModel.timelineSteps.length - 1 ? (
                    <span className="hidden text-[11px] text-slate-400 xl:inline">→</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">分析師總覽</h2>
            <div className="text-xs text-slate-500">目前方案：Pro · 功能已啟用</div>
          </div>
          <div>
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[23%]" />
                <col className="w-[25%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-500">
                  <th className="py-2 pr-4 font-medium">分析師</th>
                  <th className="py-2 pr-4 font-medium">立場</th>
                  <th className="py-2 pr-4 font-medium">信心</th>
                  <th className="py-2 pr-4 font-medium">狀態</th>
                  <th className="py-2 pr-4 font-medium">關鍵資料</th>
                  <th className="py-2 font-medium">資料缺口</th>
                </tr>
              </thead>
              <tbody>
                {viewModel.analystRows.map((row) => (
                  <tr key={row.analyst} className="border-b border-slate-100 align-top text-slate-700 last:border-b-0">
                    <td className="py-2.5 pr-4 font-medium text-slate-900">{row.analyst}</td>
                    <td className="py-2.5 pr-4">{row.stance}</td>
                    <td className="py-2.5 pr-4">{formatConfidence(row.confidence)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 whitespace-normal break-words">{row.keyData}</td>
                    <td className="py-2.5 whitespace-normal break-words">{row.dataGaps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">多方觀點（Bull Case）</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {viewModel.bullCasePoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">空方觀點（Bear Case）</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {viewModel.bearCasePoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">圖表分析</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs text-slate-500">分析師信心分數</p>
              <div className="space-y-2">
                {viewModel.confidenceChartData.map((row) => (
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
              <p className="text-xs text-slate-500">研究覆蓋狀態</p>
              <div className="space-y-3">
                {viewModel.coverageChartData.map((row) => {
                  const total = viewModel.coverageChartData.reduce((acc, item) => acc + item.value, 0);
                  const pct = total > 0 ? (row.value / total) * 100 : 0;
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
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">風控審查</h2>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <dt className="text-slate-500">風控判斷</dt>
                <dd className="font-medium text-slate-900">{viewModel.risk.decision}</dd>
                <dt className="text-slate-500">最大配置</dt>
                <dd className="font-medium text-slate-900">{viewModel.risk.maxAllocation}</dd>
                <dt className="text-slate-500">需要使用者確認</dt>
                <dd className="font-medium text-slate-900">{viewModel.risk.requiredUserConfirmation}</dd>
              </dl>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                {viewModel.risk.flags.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">模擬訂單</h2>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <dt className="text-slate-500">訂單狀態</dt>
                <dd className="font-medium text-slate-900">{viewModel.order.status}</dd>
                <dt className="text-slate-500">僅模擬</dt>
                <dd className="font-medium text-slate-900">{viewModel.order.simulationOnly}</dd>
                <dt className="text-slate-500">券商下單</dt>
                <dd className="font-medium text-slate-900">{viewModel.order.brokerExecution}</dd>
              </dl>
              <p className="mt-3 text-sm text-slate-700">原因：{viewModel.order.reason}</p>
              <p className="mt-2 text-xs text-slate-500">這是模擬研究輸出，不會建立任何券商委託單。</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">資料缺口</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                {viewModel.dataGaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">風險提示</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                {viewModel.warnings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-4">
          <p className="text-sm text-slate-700">{viewModel.disclaimer}</p>
        </div>
      </section>
    </div>
  );
}
