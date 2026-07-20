"use client";

import { useMemo, useState } from "react";

import { CodeBlock, type CodeBlockLanguage } from "@/src/components/docs/code-block";
import {
  PANEL_ERROR_CODES,
  REQUEST_LANGUAGES,
  buildErrorBody,
  buildRequestSnippet,
  buildSuccessBody,
  errorStatusFor,
  type PanelParam,
  type RequestLanguage,
} from "@/src/lib/docs/api-panel-content";
import { cn } from "@/src/lib/cn";

// The sticky right-hand panel on a data-API page (DOCS-03): a Request card with language tabs and a
// Response card with status tabs. Bilingual inline like the rest of the v5 dataset pages, so /en is
// genuinely English and the CJK guards can scan it.
//
// Honesty (rule 2): the 200 body re-uses the dataset's OWN documented example row — this panel never
// introduces a field the page does not already publish, and never shows a live value it does not have.
// A dataset whose real values are not obtainable yet (no entitled key, coverage still TODO) is
// labelled as illustrative right on the card.

type DatasetApiPanelProps = {
  locale: string;
  datasetSlug: string;
  backendPath: string;
  params: PanelParam[];
  exampleJson: string;
  planCode: string;
  creditsCost: number;
};

const LANGUAGE_SYNTAX: Record<RequestLanguage, CodeBlockLanguage> = {
  curl: "bash",
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
};

export function DatasetApiPanel({
  locale,
  datasetSlug,
  backendPath,
  params,
  exampleJson,
  planCode,
  creditsCost,
}: DatasetApiPanelProps) {
  const en = locale === "en";
  const [language, setLanguage] = useState<RequestLanguage>("curl");
  const [status, setStatus] = useState<string>("200");

  const requestCode = useMemo(
    () => buildRequestSnippet(language, { backendPath, params }),
    [language, backendPath, params],
  );

  const success = useMemo(
    () => buildSuccessBody({ exampleJson, datasetSlug, planCode, creditsCost }),
    [exampleJson, datasetSlug, planCode, creditsCost],
  );

  const errorTabs = useMemo(
    () => PANEL_ERROR_CODES.map((code) => ({ code, status: String(errorStatusFor(code)) })),
    [],
  );

  const activeError = errorTabs.find((tab) => tab.status === status);
  const responseBody = activeError ? buildErrorBody(activeError.code) : success.body;

  return (
    <div className="space-y-5">
      {/* ── Request ── */}
      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {en ? "Request" : "請求"}
        </p>
        <CodeBlock
          code={requestCode}
          language={LANGUAGE_SYNTAX[language]}
          copyButtonVariant="icon"
          header={
            <div className="flex flex-wrap gap-1">
              {REQUEST_LANGUAGES.map((option) => {
                const isActive = language === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setLanguage(option.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex h-7 items-center rounded-md px-2.5 text-[11px] font-medium leading-none transition",
                      isActive ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:text-slate-800",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          }
        />
        <p className="text-[11px] leading-5 text-slate-400">
          {en
            ? "Authenticate with the X-API-Key header. Keys are issued in the dashboard."
            : "以 X-API-Key 標頭認證，金鑰於儀表板發放。"}
        </p>
      </section>

      {/* ── Response ── */}
      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {en ? "Response" : "回應"}
        </p>
        <div className="flex flex-wrap gap-1">
          {["200", ...errorTabs.map((tab) => tab.status)].map((code) => {
            const isActive = status === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setStatus(code)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium tabular-nums transition",
                  isActive ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:text-slate-700",
                )}
              >
                {code}
              </button>
            );
          })}
        </div>
        <CodeBlock
          code={responseBody}
          language="json"
          copyButtonVariant="icon"
          header={<span className="text-[11px] font-medium text-slate-500">JSON</span>}
        />
        {activeError ? (
          <p className="text-[11px] leading-5 text-slate-400">
            {en
              ? `Error code ${activeError.code}. Every error body carries requestId — quote it when contacting support.`
              : `錯誤碼 ${activeError.code}。每個錯誤回應都帶 requestId，聯繫支援時請一併提供。`}
          </p>
        ) : (
          <div className="space-y-1 text-[11px] leading-5 text-slate-400">
            <p>
              {en
                ? "meta is injected by the gateway on every response: requestId, planCode, creditsCost and dryRun."
                : "meta 由 gateway 於每次回應注入：requestId、planCode、creditsCost 與 dryRun。"}
            </p>
            {success.provenance === "captured" ? (
              <p className="text-emerald-700">
                {en
                  ? "This body was captured from a real call to the API, not written by hand."
                  : "此回應擷取自對 API 的真實呼叫，非手寫。"}
              </p>
            ) : (
              <p className="text-amber-700">
                {en
                  ? "Envelope is the captured shape; the rows are illustrative — this dataset has not been captured yet."
                  : "信封為實測擷取的結構；資料列僅示意——此資料集尚未實測擷取。"}
              </p>
            )}
          </div>
        )}
      </section>

      <p className="text-[11px] leading-5 text-slate-400">
        {en
          ? "The grade badge on this page is a documentation classification, not a response field."
          : "本頁的分級徽章屬文件分級，並非回應欄位。"}
      </p>
    </div>
  );
}
