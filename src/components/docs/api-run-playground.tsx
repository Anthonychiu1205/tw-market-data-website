"use client";

import { Braces, Boxes, Check, ChevronDown, Code2, Coffee, Copy, Download, FileCode2, Gem, Play, Terminal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CodeBlock, type CodeBlockLanguage } from "@/src/components/docs/code-block";
import type { ApiReferenceContent, ApiStatusExample } from "@/src/content/docs-pages";
import { cn } from "@/src/lib/cn";
import { buildRunUrl, createLiveRunResult, mapRunErrorNotice, validateApiKey } from "@/src/lib/docs/run-playground";

type ApiRunPlaygroundProps = {
  api: ApiReferenceContent;
  endpointTitle: string;
};

type ParamState = Record<string, string>;
type RequestLanguage = "curl" | "python" | "javascript" | "php" | "go" | "java" | "ruby";

type RequestLanguageOption = {
  id: RequestLanguage;
  label: string;
  icon: typeof Terminal;
};

type LiveResult = {
  status: string;
  body: string;
  querySignature: string;
  generatedAt: string;
  isLive: true;
  usageCounted: boolean;
};

const REQUEST_LANGUAGE_OPTIONS: RequestLanguageOption[] = [
  { id: "curl", label: "cURL", icon: Terminal },
  { id: "python", label: "Python", icon: FileCode2 },
  { id: "javascript", label: "JavaScript", icon: Code2 },
  { id: "php", label: "PHP", icon: Braces },
  { id: "go", label: "Go", icon: Boxes },
  { id: "java", label: "Java", icon: Coffee },
  { id: "ruby", label: "Ruby", icon: Gem },
];

const RESPONSE_STATUS_ORDER = ["200", "400", "401", "403", "404"] as const;

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

function collectQueryEntries(params: ParamState, orderedKeys: string[]) {
  return orderedKeys
    .map((key) => [key, params[key]?.trim() ?? ""] as const)
    .filter(([, value]) => value.length > 0);
}

function toObjectCode(entries: readonly (readonly [string, string])[], indent = "  ") {
  if (entries.length === 0) return "{}";
  return `\n${entries
    .map(([name, value]) => `${indent}"${name}": "${value}"`)
    .join(",\n")}\n`;
}

function buildCurlSnippet(method: string, url: string, entries: readonly (readonly [string, string])[]) {
  const lines = [
    `curl --request ${method} \\`,
    `  --url '${url}' \\`,
    `  --header 'X-API-Key: $TWMD_API_KEY'`,
  ];

  if (entries.length > 0) {
    lines.push("  --get \\");
    for (const [name, value] of entries) {
      lines.push(`  --data-urlencode \"${name}=${value}\" \\`);
    }
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ \\$/, "");
  }

  return lines.join("\n");
}

function buildRequestSnippet(
  language: RequestLanguage,
  method: string,
  url: string,
  entries: readonly (readonly [string, string])[],
) {
  const objectLiteral = toObjectCode(entries);

  if (language === "curl") {
    return buildCurlSnippet(method, url, entries);
  }

  if (language === "python") {
    return [
      "import requests",
      "",
      `url = \"${url}\"`,
      'headers = {"X-API-Key": "$TWMD_API_KEY"}',
      `params = ${objectLiteral === "{}" ? "{}" : `{${objectLiteral}}`}`,
      "",
      "response = requests.get(url, headers=headers, params=params)",
      "data = response.json()",
    ].join("\n");
  }

  if (language === "javascript") {
    const setLines = entries.map(([name, value]) => `url.searchParams.set(\"${name}\", \"${value}\");`);
    return [
      `const url = new URL(\"${url}\");`,
      ...(setLines.length ? [...setLines, ""] : []),
      "const response = await fetch(url, {",
      '  headers: { "X-API-Key": "$TWMD_API_KEY" },',
      "});",
      "const data = await response.json();",
    ].join("\n");
  }

  if (language === "php") {
    const query = entries.length ? `$params = [${entries.map(([name, value]) => `\"${name}\" => \"${value}\"`).join(", ")}];` : "$params = [];";
    return [
      "<?php",
      `$url = \"${url}\";`,
      query,
      "$ch = curl_init($url . (!empty($params) ? '?' . http_build_query($params) : ''));",
      'curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-API-Key: $TWMD_API_KEY"]);',
      "curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);",
      "$response = curl_exec($ch);",
      "curl_close($ch);",
    ].join("\n");
  }

  if (language === "go") {
    const valueLines = entries.map(([name, value]) => `params.Set(\"${name}\", \"${value}\")`);
    return [
      'package main',
      '',
      'import (',
      '  \"net/http\"',
      '  \"net/url\"',
      ')',
      '',
      `u, _ := url.Parse(\"${url}\")`,
      'params := url.Values{}',
      ...valueLines,
      'u.RawQuery = params.Encode()',
      `req, _ := http.NewRequest(\"${method}\", u.String(), nil)`,
      'req.Header.Set("X-API-Key", "$TWMD_API_KEY")',
      'client := &http.Client{}',
      'res, _ := client.Do(req)',
      '_ = res',
    ].join("\n");
  }

  if (language === "java") {
    const setLines = entries.map(([name, value]) => `      .queryParam(\"${name}\", \"${value}\")`);
    return [
      'HttpRequest request = HttpRequest.newBuilder()',
      `  .uri(URI.create(\"${url}\"))`,
      ...setLines,
      '  .header("X-API-Key", "$TWMD_API_KEY")',
      `  .method(\"${method}\", HttpRequest.BodyPublishers.noBody())`,
      '  .build();',
    ].join("\n");
  }

  return [
    "require 'net/http'",
    "require 'uri'",
    "",
    `uri = URI(\"${url}\")`,
    ...(entries.length
      ? [
          `params = { ${entries.map(([name, value]) => `${name}: \"${value}\"`).join(", ")} }`,
          "uri.query = URI.encode_www_form(params)",
        ]
      : []),
    "req = Net::HTTP::Get.new(uri)",
    "req['X-API-Key'] = '$TWMD_API_KEY'",
    "res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }",
  ].join("\n");
}

function toCompactExampleJson(body: string, status: string) {
  try {
    const parsed = JSON.parse(body) as Record<string, unknown>;

    if (status !== "200") {
      return JSON.stringify(parsed, null, 2);
    }

    const rows = Array.isArray(parsed.rows) ? parsed.rows : Array.isArray(parsed.data) ? parsed.data : [];
    const first = rows[0] && typeof rows[0] === "object" ? (rows[0] as Record<string, unknown>) : undefined;

    if (!first) return JSON.stringify(parsed, null, 2);

    const preferredKeys = ["symbol", "ticker", "trade_date", "date", "open", "high", "low", "close", "volume", "volume_shares"];
    const compactRow: Record<string, unknown> = {};
    for (const key of preferredKeys) {
      if (key in first) compactRow[key] = first[key];
    }
    if (Object.keys(compactRow).length === 0) {
      for (const key of Object.keys(first).slice(0, 8)) {
        compactRow[key] = first[key];
      }
    }

    const compact: Record<string, unknown> = {};
    if (typeof parsed.dataset === "string") compact.dataset = parsed.dataset;
    if (typeof parsed.count === "number") compact.count = parsed.count;
    compact.rows = [compactRow];
    if (parsed.meta && typeof parsed.meta === "object") compact.meta = parsed.meta;
    if (Array.isArray(parsed.data_gaps)) compact.data_gaps = parsed.data_gaps;

    return JSON.stringify(compact, null, 2);
  } catch {
    return body;
  }
}

function fallbackStatusBody(status: string) {
  return JSON.stringify(
    {
      error: {
        code: `status_${status.toLowerCase()}`,
        message: "此 endpoint 尚未提供對應狀態範例，請參考文件正文。",
      },
    },
    null,
    2,
  );
}

export function ApiRunPlayground({ api, endpointTitle }: ApiRunPlaygroundProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [requestLanguage, setRequestLanguage] = useState<RequestLanguage>("curl");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState<ApiStatusExample["status"]>("200");
  const [queryValues, setQueryValues] = useState<ParamState>({});
  const [runNotice, setRunNotice] = useState("");
  const [liveResult, setLiveResult] = useState<LiveResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [resultCopied, setResultCopied] = useState(false);

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
    setActiveStatus("200");
    setApiKey("");
    setRequestLanguage("curl");
    setIsLanguageMenuOpen(false);
    setRunNotice("");
    setLiveResult(null);
    setIsRunning(false);
    setResultCopied(false);
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) return;

    lastActiveElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLanguageMenuOpen(false);
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
  const queryEntries = useMemo(() => collectQueryEntries(queryValues, queryKeys), [queryKeys, queryValues]);
  const querySignature = useMemo(() => JSON.stringify(queryEntries), [queryEntries]);
  const requestExampleCode = useMemo(
    () => buildRequestSnippet(requestLanguage, api.method, `${baseUrl}${api.endpoint}`, queryEntries),
    [api.endpoint, api.method, baseUrl, queryEntries, requestLanguage],
  );

  const statusExampleMap = useMemo(() => {
    const map = new Map<string, ApiStatusExample>();
    for (const example of api.sidePanel.statusExamples) {
      map.set(example.status, example);
    }
    return map;
  }, [api.sidePanel.statusExamples]);

  const activeExample = statusExampleMap.get(activeStatus);
  const liveResultIsStale = Boolean(liveResult && liveResult.querySignature !== querySignature);
  const responseCode = useMemo(() => {
    const raw = activeExample?.body ?? fallbackStatusBody(activeStatus);
    return toCompactExampleJson(raw, activeStatus);
  }, [activeExample?.body, activeStatus]);
  const liveResultCode = useMemo(() => {
    if (!liveResult) return "";
    return liveResult.body;
  }, [liveResult]);

  async function handleRunLiveRequest() {
    const keyValidation = validateApiKey(apiKey);
    if (!keyValidation.ok) {
      setRunNotice(keyValidation.reason === "missing" ? "請先輸入 API key。" : "請輸入有效 API key，而不是範例或遮罩文字。");
      return;
    }

    const hasMissingRequired = (api.queryParameters ?? []).some((parameter) => parameter.required && !queryValues[parameter.name]?.trim());
    if (hasMissingRequired) {
      setRunNotice("缺少必填參數，請補齊後再執行。");
      return;
    }

    const runUrl = buildRunUrl(api.endpoint, queryEntries);
    setIsRunning(true);
      setRunNotice("Running...");
    setResultCopied(false);

    try {
      const response = await fetch(runUrl, {
        method: api.method,
        headers: {
          "X-API-Key": apiKey.trim(),
        },
        cache: "no-store",
      });
      const rawBody = await response.text();
      const normalizedBody = toCompactExampleJson(rawBody || fallbackStatusBody(String(response.status)), String(response.status));
      const statusCode = String(response.status) as ApiStatusExample["status"];

      if (RESPONSE_STATUS_ORDER.includes(statusCode as (typeof RESPONSE_STATUS_ORDER)[number])) {
        setActiveStatus(statusCode as ApiStatusExample["status"]);
      }

      setLiveResult({
        ...createLiveRunResult(response.status, normalizedBody),
        querySignature,
        generatedAt: new Date().toISOString(),
        isLive: true,
      });

      let notice = "";
      if (!response.ok) {
        let errorCode = "";
        let requestId = "";
        try {
          const payload = JSON.parse(rawBody || "{}") as {
            error?: { code?: string };
            requestId?: string;
          };
          errorCode = payload.error?.code ?? "";
          requestId = payload.requestId ?? "";
        } catch {
          // keep fallback notice mapping by status only.
        }
        notice = mapRunErrorNotice({
          status: response.status,
          errorCode,
          requestId,
        });
      }
      setRunNotice(response.ok ? "Response updated." : notice);
    } catch {
      setLiveResult({
        status: "network_error",
        body: JSON.stringify(
          {
            error: {
              code: "network_error",
              message: "無法連線到 API，請稍後再試。",
            },
          },
          null,
          2,
        ),
        querySignature,
        generatedAt: new Date().toISOString(),
        isLive: true,
        usageCounted: false,
      });
      setRunNotice("");
    } finally {
      setIsRunning(false);
    }
  }

  async function handleCopyResult() {
    if (!liveResultCode) return;
    try {
      await navigator.clipboard.writeText(liveResultCode);
      setResultCopied(true);
      window.setTimeout(() => setResultCopied(false), 1500);
    } catch {
      setResultCopied(false);
    }
  }

  function handleDownloadResult() {
    if (!liveResultCode) return;
    const blob = new Blob([liveResultCode], { type: "application/json" });
    const link = document.createElement("a");
    const status = liveResult?.status ?? "200";
    link.href = URL.createObjectURL(blob);
    link.download = `live-result-${status}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  const requestLanguageMeta = REQUEST_LANGUAGE_OPTIONS.find((item) => item.id === requestLanguage) ?? REQUEST_LANGUAGE_OPTIONS[0];
  const RequestLanguageIcon = requestLanguageMeta.icon;

  const requestHeader = (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">請求範例</span>
      </div>
      <div className="relative z-[90]">
        <button
          type="button"
          onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          aria-haspopup="menu"
          aria-expanded={isLanguageMenuOpen}
          aria-label="選擇請求範例語言"
        >
          <RequestLanguageIcon className="h-3.5 w-3.5 text-slate-500" />
          <span>{requestLanguageMeta.label}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
        {isLanguageMenuOpen ? (
          <div className="absolute right-0 top-9 z-[100] w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
            {REQUEST_LANGUAGE_OPTIONS.map((option) => {
              const OptionIcon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setRequestLanguage(option.id);
                    setIsLanguageMenuOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded px-2 py-1.5 text-xs transition",
                    option.id === requestLanguage ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <OptionIcon className="h-3.5 w-3.5 text-slate-500" />
                    <span>{option.label}</span>
                  </span>
                  {option.id === requestLanguage ? <Check className="h-3.5 w-3.5 text-slate-500" /> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );

  const responseHeader = (
    <div className="flex w-full flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className={cn("inline-block h-2.5 w-2.5 rounded-full", activeStatus === "200" ? "bg-emerald-500/70" : "bg-amber-600/70")} />
        <span className="text-[11px] font-semibold text-slate-700">Example / Sample response</span>
      </div>
      <div className="flex items-center gap-1">
        {RESPONSE_STATUS_ORDER.map((status) => {
          const exists = statusExampleMap.has(status);
          return (
            <button
              key={status}
              type="button"
              onClick={() => setActiveStatus(status)}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-medium transition",
                activeStatus === status ? "border-slate-300 bg-slate-200 text-slate-900" : "border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-700",
                !exists && "opacity-60",
              )}
            >
              {status}
            </button>
          );
        })}
        <span className="ml-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">Sample</span>
      </div>
    </div>
  );

  const requestCodeLanguage: CodeBlockLanguage = requestLanguage === "curl" ? "curl" : requestLanguage === "javascript" ? "javascript" : requestLanguage === "python" ? "python" : "text";

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
                      onClick={() => void handleRunLiveRequest()}
                      disabled={isRunning}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isRunning ? "Running..." : "Run"}
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

              <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
                <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-4 md:border-b-0 md:border-r md:p-5">
                  <section className="space-y-1 border-b border-slate-200 pb-3">
                    <h3 id="api-playground-description" className="text-sm font-semibold text-slate-900">
                      試跑 API 請求
                    </h3>
                    <p className="text-xs leading-5 text-slate-600">填入參數後可呼叫真實 API，並在此查看即時回應。</p>
                  </section>

                  <section className="pt-2">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Authorization</h4>
                    <div className="mt-1.5 border-b border-slate-200 pb-3">
                      <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[minmax(280px,1fr)_minmax(280px,340px)] md:gap-4">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-sm font-semibold text-slate-900">X-API-Key</span>
                            <span className="text-xs text-slate-500">string</span>
                            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">必填</span>
                          </div>
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
                    </div>
                  </section>

                  <section className="pt-3">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Query</h4>
                    <div className="mt-1 max-h-[426px] overflow-y-auto">
                      {(api.queryParameters ?? []).map((parameter) => (
                        <div key={parameter.name} className="border-b border-slate-200 py-3.5">
                          <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[minmax(280px,1fr)_minmax(280px,340px)] md:gap-4">
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="truncate text-sm font-semibold text-slate-900">{parameter.name}</span>
                                <span className="text-xs text-slate-500">{parameter.type}</span>
                                <span
                                  className={cn(
                                    "rounded px-1.5 py-0.5 text-[10px] font-medium",
                                    parameter.required ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600",
                                  )}
                                >
                                  {parameter.required ? "必填" : "選填"}
                                </span>
                              </div>
                              <p className="line-clamp-1 text-sm leading-5 text-slate-600">{parameter.description}</p>
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
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="min-h-0 overflow-y-auto p-4 md:p-5">
                  <div className="flex min-h-0 flex-col gap-3">
                  {liveResult ? (
                    <section className="rounded-lg border border-slate-200 bg-white">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className={cn("inline-block h-2.5 w-2.5 rounded-full", liveResult.status === "200" ? "bg-emerald-500/80" : "bg-amber-600/80")} />
                          <span className="text-[11px] font-semibold text-slate-800">
                            {liveResult.status === "200" ? "200 OK" : liveResult.status === "504" ? "504 Timeout" : `${liveResult.status} Error`}
                          </span>
                          {liveResultIsStale ? (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                              stale
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                            Body
                          </span>
                          <button
                            type="button"
                            onClick={() => void handleCopyResult()}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
                            aria-label={resultCopied ? "已複製結果" : "複製結果"}
                            title={resultCopied ? "已複製" : "複製"}
                          >
                            {resultCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={handleDownloadResult}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
                            aria-label="下載結果 JSON"
                            title="下載"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setLiveResult(null)}
                            className="inline-flex h-7 items-center rounded-md border border-slate-200 bg-white px-2 text-[10px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
                          >
                            Clear result
                          </button>
                        </div>
                      </div>
                      <pre className="max-h-[260px] overflow-auto border-l-2 border-emerald-200 bg-emerald-50/35 px-3 pb-3 pt-2 text-[12px] leading-[1.55] text-slate-900">
                        <code className="font-mono whitespace-pre-wrap break-words">{liveResultCode}</code>
                      </pre>
                    </section>
                  ) : (
                    <section className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3">
                      <p className="text-xs text-slate-600">尚未執行。點擊 Run 後會在此顯示執行結果。</p>
                    </section>
                  )}

                  <CodeBlock
                    code={requestExampleCode}
                    language={requestCodeLanguage}
                    copyButtonVariant="icon"
                    className="relative z-20 !overflow-visible bg-white"
                    wrapLines
                    header={requestHeader}
                    contentClassName="max-h-[160px] overflow-y-auto overflow-x-hidden px-3 pb-3 pt-1.5 text-[12px] leading-[1.55]"
                  />

                  <CodeBlock
                    code={responseCode}
                    language="json"
                    copyButtonVariant="icon"
                    className="bg-white"
                    wrapLines
                    header={responseHeader}
                    contentClassName="max-h-[350px] overflow-y-auto overflow-x-hidden px-3 pb-3 pt-1.5 text-[12px] leading-[1.55]"
                  />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
