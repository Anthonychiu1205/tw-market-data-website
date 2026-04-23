"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/src/lib/cn";

type CodeTab = {
  id: string;
  label: string;
  code: string;
};

type AnimatedCodeBlockProps = {
  tabs: CodeTab[];
  lineDelayMs?: number;
  className?: string;
};

export function AnimatedCodeBlock({ tabs, lineDelayMs = 60, className }: AnimatedCodeBlockProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [panelVisible, setPanelVisible] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeTab = useMemo(() => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0], [tabs, activeTabId]);
  const codeLines = useMemo(() => (activeTab?.code ?? "").split("\n"), [activeTab]);
  const triggerReplay = useCallback(() => {
    setPanelVisible(false);
    setVisibleLineCount(0);
    setReplayToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && !hasEnteredViewport) {
          setHasEnteredViewport(true);
          triggerReplay();
        }
      },
      {
        rootMargin: "0px 0px -15% 0px",
        threshold: [0.2],
      },
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [hasEnteredViewport, triggerReplay]);

  useEffect(() => {
    if (!hasEnteredViewport) return;

    let animationFrame = 0;
    let fadeFrame = 0;
    const startAt = performance.now();

    fadeFrame = window.requestAnimationFrame(() => {
      setPanelVisible(true);
    });

    const step = (timestamp: number) => {
      const elapsed = timestamp - startAt;
      const count = Math.min(codeLines.length, Math.max(1, Math.floor(elapsed / lineDelayMs) + 1));
      setVisibleLineCount(count);

      if (count < codeLines.length) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (fadeFrame) window.cancelAnimationFrame(fadeFrame);
    };
  }, [codeLines, hasEnteredViewport, lineDelayMs, replayToken]);

  const visibleLines = hasEnteredViewport ? codeLines.slice(0, visibleLineCount) : codeLines;

  return (
    <div ref={rootRef} className={cn("overflow-hidden rounded-xl border border-slate-200 bg-slate-50", className)}>
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white p-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === activeTabId) return;
                setActiveTabId(tab.id);
                if (hasEnteredViewport) {
                  triggerReplay();
                }
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition",
                isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="transition-all duration-300"
        style={{
          opacity: panelVisible ? 1 : 0,
          transform: panelVisible ? "translateY(0px)" : "translateY(10px)",
        }}
      >
        <pre className="min-h-[220px] overflow-x-auto p-4 text-xs leading-7 text-slate-700">
          <code>
            {visibleLines.map((line, index) => (
              <div key={`${activeTab?.id ?? "code"}-${index}`} className="whitespace-pre">
                {line.length > 0 ? line : "\u00A0"}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
