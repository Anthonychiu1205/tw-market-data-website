"use client";

import { Play, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CodeBlock } from "@/src/components/docs/code-block";
import type { ApiReferenceContent, ApiStatusExample } from "@/src/content/docs-pages";
import { cn } from "@/src/lib/cn";

type ApiRunPlaygroundProps = {
  api: ApiReferenceContent;
  endpointTitle: string;
};

type ParamState = Record<string, string>;

function pickBaseUrlFromCurl(exampleCurl: string): string {
  const match = exampleCurl.match(/https?:\/\/[^\s"']+/);
  if (!match) return "https://api.twmarketdata.com";

  try {
    const parsed = new URL(match[0]);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "https://api.twmarketdata.com";
  }
}

function pickExampleQueryFromCurl(exampleCurl: string): URLSearchParams {
  const match = exampleCurl.match(/https?:\/\/[^\s"']+/);
  if (!match) return new URLSearchParams();

  try {
    const parsed = new URL(match[0]);
    return parsed.searchParams;
  } catch {
    return new URLSearchParams();
  }
}

function getLanguageFromType(type: string) {
  if (type.includes("date")) return "date";
  if (type.includes("int") || type.includes("number")) return "number";
  return "text";
}

function encodeQuery(params: ParamState, orderedKeys: string[]) {
  const searchParams = new URLSearchParams();
  for (const key of orderedKeys) {
    const value = params[key];
    if (!value?.trim()) continue;
    searchParams.set(key, value.trim());
  }
  return searchParams.toString();
}

function pickCompactOperationalHints(api: ApiReferenceContent) {
  const hints = [...(api.notes ?? []), ...(api.responseSummary ?? [])]
    .filter((text) => /coverage|freshness|data_gaps|source|lineage|資料|缺口|來源|時效/i.test(text))
    .map((text) => text.trim())
    .filter(Boolean);

  if (hints.length > 0) return hints.slice(0, 3);

  return [
    "資料可用範圍依 coverage 與 freshness 狀態標示。",
    "若存在資料缺口，回應可能包含 data_gaps 訊號。",
    "來源欄位以 source_role / lineage 說明可追溯性。",
  ];
}

export function ApiRunPlayground({ api, endpointTitle }: ApiRunPlaygroundProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [activeStatus, setActiveStatus] = useState<ApiStatusExample["status"]>(api.sidePanel.statusExamples[0]?.status ?? "200");
  const [queryValues, setQueryValues] = useState<ParamState>({});
  const [runNotice, setRunNotice] = useState("");

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  const baseUrl = useMemo(() => pickBaseUrlFromCurl(api.exampleRequestCurl), [api.exampleRequestCurl]);

  function openPlayground() {
    const queryFromExample = pickExampleQueryFromCurl(api.exampleRequestCurl);
    const initialValues: ParamState = {};
    for (const parameter of api.queryParameters ?? []) {
      initialValues[parameter.name] = queryFromExample.get(parameter.name) ?? "";
    }

    setQueryValues(initialValues);
    setActiveStatus(api.sidePanel.statusExamples[0]?.status ?? "200");
    setApiKey("");
    setRunNotice("");
    setIsOpen(true);
  }

  function handleRunPreview() {
    const hasMissingRequired = (api.queryParameters ?? []).some((parameter) => parameter.required && !queryValues[parameter.name]?.trim());

    if (hasMissingRequired) {
      const has400 = api.sidePanel.statusExamples.some((example) => example.status === "400");
      if (has400) setActiveStatus("400");
      setRunNotice("缺少必填參數，已切換到 400 範例。");
      return;
    }

    setActiveStatus("200");
    setRunNotice("已更新請求範例。");
  }

  useEffect(() => {
    if (!isOpen) return;

    lastActiveElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      lastActiveElementRef.current?.focus();
    };
  }, [isOpen]);

  const queryKeys = useMemo(() => (api.queryParameters ?? []).map((parameter) => parameter.name), [api.queryParameters]);

  const generatedCurl = useMemo(() => {
    const query = encodeQuery(queryValues, queryKeys);
    const maskedKey = apiKey.trim() ? apiKey.trim() : "<api-key>";
    const lines = [
      `curl --request ${api.method} \\`,
      `  --url \"${baseUrl}${api.endpoint}\" \\`,
      `  --header \"X-API-Key: ${maskedKey}\"`,
    ];

    if (query) {
      lines.push("  --get \\");
      for (const [name, value] of new URLSearchParams(query).entries()) {
        lines.push(`  --data-urlencode \"${name}=${value}\" \\`);
      }
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ \\\\$/, "");
    }

    return lines.join("\n");
  }, [api.endpoint, api.method, apiKey, baseUrl, queryKeys, queryValues]);

  const activeExample = useMemo(
    () => api.sidePanel.statusExamples.find((example) => example.status === activeStatus) ?? api.sidePanel.statusExamples[0],
    [activeStatus, api.sidePanel.statusExamples],
  );
  const operationalHints = useMemo(() => pickCompactOperationalHints(api), [api]);

  return (
    <>
      <button
        type="button"
        onClick={openPlayground}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white transition hover:bg-slate-800"
        aria-label="Run"
      >
        Run
        <Play className="h-3.5 w-3.5" />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <div aria-hidden="true" className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-3 md:p-7">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="api-playground-title"
              aria-describedby="api-playground-description"
              className="relative flex h-[min(720px,calc(100vh-72px))] w-full max-w-[1160px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="border-b border-slate-200/90 bg-slate-50/50 px-4 py-2.5 md:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="rounded border border-slate-300 bg-white px-2 py-0.5 font-semibold text-slate-800">{api.method}</span>
                      <code className="truncate font-mono text-slate-700">{api.endpoint}</code>
                    </div>
                    <p id="api-playground-title" className="truncate text-sm font-semibold text-slate-900">
                      {endpointTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRunPreview}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Run
                      <Play className="h-3.5 w-3.5" />
                    </button>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                      aria-label="關閉"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {runNotice ? <p className="pt-1 text-[11px] text-slate-500">{runNotice}</p> : null}
              </div>

              <div className="grid flex-1 min-h-0 grid-cols-1 md:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
                <div className="flex min-h-0 flex-col gap-3 border-b border-slate-200 p-4 md:border-b-0 md:border-r md:p-5">
                  <section className="space-y-1">
                    <h3 id="api-playground-description" className="text-sm font-semibold text-slate-900">
                      試跑 API 請求
                    </h3>
                    <p className="text-xs leading-5 text-slate-600">
                      填入參數，產生 cURL 與回應範例。實際資料依 coverage 與 freshness 為準。
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">授權</h4>
                    <div className="rounded-lg border border-slate-200 bg-white p-2">
                      <div className="mb-1.5 grid grid-cols-[232px_minmax(0,1fr)] items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-mono text-slate-700">X-API-Key</span>
                          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">必填</span>
                          <span className="text-[10px] text-slate-500">string</span>
                        </div>
                        <span className="text-[10px] text-slate-500">本頁不會儲存或記錄</span>
                      </div>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                        placeholder="輸入 X-API-Key"
                        className="h-9 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-xs text-slate-800 outline-none ring-slate-300 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                        autoComplete="off"
                      />
                    </div>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">查詢參數</h4>
                    <div className="max-h-[312px] overflow-y-auto rounded-lg border border-slate-200 bg-white">
                      <div className="sticky top-0 z-10 grid grid-cols-[232px_minmax(0,1fr)] gap-2 border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        <span>參數</span>
                        <span>值</span>
                      </div>
                      <div className="divide-y divide-slate-200">
                      {(api.queryParameters ?? []).map((parameter) => (
                        <div key={parameter.name} className="grid grid-cols-[232px_minmax(0,1fr)] items-center gap-2 px-3 py-2">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="truncate font-mono font-semibold text-slate-700">{parameter.name}</span>
                              <span className="text-[10px] text-slate-500">{parameter.type}</span>
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-medium",
                                parameter.required ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600",
                              )}
                            >
                              {parameter.required ? "必填" : "選填"}
                            </span>
                          </div>
                            <p className="line-clamp-1 text-[10px] leading-4 text-slate-500">{parameter.description}</p>
                          </div>
                          <input
                            type={getLanguageFromType(parameter.type) === "number" ? "number" : "text"}
                            value={queryValues[parameter.name] ?? ""}
                            onChange={(event) =>
                              setQueryValues((prev) => ({
                                ...prev,
                                [parameter.name]: event.target.value,
                              }))
                            }
                            className="h-9 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-xs text-slate-800 outline-none ring-slate-300 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                            placeholder={parameter.name}
                          />
                        </div>
                      ))}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">資料狀態</h4>
                    <div className="rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2.5">
                      <ul className="space-y-1.5 text-[11px] leading-5 text-slate-600">
                        {operationalHints.map((hint, index) => (
                          <li key={`${hint}-${index}`} className="flex gap-1.5">
                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                            <span className="line-clamp-2">{hint}</span>
                          </li>
                        ))}
                        <li className="flex gap-1.5">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                          <span>此區僅產生請求預覽，不會送出真實 API 請求。</span>
                        </li>
                      </ul>
                    </div>
                  </section>
                </div>

                <div className="flex min-h-0 flex-col gap-3 p-4 md:p-5">
                  <section className="space-y-1.5">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">請求範例</h4>
                    <CodeBlock
                      code={generatedCurl}
                      language="curl"
                      copyButtonVariant="icon"
                      className="bg-white"
                      wrapLines
                      contentClassName="max-h-[148px] overflow-y-auto overflow-x-hidden px-3 pb-3 pt-1.5 text-[12px] leading-5"
                    />
                  </section>

                  <section className="flex min-h-0 flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">回應範例</h4>
                      <div className="flex flex-wrap gap-1">
                        {api.sidePanel.statusExamples.map((example) => (
                          <button
                            key={example.status}
                            type="button"
                            onClick={() => setActiveStatus(example.status)}
                            className={cn(
                              "rounded-full border px-2 py-1 text-[11px] font-medium transition",
                              activeStatus === example.status
                                ? "border-slate-300 bg-slate-200 text-slate-900"
                                : "border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-700",
                            )}
                          >
                            {example.status}
                          </button>
                        ))}
                      </div>
                    </div>
                    {activeExample ? <p className="line-clamp-1 text-[11px] leading-5 text-slate-600">{activeExample.description}</p> : null}
                    <CodeBlock
                      code={activeExample?.body ?? "{}"}
                      language="json"
                      copyButtonVariant="icon"
                      className="bg-white"
                      wrapLines
                      contentClassName="max-h-[320px] overflow-y-auto overflow-x-hidden px-3 pb-3 pt-1.5 text-[12px] leading-5"
                    />
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
