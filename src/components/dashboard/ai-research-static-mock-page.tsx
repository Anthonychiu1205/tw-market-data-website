"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { buttonClass } from "@/src/components/ui/button";
import {
  getAiResearchEntitlement,
  listAiResearchPlans,
  type AiResearchPlan,
} from "@/src/components/dashboard/ai-research-entitlements";
import {
  aiResearchMockResponse,
  buildAiResearchMockResponse,
  mapAiResearchResponseToViewModel,
  normalizeAiResearchResponse,
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

function availabilityBadgeClass(tone: AiResearchViewModel["availabilitySummary"]["statusTone"]) {
  if (tone === "ready") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (tone === "fallback") return "border-amber-200 bg-amber-50 text-amber-700";
  if (tone === "skip") return "border-slate-300 bg-slate-100 text-slate-700";
  return "border-slate-300 bg-slate-50 text-slate-600";
}

// Returns the `aiResearch` message key for the coverage hint (resolved via t() at render). The hint is
// page chrome describing the mock research state, not fabricated data — safe to localize.
function availabilityHintKey(summary: AiResearchViewModel["availabilitySummary"]) {
  if (summary.readiness === "ready" && summary.agentAction === "proceed") {
    return "availabilityHint.ready";
  }
  if (summary.readiness === "unavailable" || summary.agentAction === "skip") {
    return "availabilityHint.unavailable";
  }
  if (summary.readiness === "beta_limited") {
    return "availabilityHint.betaLimited";
  }
  return "availabilityHint.degraded";
}

export function AiResearchStaticMockPage() {
  type DataSourceState = "local" | "proxy" | "fallback";
  type RunState = "idle" | "running" | "success" | "fallback";

  const t = useTranslations("aiResearch");
  const locale = useLocale();
  // §2.5 fallback: the research OUTPUT below (analyst prose, summaries, bull/bear cases, timeline,
  // disclaimer, data gaps/warnings) is rendered from the untranslated deterministic mock fixture
  // (ai-research-mock-response.ts). On /en we surface an "English coming soon" notice rather than
  // machine-translate that mock content (which would entrench fabricated numbers into English).
  const showEnglishNotice = locale === "en";

  const sourceStatusMap: Record<
    DataSourceState,
    { label: string; description: string; badgeClass: string }
  > = {
    local: {
      label: t("dataSource.local.label"),
      description: t("dataSource.local.description"),
      badgeClass: "border-slate-300 text-slate-700 bg-white",
    },
    proxy: {
      label: t("dataSource.proxy.label"),
      description: t("dataSource.proxy.description"),
      badgeClass: "border-slate-300 text-slate-700 bg-slate-50",
    },
    fallback: {
      label: t("dataSource.fallback.label"),
      description: t("dataSource.fallback.description"),
      badgeClass: "border-slate-300 text-slate-700 bg-slate-50",
    },
  };

  const proxyFeatureEnabled = process.env.NEXT_PUBLIC_AI_RESEARCH_MOCK_PROXY_ENABLED === "true";
  const [selectedPlan, setSelectedPlan] = useState<AiResearchPlan>("pro");
  const [tickerInput, setTickerInput] = useState(aiResearchMockResponse.ticker);
  const [asOfDateInput, setAsOfDateInput] = useState(aiResearchMockResponse.as_of_date);
  const [activeResponse, setActiveResponse] = useState(aiResearchMockResponse);
  const [isRunning, setIsRunning] = useState(false);
  const [dataSource, setDataSource] = useState<DataSourceState>("local");
  const [runState, setRunState] = useState<RunState>("idle");

  const viewModel = useMemo(
    () => mapAiResearchResponseToViewModel(activeResponse),
    [activeResponse],
  );
  const entitlement = useMemo(
    () => getAiResearchEntitlement(selectedPlan),
    [selectedPlan],
  );
  const canRunResearch = entitlement.canRunResearch;
  const runButtonDisabled = isRunning || !canRunResearch;

  async function handleRunResearch() {
    if (!canRunResearch) {
      setRunState("idle");
      return;
    }

    const localFallback = buildAiResearchMockResponse({
      ticker: tickerInput,
      asOfDate: asOfDateInput,
      includeSimulation: true,
    });

    if (!proxyFeatureEnabled) {
      setActiveResponse(localFallback);
      setDataSource("local");
      setRunState("success");
      return;
    }

    setIsRunning(true);
    setRunState("running");
    try {
      const response = await fetch("/api/ai-research/mock-ticker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker: tickerInput,
          as_of_date: asOfDateInput,
          mode: "mock",
          include_simulation: true,
        }),
      });

      if (!response.ok) {
        setActiveResponse(localFallback);
        setDataSource("fallback");
        setRunState("fallback");
        return;
      }

      const payload = (await response.json()) as {
        ok?: boolean;
        data?: unknown;
        fallback_required?: boolean;
      };

      if (payload.ok === true && payload.data) {
        setActiveResponse(
          normalizeAiResearchResponse(payload.data, {
            ticker: tickerInput,
            asOfDate: asOfDateInput,
            includeSimulation: true,
          }),
        );
        setDataSource("proxy");
        setRunState("success");
        return;
      }

      if (payload.fallback_required) {
        setActiveResponse(localFallback);
        setDataSource("fallback");
        setRunState("fallback");
        return;
      }

      setActiveResponse(localFallback);
      setDataSource("fallback");
      setRunState("fallback");
    } catch {
      setActiveResponse(localFallback);
      setDataSource("fallback");
      setRunState("fallback");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="space-y-4 pb-8">
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">{t("title")}</h1>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                {t("badge.proPlus")}
              </span>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                {t("badge.simulationOnly")}
              </span>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                {t("badge.notInvestmentAdvice")}
              </span>
            </div>
            <p className="max-w-3xl text-sm text-slate-600">{t("intro")}</p>
            <p className="text-xs text-slate-500">{t("planAvailability")}</p>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-[420px]">
            <label className="space-y-1">
              <span className="text-xs text-slate-500">{t("form.ticker")}</span>
              <input
                value={tickerInput}
                onChange={(event) => setTickerInput(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-slate-500">{t("form.asOfDate")}</span>
              <input
                type="date"
                value={asOfDateInput}
                onChange={(event) => setAsOfDateInput(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-xs text-slate-500">{t("form.previewPlan")}</span>
              <select
                value={selectedPlan}
                onChange={(event) => setSelectedPlan(event.target.value as AiResearchPlan)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              >
                {listAiResearchPlans().map((plan) => (
                  <option key={plan} value={plan}>
                    {getAiResearchEntitlement(plan).displayName}
                  </option>
                ))}
              </select>
            </label>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">{t("form.mode")}</span>
              <div className="h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm leading-10 text-slate-700">
                {entitlement.modeLabel}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-transparent">{t("form.runLabel")}</span>
              <button
                type="button"
                onClick={handleRunResearch}
                disabled={runButtonDisabled}
                className={buttonClass("primary", "h-10 w-full rounded-lg text-sm")}
              >
                {isRunning ? t("form.running") : canRunResearch ? t("form.run") : t("form.planLocked")}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-2 grid gap-2 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
          <p>{t("meta.currentPlan", { plan: entitlement.displayName })}</p>
          <p>{t("meta.status", { status: t(entitlement.statusKey) })}</p>
          <p>{t("meta.monthlyRuns", { quota: t(entitlement.quotaKey) })}</p>
          <p>{t("meta.mode", { mode: entitlement.modeLabel })}</p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{t("dataSource.title")}</span>
          <span className={`rounded-full border px-2 py-0.5 ${sourceStatusMap[dataSource].badgeClass}`}>
            {sourceStatusMap[dataSource].label}
          </span>
          {runState === "running" ? <span className="text-slate-500">{t("form.running")}</span> : null}
          <span className="w-full sm:w-auto">{sourceStatusMap[dataSource].description}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{t(entitlement.helperKey)}</p>
        {entitlement.upgradeKey ? (
          <p className="mt-1 text-xs text-slate-500">{t(entitlement.upgradeKey)}</p>
        ) : null}
        <p className="mt-1 text-xs text-slate-500">{t("noCredits")}</p>

        {showEnglishNotice ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
            {t("englishNotice")}
          </p>
        ) : null}

        <div className="mt-5 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-5">
          <div>
            <p className="text-xs text-slate-500">{t("summary.actionCandidate")}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.actionCandidate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{t("summary.confidence")}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.confidence}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{t("summary.riskDecision")}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.riskDecision}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{t("summary.portfolioAction")}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.portfolioAction}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{t("summary.simulationStatus")}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{viewModel.summary.simulationStatus}</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-slate-500">{t("coverage.title")}</p>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${availabilityBadgeClass(viewModel.availabilitySummary.statusTone)}`}
            >
              {viewModel.availabilitySummary.label}
            </span>
            <span className="text-xs text-slate-500">rows_in_range: {viewModel.availabilitySummary.rowsInRange}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            coverage window: {viewModel.availabilitySummary.coverageWindow}
          </p>
          <p className="mt-1 text-xs text-slate-600">{t(availabilityHintKey(viewModel.availabilitySummary))}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {viewModel.availabilitySummary.qualityNotes.map((item) => (
              <span key={item} className="rounded-full border border-slate-300 px-2 py-0.5 text-[11px] text-slate-600">
                {item}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Replay fingerprint
          <span className="ml-2 font-mono text-slate-700">{viewModel.replayFingerprint}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Run ID
          <span className="ml-2 font-mono text-slate-700">{viewModel.runId}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          safety: broker_execution={viewModel.safetyFlags.brokerExecution} / simulation_only={viewModel.safetyFlags.simulationOnly} /
          not_investment_advice={viewModel.safetyFlags.notInvestmentAdvice}
        </p>
        <p className="mt-1 text-xs text-slate-500">{t("technicalFixtureNote")}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("timeline.title")}</h2>
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
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("analysts.title")}</h2>
            <div className="text-xs text-slate-500">
              {t("analysts.planStatus", {
                plan: entitlement.displayName,
                status: t(entitlement.statusKey),
              })}
            </div>
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
                  <th className="py-2 pr-4 font-medium">{t("analysts.table.analyst")}</th>
                  <th className="py-2 pr-4 font-medium">{t("analysts.table.stance")}</th>
                  <th className="py-2 pr-4 font-medium">{t("analysts.table.confidence")}</th>
                  <th className="py-2 pr-4 font-medium">{t("analysts.table.status")}</th>
                  <th className="py-2 pr-4 font-medium">{t("analysts.table.keyData")}</th>
                  <th className="py-2 font-medium">{t("analysts.table.dataGaps")}</th>
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
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("bullCase")}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {viewModel.bullCasePoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("bearCase")}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {viewModel.bearCasePoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("charts.title")}</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs text-slate-500">{t("charts.confidenceTitle")}</p>
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
              <p className="text-xs text-slate-500">{t("charts.coverageTitle")}</p>
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
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("risk.title")}</h2>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <dt className="text-slate-500">{t("risk.decision")}</dt>
                <dd className="font-medium text-slate-900">{viewModel.risk.decision}</dd>
                <dt className="text-slate-500">{t("risk.maxAllocation")}</dt>
                <dd className="font-medium text-slate-900">{viewModel.risk.maxAllocation}</dd>
                <dt className="text-slate-500">{t("risk.requiredConfirmation")}</dt>
                <dd className="font-medium text-slate-900">{viewModel.risk.requiredUserConfirmation}</dd>
              </dl>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                {viewModel.risk.flags.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("order.title")}</h2>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <dt className="text-slate-500">{t("order.status")}</dt>
                <dd className="font-medium text-slate-900">{viewModel.order.status}</dd>
                <dt className="text-slate-500">{t("order.simulationOnly")}</dt>
                <dd className="font-medium text-slate-900">{viewModel.order.simulationOnly}</dd>
                <dt className="text-slate-500">{t("order.brokerExecution")}</dt>
                <dd className="font-medium text-slate-900">{viewModel.order.brokerExecution}</dd>
              </dl>
              <p className="mt-3 text-sm text-slate-700">{t("order.reason", { reason: viewModel.order.reason })}</p>
              <p className="mt-2 text-xs text-slate-500">{t("order.note")}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("dataGaps.title")}</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                {viewModel.dataGaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">{t("warnings.title")}</h2>
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
