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

export function ApiRunPlayground({ api, endpointTitle }: ApiRunPlaygroundProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [activeStatus, setActiveStatus] = useState<ApiStatusExample["status"]>(api.sidePanel.statusExamples[0]?.status ?? "200");
  const [queryValues, setQueryValues] = useState<ParamState>({});

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
    setIsOpen(true);
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
    const requestUrl = query ? `${baseUrl}${api.endpoint}?${query}` : `${baseUrl}${api.endpoint}`;
    const maskedKey = apiKey.trim() ? apiKey.trim() : "<api-key>";

    return [
      `curl --request ${api.method} \\`,
      `  --url \"${requestUrl}\" \\`,
      `  --header \"X-API-Key: ${maskedKey}\"`,
    ].join("\n");
  }, [api.endpoint, api.method, apiKey, baseUrl, queryKeys, queryValues]);

  const activeExample = useMemo(
    () => api.sidePanel.statusExamples.find((example) => example.status === activeStatus) ?? api.sidePanel.statusExamples[0],
    [activeStatus, api.sidePanel.statusExamples],
  );

  return (
    <>
      <button
        type="button"
        onClick={openPlayground}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-700"
        aria-label="Run"
      >
        Run
        <Play className="h-3.5 w-3.5" />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <div aria-hidden="true" className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-3 md:p-6">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="api-playground-title"
              aria-describedby="api-playground-description"
              className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 md:px-6">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="rounded border border-slate-300 bg-slate-50 px-2 py-0.5 font-semibold text-slate-800">{api.method}</span>
                    <code className="truncate font-mono text-slate-700">{api.endpoint}</code>
                  </div>
                  <p id="api-playground-title" className="truncate text-sm font-semibold text-slate-900">
                    {endpointTitle}
                  </p>
                </div>
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

              <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-2">
                <div className="space-y-6 border-b border-slate-200 p-4 md:border-b-0 md:border-r md:p-6">
                  <section className="space-y-2">
                    <h3 id="api-playground-description" className="text-sm font-semibold text-slate-900">
                      試跑 API 請求
                    </h3>
                    <p className="text-xs leading-6 text-slate-600">
                      填入參數後，產生對應的 cURL 與回應範例。實際可用資料依方案、coverage 與 freshness 狀態為準。
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">授權</h4>
                    <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-slate-700">X-API-Key</span>
                        <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">必填</span>
                        <span className="text-slate-500">string</span>
                      </div>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                        placeholder="輸入 X-API-Key"
                        className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none ring-slate-300 placeholder:text-slate-400 focus:ring-2"
                        autoComplete="off"
                      />
                      <p className="text-[11px] leading-5 text-slate-500">API key 僅用於產生本次請求範例；本頁不會儲存或記錄。</p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">查詢參數</h4>
                    <div className="space-y-2">
                      {(api.queryParameters ?? []).map((parameter) => (
                        <div key={parameter.name} className="rounded-lg border border-slate-200 bg-white p-3">
                          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono font-semibold text-slate-700">{parameter.name}</span>
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-medium",
                                parameter.required ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600",
                              )}
                            >
                              {parameter.required ? "必填" : "選填"}
                            </span>
                            <span className="text-slate-500">{parameter.type}</span>
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
                            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none ring-slate-300 placeholder:text-slate-400 focus:ring-2"
                            placeholder={`輸入 ${parameter.name}`}
                          />
                          <p className="mt-2 text-[11px] leading-5 text-slate-500">{parameter.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-6 p-4 md:p-6">
                  <section className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">請求範例</h4>
                    <CodeBlock code={generatedCurl} language="curl" copyButtonVariant="icon" />
                  </section>

                  <section className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">回應範例</h4>
                      <div className="flex flex-wrap gap-1">
                        {api.sidePanel.statusExamples.map((example) => (
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
                    </div>
                    {activeExample ? <p className="text-xs leading-6 text-slate-600">{activeExample.description}</p> : null}
                    <CodeBlock code={activeExample?.body ?? "{}"} language="json" copyButtonVariant="icon" />
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
