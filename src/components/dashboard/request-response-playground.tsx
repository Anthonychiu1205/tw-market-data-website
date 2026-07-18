"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Download } from "lucide-react";

import type { ApiKeyItem } from "@/src/lib/backend-adapter";

type PlaygroundField = "symbol" | "period" | "limit" | "startDate" | "endDate";

const PLAYGROUND_ENDPOINTS = [
  { value: "/v2/datasets/twse-daily-price", label: "TWSE 日線價格", minPlan: "free", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/tpex-daily-price", label: "TPEx 日線價格", minPlan: "free", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/issuer-profile", label: "公司基本資料", minPlan: "free", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/monthly-revenue", label: "月營收", minPlan: "free", fields: ["symbol", "period", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/valuation-data", label: "估值資料", minPlan: "starter", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/technical-indicators", label: "技術指標", minPlan: "starter", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/issuer-announcements", label: "公司公告", minPlan: "starter", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/index-data", label: "市場指數", minPlan: "starter", fields: ["limit"] as PlaygroundField[] },
  { value: "/v2/datasets/market-breadth", label: "市場廣度", minPlan: "starter", fields: ["limit"] as PlaygroundField[] },
  { value: "/v2/datasets/interest-rate-snapshot", label: "利率快照", minPlan: "starter", fields: ["limit"] as PlaygroundField[] },
  { value: "/v2/datasets/income-statement", label: "損益表", minPlan: "pro", fields: ["symbol", "period", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/cash-flow-statement", label: "現金流量表", minPlan: "pro", fields: ["symbol", "period", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/balance-sheet", label: "資產負債表", minPlan: "pro", fields: ["symbol", "period", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/institutional-flow", label: "法人資金流向", minPlan: "pro", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/securities-lending", label: "借券資料", minPlan: "pro", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/margin-short", label: "融資融券", minPlan: "pro", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/events", label: "事件日曆", minPlan: "pro", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/structured-events", label: "結構化事件", minPlan: "pro", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/corporate-actions", label: "公司行動", minPlan: "pro", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/dividends", label: "股利", minPlan: "pro", fields: ["symbol", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/theme-taxonomy", label: "主題分類", minPlan: "max", fields: ["limit"] as PlaygroundField[] },
  { value: "/v2/datasets/index-classification", label: "指數分類", minPlan: "max", fields: ["limit"] as PlaygroundField[] },
  { value: "/v2/datasets/company-news", label: "公司新聞（Preview）", minPlan: "max", fields: ["symbol", "startDate", "endDate", "limit"] as PlaygroundField[] },
  { value: "/v2/datasets/market-news", label: "市場新聞（Preview）", minPlan: "max", fields: ["startDate", "endDate", "limit"] as PlaygroundField[] },
] as const;

const PLAN_LEVEL = {
  free: 0,
  starter: 1,
  pro: 2,
  max: 3,
  developer: 4,
  enterprise: 5,
} as const;

type PlanCode = keyof typeof PLAN_LEVEL;

type PlaygroundResponse = {
  ok?: boolean;
  status?: number;
  endpoint?: string;
  request?: Record<string, unknown>;
  response?: unknown;
  error?: string;
};

type RequestResponsePlaygroundProps = {
  apiKeys: ApiKeyItem[];
  planCode: string;
  planName: string;
  isEntitled: boolean;
};

// Turn the proxy's machine codes into something actionable. secret_unavailable is the one a user can
// actually hit: a key minted before at-rest encryption cannot be revealed, so the server cannot use
// it to call the API — the fix is to regenerate the key, not to retry.
type PlaygroundTranslator = (key: string, values?: Record<string, string | number>) => string;

function describeError(t: PlaygroundTranslator, code: string | undefined, status: number): string {
  if (code === "secret_unavailable") {
    return t("errors.secretUnavailable");
  }
  if (code === "missing_api_key") return t("errors.missingApiKey");
  if (code === "missing_symbol") return t("errors.missingSymbol");
  if (code === "invalid_endpoint") return t("errors.invalidEndpoint");
  if (code === "backend_base_url_missing") return t("errors.backendUnavailable");
  if (code) return t("errors.requestFailedCode", { code });
  return t("errors.requestFailedStatus", { status });
}

function normalizePlanCode(planCode: string): PlanCode {
  const normalized = planCode.trim().toLowerCase();
  if (normalized === "enterprise") return "enterprise";
  if (normalized === "developer") return "developer";
  if (normalized === "max") return "max";
  if (normalized === "pro") return "pro";
  if (normalized === "starter") return "starter";
  return "free";
}

export function RequestResponsePlayground({ apiKeys, planCode, planName, isEntitled }: RequestResponsePlaygroundProps) {
  const t = useTranslations("requestPlayground");
  const userPlan = normalizePlanCode(planCode);
  const availableEndpoints = useMemo(() => {
    if (!isEntitled) {
      return [] as (typeof PLAYGROUND_ENDPOINTS)[number][];
    }
    const currentPlanLevel = PLAN_LEVEL[userPlan];
    return PLAYGROUND_ENDPOINTS.filter((item) => PLAN_LEVEL[item.minPlan] <= currentPlanLevel);
  }, [isEntitled, userPlan]);

  const [endpoint, setEndpoint] = useState<string>(availableEndpoints[0]?.value ?? PLAYGROUND_ENDPOINTS[0].value);
  const [localKeys, setLocalKeys] = useState<ApiKeyItem[]>(apiKeys);
  const [selectedKeyId, setSelectedKeyId] = useState<string>(apiKeys[0]?.id ?? "");
  const [symbol, setSymbol] = useState("2330");
  const [limit, setLimit] = useState("5");
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PlaygroundResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Options are keyed by id, NOT by a plaintext key. The list endpoint deliberately never returns a
  // raw key (service.ts toApiKeyItem), so the old `value: item.keyValue` was always "" and the
  // Boolean(value) filter dropped EVERY key — the dropdown was permanently empty and submit stayed
  // disabled. The playground now sends the key id and the server resolves the secret.
  const usableKeyOptions = useMemo(
    () =>
      localKeys
        // A revoked key cannot authenticate, so it must not be selectable.
        .filter((item) => item.status !== "revoked")
        .map((item) => ({
          id: item.id,
          label: `${item.name} (${item.maskedKey})`,
        })),
    [localKeys],
  );

  const hasAvailableEndpoints = availableEndpoints.length > 0;
  const hasKeyOptions = usableKeyOptions.length > 0;

  const selectedEndpoint = useMemo(
    () => availableEndpoints.find((item) => item.value === endpoint) ?? availableEndpoints[0],
    [availableEndpoints, endpoint],
  );

  const endpointConfig = useMemo(() => {
    const fields = selectedEndpoint?.fields ?? [];
    return {
      showSymbol: fields.includes("symbol"),
      endpointSupportsPeriod: fields.includes("period"),
      showLimit: fields.includes("limit"),
      showDateRange: fields.includes("startDate") || fields.includes("endDate"),
    };
  }, [selectedEndpoint]);

  useEffect(() => {
    if (!availableEndpoints.some((item) => item.value === endpoint)) {
      setEndpoint(availableEndpoints[0]?.value ?? "");
    }
  }, [availableEndpoints, endpoint]);

  useEffect(() => {
    setLocalKeys(apiKeys);
  }, [apiKeys]);

  useEffect(() => {
    function handleKeysUpdated(event: Event) {
      const detail = (event as CustomEvent<ApiKeyItem[]>).detail;
      if (Array.isArray(detail)) {
        setLocalKeys(detail);
      }
    }
    window.addEventListener("dashboard-api-keys-updated", handleKeysUpdated);
    return () => window.removeEventListener("dashboard-api-keys-updated", handleKeysUpdated);
  }, []);

  useEffect(() => {
    if (!usableKeyOptions.some((item) => item.id === selectedKeyId)) {
      setSelectedKeyId(usableKeyOptions[0]?.id ?? "");
    }
  }, [usableKeyOptions, selectedKeyId]);

  function onApiKeySelectionChange(nextId: string) {
    setSelectedKeyId(nextId);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await fetch("/api/dashboard/playground", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          // Only the key id crosses the wire; the raw sk_live_ never reaches the browser.
          keyId: selectedKeyId,
          symbol: symbol.trim(),
          limit: Number(limit) || 5,
          period: endpointConfig.endpointSupportsPeriod ? period.trim() || undefined : undefined,
          startDate: endpointConfig.showDateRange ? startDate || undefined : undefined,
          endDate: endpointConfig.showDateRange ? endDate || undefined : undefined,
        }),
      });

      const payload = (await response.json()) as PlaygroundResponse;
      setResult(payload);

      if (!response.ok || payload.error) {
        setErrorMessage(describeError(t, payload.error, response.status));
      }
    } catch {
      setErrorMessage(t("errors.sendFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  async function copyResponse() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setErrorMessage(t("errors.copyFailed"));
    }
  }

  function downloadResponse() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `playground-response-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50/50 p-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">{t("requestHeading")}</h3>
            <p className="text-xs text-slate-500">{t("currentPlan", { planName })}</p>
          </div>
          <div className="space-y-6">
            <label className="space-y-2.5 text-sm font-medium text-slate-500">
              {t("fields.endpoint")}
              <select
                value={endpoint}
                onChange={(event) => setEndpoint(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900"
              >
                {availableEndpoints.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2.5 text-sm font-medium text-slate-500">
              {t("fields.apiKey")}
              <select
                value={selectedKeyId}
                onChange={(event) => onApiKeySelectionChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900"
              >
                {usableKeyOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="my-6 border-t border-slate-200/70" />

            {endpointConfig.showSymbol ? (
              <label className="space-y-2.5 text-sm font-medium text-slate-500">
                {t("fields.symbol")}
                <input
                  value={symbol}
                  onChange={(event) => setSymbol(event.target.value)}
                  placeholder="2330"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900"
                />
              </label>
            ) : null}

            <div className="grid grid-cols-2 gap-6">
              <label className="space-y-2.5 text-sm font-medium text-slate-500">
                  {t("fields.period")}
                  <select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900"
                  >
                    <option value="daily">daily</option>
                    <option value="monthly">monthly</option>
                    <option value="annual">annual</option>
                    <option value="quarterly">quarterly</option>
                  </select>
              </label>

              {endpointConfig.showLimit ? (
                <label className="space-y-2.5 text-sm font-medium text-slate-500">
                  {t("fields.limit")}
                  <input
                    value={limit}
                    onChange={(event) => setLimit(event.target.value)}
                    placeholder="5"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900"
                  />
                </label>
              ) : (
                <span />
              )}
            </div>

            {endpointConfig.showDateRange ? (
              <>
                <label className="space-y-2.5 text-sm font-medium text-slate-500">
                  {t("fields.startDate")}
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900"
                  />
                </label>

                <label className="space-y-2.5 text-sm font-medium text-slate-500">
                  {t("fields.endDate")}
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900"
                  />
                </label>
              </>
            ) : null}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !hasAvailableEndpoints || !hasKeyOptions}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-7 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              {submitting ? t("actions.submitting") : t("actions.submit")}
            </button>
            {!hasKeyOptions && isEntitled ? <p className="mt-3 text-sm text-slate-500">{t("status.createKeyFirst")}</p> : null}
          </div>
          {!isEntitled ? <p className="mt-2 text-sm text-slate-500">{t("status.planInactive")}</p> : null}
          {isEntitled && !hasAvailableEndpoints ? <p className="mt-2 text-sm text-slate-500">{t("status.noEndpoints")}</p> : null}
          {errorMessage ? <p className="mt-2 text-sm text-red-600">{errorMessage}</p> : null}
        </form>

        <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-slate-900">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <h3 className="text-sm font-semibold text-slate-900">{t("responseHeading")}</h3>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={copyResponse}
                disabled={!result}
                className="inline-flex items-center justify-center border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:text-slate-300"
                aria-label={t("actions.copyResponse")}
                title={t("actions.copyResponse")}
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={downloadResponse}
                disabled={!result}
                className="inline-flex items-center justify-center border-0 bg-transparent p-0 text-slate-400 shadow-none hover:text-slate-700 disabled:text-slate-300"
                aria-label={t("actions.downloadResponse")}
                title={t("actions.downloadResponse")}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs font-medium text-slate-600">HTTP {typeof result?.status === "number" ? result.status : "—"}</p>
          <pre className="mt-2 max-h-[420px] overflow-auto rounded-md bg-slate-50 p-2 text-xs leading-6 text-slate-700">
            {JSON.stringify(result ?? { message: t("status.emptyResponse") }, null, 2)}
          </pre>
          {copied ? <p className="mt-2 text-[11px] text-slate-500">{t("status.copied")}</p> : null}
        </div>
      </div>
    </section>
  );
}
