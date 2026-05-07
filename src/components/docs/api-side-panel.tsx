"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import type { ApiCodeExamples, ApiStatusExample } from "@/src/content/docs-pages";
import { cn } from "@/src/lib/cn";

type ApiSidePanelProps = {
  requestExample?: string;
  codeExamples?: ApiCodeExamples;
  statusExamples: ApiStatusExample[];
};

type ScrollableCodeBlockProps = {
  copyValue: string;
  contentKey: string;
  headerLabel?: string;
  header?: ReactNode;
  children: ReactNode;
};

type CodeTabId = "python" | "javascript" | "curl";

const codeTabLabels: Record<CodeTabId, string> = {
  python: "Python",
  javascript: "JavaScript",
  curl: "cURL",
};

function highlightJson(json: string) {
  const tokenRegex =
    /(\"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\\"])*\"\s*:|\"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\\"])*\"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(json)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(json.slice(lastIndex, match.index));
    }

    const token = match[0];
    let className = "text-slate-500";

    if (/^\".*\":$/.test(token)) className = "text-amber-700";
    else if (/^\"/.test(token)) className = "text-rose-700";
    else if (/^(true|false)$/.test(token)) className = "text-cyan-700";
    else if (/^null$/.test(token)) className = "text-slate-500";
    else className = "text-sky-700";

    nodes.push(
      <span key={`${match.index}-${token}`} className={className}>
        {token}
      </span>,
    );

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < json.length) {
    nodes.push(json.slice(lastIndex));
  }

  return nodes;
}

function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        } catch {
          setCopied(false);
        }
      }}
      className={cn(
        "inline-flex h-7 items-center rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-medium leading-none text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800",
        className,
      )}
      aria-label="複製"
    >
      {copied ? "已複製" : "複製"}
    </button>
  );
}

function ScrollableCodeBlock({ copyValue, contentKey, header, headerLabel, children }: ScrollableCodeBlockProps) {
  const scrollRef = useRef<HTMLElement | null>(null);
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const updateFade = () => {
      const overflow = element.scrollHeight - element.clientHeight > 2;
      const atBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 2;
      setShowFade(overflow && !atBottom);
    };

    const onScroll = () => updateFade();

    element.scrollTop = 0;
    window.requestAnimationFrame(updateFade);
    element.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateFade);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            updateFade();
          })
        : null;

    resizeObserver?.observe(element);

    return () => {
      element.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateFade);
      resizeObserver?.disconnect();
    };
  }, [contentKey]);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      {header || headerLabel ? (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2">
          <div className="min-w-0">
            {header ? header : <span className="text-[11px] font-medium text-slate-500">{headerLabel}</span>}
          </div>
          <CopyButton value={copyValue} className="shrink-0 opacity-70 group-hover:opacity-100 group-focus-within:opacity-100" />
        </div>
      ) : (
        <CopyButton
          value={copyValue}
          className="absolute right-3 top-3 z-10 opacity-35 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
        />
      )}
      <pre
        ref={scrollRef as React.RefObject<HTMLPreElement>}
        className="max-h-[320px] overflow-auto px-3 pb-3 pt-2.5 pr-2 text-[11.5px] leading-[1.5] text-slate-700 lg:max-h-[420px]"
      >
        <code>{children}</code>
      </pre>
      {showFade ? <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-50 to-transparent" /> : null}
    </div>
  );
}

export function ApiSidePanel({ requestExample, codeExamples, statusExamples }: ApiSidePanelProps) {
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTabId>("curl");
  const [activeStatus, setActiveStatus] = useState<ApiStatusExample["status"]>(statusExamples[0]?.status ?? "200");

  const resolvedCodeExamples: ApiCodeExamples = useMemo(
    () =>
      codeExamples ?? {
        python: requestExample ?? "# request example not provided",
        javascript: requestExample ?? "// request example not provided",
        curl: requestExample ?? "curl -X GET https://api.twmarketdata.com/v1/example",
      },
    [codeExamples, requestExample],
  );

  const activeRequestCode = resolvedCodeExamples[activeCodeTab];
  const activeExample = useMemo(
    () => statusExamples.find((example) => example.status === activeStatus) ?? statusExamples[0],
    [activeStatus, statusExamples],
  );

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">請求範例</p>
        <ScrollableCodeBlock
          copyValue={activeRequestCode}
          contentKey={`${activeCodeTab}-${activeRequestCode}`}
          header={
            <div className="flex gap-1">
              {(["python", "javascript", "curl"] as CodeTabId[]).map((tab) => {
                const isActive = activeCodeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCodeTab(tab)}
                    className={cn(
                      "inline-flex h-7 items-center rounded-md px-2.5 text-[11px] font-medium leading-none transition",
                      isActive ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:text-slate-800",
                    )}
                  >
                    {codeTabLabels[tab]}
                  </button>
                );
              })}
            </div>
          }
        >
          {activeRequestCode}
        </ScrollableCodeBlock>
      </section>

      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">狀態碼</p>
        <div className="flex flex-wrap gap-2">
          {statusExamples.map((example) => (
            <button
              key={example.status}
              type="button"
              onClick={() => setActiveStatus(example.status)}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium transition",
                activeStatus === example.status ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:text-slate-700",
              )}
            >
              {example.status}
            </button>
          ))}
        </div>
      </section>

      {activeExample ? (
        <section className="space-y-2">
          <p className="text-xs text-slate-600">{activeExample.description}</p>
          <ScrollableCodeBlock copyValue={activeExample.body} contentKey={`${activeStatus}-${activeExample.body}`} headerLabel="JSON">
            {highlightJson(activeExample.body)}
          </ScrollableCodeBlock>
        </section>
      ) : null}
    </div>
  );
}
