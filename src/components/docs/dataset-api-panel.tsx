"use client";

import { useMemo, useState } from "react";

import { CodeBlock, type CodeBlockLanguage } from "@/src/components/docs/code-block";
import {
  API_KEY_PREFIX,
  PANEL_ERRORS,
  REQUEST_LANGUAGES,
  buildErrorBody,
  buildRequestSnippet,
  buildSuccessBody,
  datasetRowsKey,
  panelStatuses,
  type PanelParam,
  type RequestLanguage,
} from "@/src/lib/docs/api-panel-content";
import { API_AUTH_HEADER } from "@/src/content/api-truth";
import { cn } from "@/src/lib/cn";

// The sticky right-hand panel on a data-API page (DOCS-03): a Request card with language tabs and a
// Response card with status tabs. Bilingual inline like the rest of the v5 dataset pages, so /en is
// genuinely English and the CJK guards can scan it.
//
// Honesty (rule 2):
//  - the 200 body is THIS dataset's own captured response, or nothing. There is no shared template,
//    because the envelope genuinely differs per dataset (data / rows / items).
//  - an uncaptured dataset says so, rather than showing a plausible body nobody has observed.
//  - error bodies are the read API's real ones. Their `message` is Chinese; /en shows a marker in its
//    place rather than an English translation the API never sends.

type DatasetApiPanelProps = {
  locale: string;
  datasetSlug: string;
  backendPath: string;
  params: PanelParam[];
};

const LANGUAGE_SYNTAX: Record<RequestLanguage, CodeBlockLanguage> = {
  curl: "bash",
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
};

export function DatasetApiPanel({ locale, datasetSlug, backendPath, params }: DatasetApiPanelProps) {
  const en = locale === "en";
  const [language, setLanguage] = useState<RequestLanguage>("curl");
  const [status, setStatus] = useState<string>("200");

  const rowsKey = useMemo(() => datasetRowsKey(datasetSlug), [datasetSlug]);
  const requestCode = useMemo(
    () => buildRequestSnippet(language, { backendPath, params, rowsKey }),
    [language, backendPath, params, rowsKey],
  );
  const success = useMemo(() => buildSuccessBody(datasetSlug, locale), [datasetSlug, locale]);
  const statuses = useMemo(() => panelStatuses(), []);

  // Several errors share status 401, so the tab selects the first error with that status and the rest
  // are listed underneath — the status code alone is not a unique key.
  const errorsForStatus = PANEL_ERRORS.filter((e) => String(e.status) === status);
  const isSuccessTab = status === "200";

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
            ? `Authenticate with the ${API_AUTH_HEADER} header, using a ${API_KEY_PREFIX} key issued in the dashboard.`
            : `以 ${API_AUTH_HEADER} 標頭認證，使用儀表板發放的 ${API_KEY_PREFIX} 金鑰。`}
        </p>
      </section>

      {/* ── Response ── */}
      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {en ? "Response" : "回應"}
        </p>
        <div className="flex flex-wrap gap-1">
          {statuses.map((code) => {
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

        {isSuccessTab ? (
          success.kind === "captured" ? (
            <>
              <CodeBlock
                code={success.body}
                language="json"
                copyButtonVariant="icon"
                header={<span className="text-[11px] font-medium text-slate-500">JSON</span>}
              />
              <div className="space-y-1 text-[11px] leading-5 text-slate-400">
                <p className="text-emerald-700">
                  {en
                    ? "Captured from a real call to this endpoint — not written by hand."
                    : "擷取自對此端點的真實呼叫，非手寫。"}
                </p>
                <p>
                  {en
                    ? `This dataset returns its rows under "${success.rowsKey ?? "-"}". The envelope differs between datasets, so read this one rather than reusing another page's shape.`
                    : `此資料集的資料列在 "${success.rowsKey ?? "-"}" 之下。各資料集的信封不同，請以本頁為準，勿沿用其他頁的形狀。`}
                </p>
              </div>
            </>
          ) : (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-800">
              {en
                ? "TODO — no response has been captured for this dataset yet (it needs an entitled key, or its required parameters are not yet known). No example is shown rather than an invented one."
                : "TODO —— 尚未擷取到此資料集的真實回應（需要有權限的金鑰，或其必填參數尚未確認）。寧可不顯示範例，也不編造。"}
            </p>
          )
        ) : (
          <div className="space-y-3">
            {errorsForStatus.map((error) => (
              <div key={error.code} className="space-y-1">
                <CodeBlock
                  code={buildErrorBody(error, locale)}
                  language="json"
                  copyButtonVariant="icon"
                  header={<span className="text-[11px] font-medium text-slate-500">{error.code}</span>}
                />
                <p className="text-[11px] leading-5 text-slate-400">{en ? error.when.en : error.when.zh}</p>
              </div>
            ))}
            {en ? (
              <p className="text-[11px] leading-5 text-slate-400">
                The API returns <code>message</code> in Chinese; the placeholder above stands in for it
                rather than an English translation the API does not send.
              </p>
            ) : null}
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
