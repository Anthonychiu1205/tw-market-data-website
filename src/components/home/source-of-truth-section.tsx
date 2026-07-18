"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy } from "lucide-react";

import { cn } from "@/src/lib/cn";
import { HOME_SOURCE_OF_TRUTH_ITEMS } from "@/src/content/home-source-of-truth";
import type { SourceOfTruthRealData } from "@/src/lib/homepage/demo-real-data-types";
import { MarketingContainer } from "@/src/components/ui/marketing-container";

const DEFAULT_ACTIVE_ID = "monthly_revenue";
const PUBLIC_SELLABLE_IDS = new Set(HOME_SOURCE_OF_TRUTH_ITEMS.map((item) => item.id));

type TokenType = "key" | "string" | "number" | "boolean" | "null" | "punctuation" | "text";

type Token = {
  text: string;
  type: TokenType;
};

function tokenizeJsonLine(line: string): Token[] {
  const tokens: Token[] = [];
  let rest = line;

  while (rest.length > 0) {
    const keyMatch = rest.match(/^"(?:\\.|[^"\\])*"(?=\s*:)/);
    if (keyMatch) {
      tokens.push({ text: keyMatch[0], type: "key" });
      rest = rest.slice(keyMatch[0].length);
      continue;
    }

    const stringMatch = rest.match(/^"(?:\\.|[^"\\])*"/);
    if (stringMatch) {
      tokens.push({ text: stringMatch[0], type: "string" });
      rest = rest.slice(stringMatch[0].length);
      continue;
    }

    const numberMatch = rest.match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (numberMatch) {
      tokens.push({ text: numberMatch[0], type: "number" });
      rest = rest.slice(numberMatch[0].length);
      continue;
    }

    const boolMatch = rest.match(/^(true|false)\b/);
    if (boolMatch) {
      tokens.push({ text: boolMatch[0], type: "boolean" });
      rest = rest.slice(boolMatch[0].length);
      continue;
    }

    const nullMatch = rest.match(/^null\b/);
    if (nullMatch) {
      tokens.push({ text: nullMatch[0], type: "null" });
      rest = rest.slice(nullMatch[0].length);
      continue;
    }

    const punctuationMatch = rest.match(/^[{}\[\]:,]/);
    if (punctuationMatch) {
      tokens.push({ text: punctuationMatch[0], type: "punctuation" });
      rest = rest.slice(punctuationMatch[0].length);
      continue;
    }

    tokens.push({ text: rest[0], type: "text" });
    rest = rest.slice(1);
  }

  return tokens;
}

function tokenClass(type: TokenType) {
  switch (type) {
    case "key":
      return "text-[#8b6a45]";
    case "string":
      return "text-[#a85f49]";
    case "number":
      return "text-[#4d6f8a]";
    case "boolean":
    case "null":
      return "text-[#5e6f81]";
    case "punctuation":
      return "text-slate-500";
    default:
      return "text-slate-700";
  }
}

export function SourceOfTruthSection({ realById }: { realById?: SourceOfTruthRealData["byId"] }) {
  const t = useTranslations("home.sourceOfTruth");
  const tc = useTranslations("common");
  const [activeId, setActiveId] = useState<string>(DEFAULT_ACTIVE_ID);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const publicItems = useMemo(
    () => HOME_SOURCE_OF_TRUTH_ITEMS.filter((item) => PUBLIC_SELLABLE_IDS.has(item.id)),
    [],
  );

  const activeItem = useMemo(
    () => publicItems.find((item) => item.id === activeId) ?? publicItems[0],
    [activeId, publicItems],
  );

  // Real response for the active item (server-fetched, passed down). When present we show the REAL
  // JSON + its real as_of; otherwise we fall back to the item's illustrative code with no date claim.
  const activeReal = realById?.[activeItem.id];
  const activeCode = activeReal?.code ?? activeItem.code;
  const activeAsOf = activeReal?.asOf ?? "";

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const threshold = 3;
    const maxScrollTop = container.scrollHeight - container.clientHeight;
    const nextIsScrollable = maxScrollTop > threshold;
    const nextIsAtTop = container.scrollTop <= threshold;
    const nextIsAtBottom = !nextIsScrollable || maxScrollTop - container.scrollTop <= threshold;

    setIsScrollable(nextIsScrollable);
    setIsAtTop(nextIsAtTop);
    setIsAtBottom(nextIsAtBottom);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollState();

    const handleResize = () => updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => {
      updateScrollState();
    });
    observer.observe(container);
    if (container.firstElementChild) {
      observer.observe(container.firstElementChild);
    }

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [updateScrollState]);

  return (
    <section className="bg-white py-10">
      <MarketingContainer className="space-y-7">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{t("heading")}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-0 border border-slate-200 bg-white lg:grid-cols-[42%_58%]">
          <div className="relative lg:border-r lg:border-slate-200">
            <div ref={scrollContainerRef} className="h-[320px] overflow-y-auto lg:h-[520px]">
              <div className="divide-y divide-slate-200">
                {publicItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className={cn(
                      "relative w-full px-4 py-3 text-left transition-colors",
                      activeItem.id === item.id ? "bg-slate-50" : "hover:bg-slate-50/70",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-0 h-full w-[2px] transition",
                        activeItem.id === item.id ? "bg-slate-400" : "bg-transparent",
                      )}
                      aria-hidden="true"
                    />
                    <p className={cn("text-sm", activeItem.id === item.id ? "font-semibold text-slate-900" : "font-medium text-slate-800")}>
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 hidden h-8 bg-gradient-to-b from-white via-white/85 to-transparent transition-opacity duration-150 lg:block",
                isScrollable && !isAtTop ? "opacity-100" : "opacity-0",
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 hidden h-8 bg-gradient-to-t from-white via-white/85 to-transparent transition-opacity duration-150 lg:block",
                isScrollable && !isAtBottom ? "opacity-100" : "opacity-0",
              )}
            />
          </div>

          <div className="flex min-h-[520px] flex-col">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold tracking-[0.08em] text-slate-500">RESPONSE</span>
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">{activeItem.status}</span>
                <span className="text-slate-400">•</span>
                <span className="font-medium tracking-tight text-slate-700">{activeItem.responseTitle}</span>
                {activeAsOf ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 ring-1 ring-emerald-200">{tc("realDataAsOf", { date: activeAsOf })}</span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 ring-1 ring-amber-200">{tc("illustrativeData")}</span>
                )}
                <span className="text-slate-400">•</span>
                <span className="font-mono text-[11px] text-slate-500">{activeItem.responseLabel}</span>
              </div>
              <button
                type="button"
                aria-label={t("copyResponse")}
                onClick={() => navigator.clipboard.writeText(activeCode)}
                className="inline-flex items-center justify-center bg-transparent p-0 text-slate-400 transition-colors hover:text-slate-700"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 bg-slate-50">
              <pre className="h-full overflow-x-auto overflow-y-auto bg-slate-50 px-4 py-3 text-xs leading-6">
                <code>
                  {activeCode.split("\n").map((line, lineIndex) => (
                    <span key={`${activeItem.id}-${lineIndex}`} className="block">
                      {tokenizeJsonLine(line).map((token, tokenIndex) => (
                        <span key={`${activeItem.id}-${lineIndex}-${tokenIndex}`} className={tokenClass(token.type)}>
                          {token.text}
                        </span>
                      ))}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
