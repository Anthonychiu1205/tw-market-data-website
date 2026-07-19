"use client";

import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { MarketingContainer } from "@/src/components/ui/marketing-container";
import type { ApiDemoRealData } from "@/src/lib/homepage/demo-real-data-types";
import { tickerDisplayName } from "@/src/lib/homepage/ticker-names";

type EndpointId = "monthlyRevenue" | "twseDailyPrice" | "incomeStatement" | "technicalIndicators";
type CodeLanguage = "python" | "typescript" | "curl";

const endpointOptions = [
  { id: "monthlyRevenue", labelKey: "endpoints.monthlyRevenue", path: "/v2/datasets/monthly-revenue", dataset: "monthly_revenue" },
  { id: "twseDailyPrice", labelKey: "endpoints.twseDailyPrice", path: "/v2/datasets/twse-daily-price", dataset: "twse_daily_price" },
  { id: "incomeStatement", labelKey: "endpoints.incomeStatement", path: "/v2/datasets/income-statement", dataset: "income_statement" },
  { id: "technicalIndicators", labelKey: "endpoints.technicalIndicators", path: "/v2/datasets/technical-indicators", dataset: "technical_indicators" },
] as const;

const tickerOptions = [
  { value: "2330", label: "2330 台積電", symbol: "2330", name: "台積電" },
  { value: "2317", label: "2317 鴻海", symbol: "2317", name: "鴻海" },
  { value: "2454", label: "2454 聯發科", symbol: "2454", name: "聯發科" },
  { value: "2308", label: "2308 台達電", symbol: "2308", name: "台達電" },
] as const;

const codeLanguages = ["python", "typescript", "curl"] as const;

function buildCodeSnippet(path: string, symbol: string, language: CodeLanguage) {
  if (language === "python") {
    return `import requests

response = requests.get(
    "https://api.twmarketdata.com${path}",
    params={"symbol": "${symbol}", "limit": 12},
)

data = response.json()`;
  }

  if (language === "typescript") {
    return `const baseUrl = "https://api.twmarketdata.com";
const params = new URLSearchParams({
  symbol: "${symbol}",
  limit: "12",
});

const response = await fetch(
  baseUrl + "${path}" + "?" + params.toString()
);

const data = await response.json();`;
  }

  return `curl "https://api.twmarketdata.com${path}?symbol=${symbol}&limit=12"`;
}

// Build the response the panel displays from REAL prefetched data (server-fetched, passed as a prop).
// No number is ever fabricated: a real row is shown verbatim with its real as_of, and when a combo has
// no real row available the panel shows an honest note instead of invented figures (rule 2).
function buildRealResponse(
  data: ApiDemoRealData | undefined,
  endpointMeta: (typeof endpointOptions)[number],
  tickerMeta: (typeof tickerOptions)[number],
  unavailableNote: string,
) {
  const resp = data?.responses?.[endpointMeta.id]?.[tickerMeta.symbol];
  if (resp) {
    return { dataset: resp.dataset, symbol: resp.symbol, name: tickerMeta.name, as_of: resp.asOf, data: resp.data };
  }
  return { dataset: endpointMeta.dataset, symbol: tickerMeta.symbol, name: tickerMeta.name, note: unavailableNote };
}

function DemoSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? "";

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <p className="mb-1 text-sm text-slate-700">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-950 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
      >
        <span className="flex items-center justify-between gap-3">
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  active ? "bg-slate-950 text-white hover:bg-slate-900 hover:text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span>{option.label}</span>
                {active ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ApiDemoSection({ data }: { data?: ApiDemoRealData }) {
  const t = useTranslations("home.apiDemo");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [draftEndpointId, setDraftEndpointId] = useState<EndpointId>("monthlyRevenue");
  const [draftTicker, setDraftTicker] = useState("2330");
  const [activeEndpointId, setActiveEndpointId] = useState<EndpointId>("monthlyRevenue");
  const [activeTicker, setActiveTicker] = useState("2330");
  const [activeLanguage, setActiveLanguage] = useState<CodeLanguage>("python");
  const [isRunning, setIsRunning] = useState(false);
  const [visibleLineCount, setVisibleLineCount] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const draftEndpointMeta = endpointOptions.find((item) => item.id === draftEndpointId) ?? endpointOptions[0];
  const activeEndpointMeta = endpointOptions.find((item) => item.id === activeEndpointId) ?? endpointOptions[0];
  const draftTickerMeta = tickerOptions.find((item) => item.value === draftTicker) ?? tickerOptions[0];
  const activeTickerMeta = tickerOptions.find((item) => item.value === activeTicker) ?? tickerOptions[0];

  const endpointSelectOptions = useMemo(
    () => endpointOptions.map((option) => ({ value: option.id, label: t(option.labelKey) })),
    [t]
  );
  const tickerSelectOptions = useMemo(
    () => tickerOptions.map((option) => ({ value: option.value, label: tickerDisplayName(option.symbol, option.name, locale) })),
    [locale]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleRun = () => {
    if (isRunning) return;

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(true);
    setActiveEndpointId(draftEndpointMeta.id);
    setActiveTicker(draftTickerMeta.value);
    setVisibleLineCount(0);

    const nextResponseJson = JSON.stringify(buildRealResponse(data, draftEndpointMeta, draftTickerMeta, tc("dataUnavailable")), null, 2);
    const nextResponseLines = nextResponseJson.split("\n");

    timeoutRef.current = window.setTimeout(() => {
      let index = 0;
      intervalRef.current = window.setInterval(() => {
        index += 1;
        setVisibleLineCount(index);

        if (index >= nextResponseLines.length) {
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
        }
      }, 35);
    }, 450);
  };

  const codeSnippet = buildCodeSnippet(activeEndpointMeta.path, activeTickerMeta.symbol, activeLanguage);
  const activeResponse = buildRealResponse(data, activeEndpointMeta, activeTickerMeta, tc("dataUnavailable"));
  const responseJson = JSON.stringify(activeResponse, null, 2);
  const responseLines = responseJson.split("\n");
  const displayedResponse = visibleLineCount === null ? responseJson : responseLines.slice(0, visibleLineCount).join("\n");

  return (
    <section className="bg-white py-24">
      <MarketingContainer>
        <div className="mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{t("heading")}</h2>
          <p className="mt-3 max-w-[900px] text-lg leading-8 text-slate-600">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="min-h-[460px] rounded-[2rem] border border-slate-200/60 bg-slate-50/80 p-8">
            <div className="relative z-20 mb-10 grid gap-4 md:grid-cols-[1.2fr_0.8fr_auto]">
              <DemoSelect label={t("fields.endpoint")} value={draftEndpointId} options={endpointSelectOptions} onChange={(value) => setDraftEndpointId(value as EndpointId)} />
              <DemoSelect label={t("fields.ticker")} value={draftTicker} options={tickerSelectOptions} onChange={setDraftTicker} />
              <div className="md:self-end">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={isRunning}
                  className="h-11 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-white/80"
                >
                  <span className="inline-flex items-center gap-2">
                    {isRunning ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}
                    {isRunning ? t("running") : t("run")}
                  </span>
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-5 border-b border-slate-200 pb-3 text-sm">
              {codeLanguages.map((language) => {
                const active = activeLanguage === language;
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => setActiveLanguage(language)}
                    className={active ? "border-b-2 border-slate-900 pb-1 font-semibold text-slate-900" : "pb-1 font-medium text-slate-500"}
                  >
                    {language === "python" ? "Python" : language === "typescript" ? "TypeScript" : "cURL"}
                  </button>
                );
              })}
            </div>

            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-700">{codeSnippet}</pre>
          </div>

          <div className="min-h-[460px] rounded-[2rem] border border-slate-200/60 bg-slate-50/80 p-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="tracking-[0.08em]">{t("response")}</span>
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">200 OK</span>
                <span>
                  {tickerDisplayName(activeTickerMeta.symbol, activeTickerMeta.name, locale)}
                </span>
                <span>{t(activeEndpointMeta.labelKey)}</span>
              </div>
            </div>

            {isRunning && visibleLineCount === 0 ? (
              <div className="space-y-3 pt-2">
                <p className="text-sm text-slate-500">{t("generating")}</p>
                <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />
                <div className="h-3 w-56 animate-pulse rounded-full bg-slate-200" />
                <div className="h-3 w-44 animate-pulse rounded-full bg-slate-200" />
              </div>
            ) : (
              <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-700">{displayedResponse}</pre>
            )}
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
