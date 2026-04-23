"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/src/lib/cn";
import { useReplayOnVisible } from "@/src/hooks/use-replay-on-visible";

const QUERY_PROMPT = "分析台積電近 5 年公告中的資本支出與先進製程重點";
const DOCUMENTS = ["2025 年報", "2024 年報", "2024Q4 法說摘要", "重大訊息", "財報附註"];
const RESULT_ROWS = [
  { year: "2025", source: "年報", summary: "持續擴大先進封裝產能" },
  { year: "2024", source: "法說摘要", summary: "資本支出維持高檔" },
  { year: "2023", source: "重大訊息", summary: "海外擴產進度更新" },
  { year: "2022", source: "年報", summary: "製程升級帶動毛利改善" },
];

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

export function AgentDocumentsDemo() {
  const { elementRef, isVisible } = useReplayOnVisible<HTMLDivElement>({
    threshold: 0.4,
    rootMargin: "0px 0px -8% 0px",
  });

  const timersRef = useRef<number[]>([]);
  const typingIntervalRef = useRef<number | null>(null);

  const [queryVisible, setQueryVisible] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [pullingVisible, setPullingVisible] = useState(false);
  const [visibleDocs, setVisibleDocs] = useState(0);
  const [extractVisible, setExtractVisible] = useState(false);
  const [tableHeaderVisible, setTableHeaderVisible] = useState(false);
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
      setPullingVisible(false);
      setVisibleDocs(0);
      setExtractVisible(false);
      setTableHeaderVisible(false);
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

    timersRef.current.push(window.setTimeout(() => setQueryVisible(true), 120));
    timersRef.current.push(
      window.setTimeout(() => {
        let index = 0;
        typingIntervalRef.current = window.setInterval(() => {
          index += 1;
          setTypedLength(Math.min(index, QUERY_PROMPT.length));
          if (index >= QUERY_PROMPT.length && typingIntervalRef.current !== null) {
            window.clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
        }, 40);
      }, 240),
    );
    timersRef.current.push(window.setTimeout(() => setPullingVisible(true), 980));

    DOCUMENTS.forEach((_, index) => {
      timersRef.current.push(window.setTimeout(() => setVisibleDocs((current) => Math.max(current, index + 1)), 1360 + index * 120));
    });

    timersRef.current.push(window.setTimeout(() => setExtractVisible(true), 2120));
    timersRef.current.push(window.setTimeout(() => setTableHeaderVisible(true), 2360));

    RESULT_ROWS.forEach((_, index) => {
      timersRef.current.push(window.setTimeout(() => setVisibleRows((current) => Math.max(current, index + 1)), 2520 + index * 150));
    });

    timersRef.current.push(window.setTimeout(() => setAnalysisComplete(true), 3340));

    return () => {
      clearAllTimers();
    };
  }, [isVisible]);

  const typedPrompt = useMemo(() => QUERY_PROMPT.slice(0, typedLength), [typedLength]);

  return (
    <div
      ref={elementRef}
      className="w-full rounded-[24px] border border-slate-200 bg-slate-50/60 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] lg:p-4"
    >
      <div
        className={cn(
          "rounded-xl border border-slate-300 bg-white px-4 py-2 font-mono text-[14px] tracking-tight text-slate-800 transition duration-500",
          queryVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <div className="flex items-center gap-3">
          <SearchIcon />
          <p className="min-h-[1.35rem] leading-5">
            {typedPrompt}
            {typedLength < QUERY_PROMPT.length ? <span className="ml-0.5 inline-block animate-pulse text-slate-500">▍</span> : null}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "mt-3 flex items-center justify-between font-mono text-[13px] leading-normal text-slate-700 transition duration-500",
          pullingVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <span>Agent: pulling 公司公告與財報附註</span>
        <CheckIcon />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {DOCUMENTS.map((doc, index) => (
          <div
            key={doc}
            className={cn(
              "rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-[12px] text-slate-700 transition duration-300",
              visibleDocs > index ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
            )}
          >
            {doc}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-3 flex items-center justify-between font-mono text-[13px] leading-normal text-slate-700 transition duration-500",
          extractVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <span>Agent: extracting 關鍵段落</span>
        <CheckIcon />
      </div>

      <div className="mt-3 w-full overflow-hidden rounded-xl border border-slate-300 bg-white">
        <div className={cn("border-b border-slate-200 transition duration-500", tableHeaderVisible ? "opacity-100" : "opacity-0")}>
          <div className="grid w-full grid-cols-[0.8fr_0.9fr_2.2fr] font-mono text-xs font-semibold tracking-wide text-slate-600">
            {["年度", "來源", "摘要"].map((head, index) => (
              <div key={head} className={cn("px-3.5 py-2", index > 0 ? "border-l border-slate-200" : "")}>
                {head}
              </div>
            ))}
          </div>
        </div>

        <div>
          {RESULT_ROWS.map((row, index) => (
            <div
              key={`${row.year}-${row.source}`}
              className={cn(
                "grid w-full grid-cols-[0.8fr_0.9fr_2.2fr] border-b border-slate-200 font-mono text-[13px] text-slate-700 transition duration-300 last:border-b-0",
                visibleRows > index ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
              )}
            >
              {[row.year, row.source, row.summary].map((value, cellIndex) => (
                <div key={`${row.year}-${cellIndex}`} className={cn("px-3.5 py-2", cellIndex > 0 ? "border-l border-slate-200" : "")}>
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "mt-2 flex items-center gap-2 font-mono text-xs leading-normal text-slate-700 transition duration-500",
          analysisComplete ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <CheckIcon />
        <span>Agent: analysis complete.</span>
      </div>
    </div>
  );
}

