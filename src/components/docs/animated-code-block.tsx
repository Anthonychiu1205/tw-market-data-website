"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
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

const JS_KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|await|async|try|catch|throw|new|class|import|from|export|default)\b/;
const PY_KEYWORDS = /\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|raise|with|lambda|pass|yield|True|False|None)\b/;

export function AnimatedCodeBlock({ tabs, lineDelayMs = 60, className }: AnimatedCodeBlockProps) {
  const t = useTranslations("docsDemo");
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [panelVisible, setPanelVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeTab = useMemo(() => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0], [tabs, activeTabId]);
  const codeLines = useMemo(() => (activeTab?.code ?? "").split("\n"), [activeTab]);
  const normalizedLanguage = activeTabId === "javascript" ? "javascript" : activeTabId === "python" ? "python" : "bash";

  const renderHighlightedLine = useCallback(
    (line: string, lineIndex: number) => {
      const commentDelimiter = normalizedLanguage === "python" ? "#" : "//";
      const commentIndex = line.indexOf(commentDelimiter);
      const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : "";
      const body = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
      const chunks = body.split(/(\s+|[(){}\[\],.:=<>+\-*/`])/g).filter((chunk) => chunk.length > 0);

      const tokens = chunks.map((chunk, chunkIndex) => {
        let className = "text-slate-700";
        if (/^\s+$/.test(chunk)) className = "text-slate-700";
        else if (/^(['"]).*(['"])$/.test(chunk)) className = "text-emerald-700";
        else if (/^-?\d+(\.\d+)?$/.test(chunk)) className = "text-violet-700";
        else if (normalizedLanguage === "javascript" && JS_KEYWORDS.test(chunk)) className = "text-blue-700";
        else if (normalizedLanguage === "python" && PY_KEYWORDS.test(chunk)) className = "text-blue-700";
        else if ((normalizedLanguage === "bash" || activeTabId === "curl") && chunk.startsWith("$")) className = "text-rose-700";

        return (
          <span key={`${lineIndex}-${chunkIndex}`} className={className}>
            {chunk}
          </span>
        );
      });

      if (commentPart) {
        tokens.push(
          <span key={`${lineIndex}-comment`} className="text-slate-500">
            {commentPart}
          </span>,
        );
      }

      return tokens.length ? tokens : "\u00A0";
    },
    [activeTabId, normalizedLanguage],
  );

  const onCopy = useCallback(async () => {
    if (!activeTab?.code) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeTab.code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = activeTab.code;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }, [activeTab]);

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
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-2 py-1">
        <div className="flex items-center gap-1">
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
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                  isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800"
          aria-label={copied ? t("copied") : t("copyCode")}
          title={copied ? t("copied") : t("copyCode")}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div
        className="transition-all duration-300"
        style={{
          opacity: panelVisible ? 1 : 0,
          transform: panelVisible ? "translateY(0px)" : "translateY(10px)",
        }}
      >
        <pre className="min-h-[220px] whitespace-pre-wrap break-words p-4 text-xs leading-7 text-slate-700">
          <code>
            {visibleLines.map((line, index) => (
              <div key={`${activeTab?.id ?? "code"}-${index}`} className="whitespace-pre-wrap break-words">
                {line.length > 0 ? renderHighlightedLine(line, index) : "\u00A0"}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
