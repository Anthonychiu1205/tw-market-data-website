"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { CodeBlock } from "@/src/components/docs/code-block";
import type { ApiCodeExamples, ApiStatusExample } from "@/src/content/docs-pages";
import { cn } from "@/src/lib/cn";

type ApiSidePanelProps = {
  requestExample?: string;
  codeExamples?: ApiCodeExamples;
  statusExamples: ApiStatusExample[];
};

type CodeTabId = "python" | "javascript" | "curl";

const codeTabLabels: Record<CodeTabId, string> = {
  python: "Python",
  javascript: "JavaScript",
  curl: "cURL",
};

export function ApiSidePanel({ requestExample, codeExamples, statusExamples }: ApiSidePanelProps) {
  const t = useTranslations("docsDemo");
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
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("requestExample")}</p>
        <CodeBlock
          code={activeRequestCode}
          language={activeCodeTab === "curl" ? "curl" : activeCodeTab}
          copyButtonVariant="icon"
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
        />
      </section>

      <section className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("sidePanel.statusCodes")}</p>
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
          <CodeBlock
            code={activeExample.body}
            language="json"
            copyButtonVariant="icon"
            header={<span className="text-[11px] font-medium text-slate-500">JSON</span>}
          />
        </section>
      ) : null}
    </div>
  );
}
