"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/src/lib/cn";
import { useReplayOnVisible } from "@/src/hooks/use-replay-on-visible";

export type AgentWorkflowDemoConfig = {
  stockCellOptions?: {
    columnIndex: number;
    logos: Record<
      string,
      {
        domain: string;
        ticker: string;
      }
    >;
  };
  queryPrompt: string;
  statusLead: string;
  statusPill: string;
  tableHeaders: string[];
  tableRows: string[][];
  completionLabel: string;
  tableGridTemplateColumns: string;
};

function StockLogo({
  companyName,
  ticker,
  domain,
}: {
  companyName: string;
  ticker: string;
  domain?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!domain || imageFailed) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[8px] font-semibold tracking-tight text-slate-600">
        {ticker}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={`${companyName} logo`}
      width={20}
      height={20}
      loading="lazy"
      className="h-5 w-5 rounded-sm object-cover"
      onError={() => setImageFailed(true)}
    />
  );
}

const DEFAULT_CONFIG: AgentWorkflowDemoConfig = {
  queryPrompt: "分析台積電近 8 季營收與毛利率變化",
  statusLead: "Agent: searching",
  statusPill: "TW Market Data",
  tableHeaders: ["Item", "2024", "2023", "2022", "2021", "2020"],
  tableRows: [
    ["營收", "$2,894.3B", "$2,161.7B", "$2,263.9B", "$1,587.4B", "$1,339.2B"],
    ["營業成本", "$1,377.5B", "$1,040.2B", "$1,064.1B", "$777.9B", "$674.1B"],
    ["營業毛利", "$1,516.8B", "$1,121.5B", "$1,199.8B", "$809.5B", "$665.1B"],
    ["研發費用", "$198.4B", "$176.1B", "$172.4B", "$148.7B", "$136.2B"],
    ["營業利益", "$1,116.2B", "$779.7B", "$867.1B", "$592.4B", "$493.5B"],
    ["毛利率", "52.4%", "51.9%", "53.0%", "51.0%", "49.7%"],
  ],
  completionLabel: "Agent: analysis complete.",
  tableGridTemplateColumns: "1.2fr repeat(5,minmax(0,1fr))",
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-slate-500"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-slate-700"
      aria-hidden="true"
    >
      <path d="m4.5 10.2 3.3 3.3 7.7-7.7" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}

type AgentWorkflowDemoProps = {
  config?: AgentWorkflowDemoConfig;
};

const TIMING_SCALE = 0.65;
const scaleMs = (ms: number) => Math.round(ms * TIMING_SCALE);

export function AgentWorkflowDemo({ config = DEFAULT_CONFIG }: AgentWorkflowDemoProps) {
  const { elementRef, isVisible } = useReplayOnVisible<HTMLDivElement>({
    threshold: 0.4,
    rootMargin: "0px 0px -8% 0px",
  });

  const timersRef = useRef<number[]>([]);
  const typingIntervalRef = useRef<number | null>(null);

  const [queryVisible, setQueryVisible] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [agentVisible, setAgentVisible] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleRows, setVisibleRows] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    function clearAllTimers() {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      timersRef.current = [];
      if (typingIntervalRef.current !== null) {
        window.clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }

    function resetStages() {
      setQueryVisible(false);
      setTypedLength(0);
      setAgentVisible(false);
      setSearchComplete(false);
      setHeaderVisible(false);
      setVisibleRows(0);
      setAnalysisComplete(false);
    }

    if (!isVisible) {
      clearAllTimers();
      resetStages();
      return;
    }

    clearAllTimers();
    resetStages();

    timersRef.current.push(
      window.setTimeout(() => {
        setQueryVisible(true);
      }, scaleMs(120)),
    );

    timersRef.current.push(
      window.setTimeout(() => {
        let index = 0;
        typingIntervalRef.current = window.setInterval(() => {
          index += 1;
          setTypedLength(Math.min(index, config.queryPrompt.length));
          if (index >= config.queryPrompt.length && typingIntervalRef.current !== null) {
            window.clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
        }, scaleMs(42));
      }, scaleMs(260)),
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setAgentVisible(true);
      }, scaleMs(1080)),
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setSearchComplete(true);
      }, scaleMs(1600)),
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setHeaderVisible(true);
      }, scaleMs(1880)),
    );

    config.tableRows.forEach((_, index) => {
      timersRef.current.push(
        window.setTimeout(() => {
          setVisibleRows((current) => Math.max(current, index + 1));
        }, scaleMs(2100) + index * scaleMs(150)),
      );
    });

    timersRef.current.push(
      window.setTimeout(() => {
        setAnalysisComplete(true);
      }, scaleMs(3100)),
    );

    return () => {
      clearAllTimers();
    };
  }, [config.queryPrompt.length, config.tableRows, isVisible]);

  const typedPrompt = useMemo(() => config.queryPrompt.slice(0, typedLength), [config.queryPrompt, typedLength]);

  return (
    <div
      ref={elementRef}
      className="w-full rounded-[24px] border border-slate-200 bg-slate-50/60 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] lg:p-4"
    >
      <div
        className={cn(
          "rounded-xl border border-slate-300 bg-white px-4 py-2 font-mono text-[14px] tracking-tight text-slate-800 transition duration-300",
          queryVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <div className="flex items-center gap-3">
          <SearchIcon />
          <p className="min-h-[1.35rem] leading-5">
            {typedPrompt}
            {typedLength < config.queryPrompt.length ? <span className="ml-0.5 inline-block animate-pulse text-slate-500">▍</span> : null}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "mt-3 flex items-center justify-between font-mono text-[13px] leading-normal text-slate-700 transition duration-300",
          agentVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span>{config.statusLead}</span>
          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-[2px] text-[12px] text-slate-700">{config.statusPill}</span>
        </div>
        <span
          className={cn(
            "inline-flex h-5 w-5 items-center justify-center transition duration-200",
            searchComplete ? "opacity-100" : "opacity-0",
          )}
        >
          <CheckIcon />
        </span>
      </div>

      <div className="mt-3 w-full overflow-hidden rounded-xl border border-slate-300 bg-white">
        <div className={cn("border-b border-slate-200 transition duration-300", headerVisible ? "opacity-100" : "opacity-0")}>
          <div className="grid w-full font-mono text-xs font-semibold tracking-wide text-slate-600" style={{ gridTemplateColumns: config.tableGridTemplateColumns }}>
            {config.tableHeaders.map((head, index) => (
              <div key={head} className={cn("px-3.5 py-2", index > 0 ? "border-l border-slate-200" : "")}>
                {head}
              </div>
            ))}
          </div>
        </div>

        <div>
          {config.tableRows.map((row, index) => (
            <div
              key={`${row[0]}-${index}`}
              className={cn(
                "grid w-full border-b border-slate-200 font-mono text-[13px] text-slate-700 transition duration-200 last:border-b-0",
                visibleRows > index ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
              )}
              style={{ gridTemplateColumns: config.tableGridTemplateColumns }}
            >
              {row.map((value, cellIndex) => {
                const stockCellOptions = config.stockCellOptions;
                const shouldRenderStockCell = stockCellOptions && cellIndex === stockCellOptions.columnIndex;
                const stockMeta = shouldRenderStockCell ? stockCellOptions.logos[value] : null;

                return (
                  <div key={`${row[0]}-${cellIndex}`} className={cn("px-3.5 py-2", cellIndex > 0 ? "border-l border-slate-200" : "")}>
                    {shouldRenderStockCell ? (
                      <div className="flex items-center gap-2">
                        <StockLogo companyName={value} ticker={stockMeta?.ticker ?? "N/A"} domain={stockMeta?.domain} />
                        <span>{value}</span>
                      </div>
                    ) : (
                      value
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "mt-2 flex items-center gap-2 font-mono text-xs leading-normal text-slate-700 transition duration-300",
          analysisComplete ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <CheckIcon />
        <span>{config.completionLabel}</span>
        <button
          type="button"
          aria-label="複製結果"
          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <CopyIcon />
        </button>
      </div>
    </div>
  );
}
