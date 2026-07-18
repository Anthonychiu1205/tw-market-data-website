"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";
// Shared server-safe content (also feeds /llms-full.txt). curlExample/pythonExample use the SSOT
// query param `symbol`; do NOT change to "ticker". NEXT_DATASETS supplies hrefs + order; the visible
// dataset labels are localized from the `docsContent` messages namespace, keyed by slug.
import {
  quickStartCurl as curlExample,
  quickStartPython as pythonExample,
  quickStartNoKeyCurl,
  quickStartNextDatasets as NEXT_DATASETS,
} from "@/src/content/docs-guide-content";

const linkClass =
  "font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700";

export function QuickStartContent() {
  const t = useTranslations("docsContent");

  return (
    <div className="space-y-8 py-8">
      {/* Step 0: zero-registration no-key trial (FRICTION-01), placed before "拿 key". */}
      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="try-no-key">{t("quickStart.step0.heading")}</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">{t("quickStart.step0.intro")}</p>
        <CodeBlock code={quickStartNoKeyCurl} language="bash" copyButtonVariant="icon" />
        <p className="text-sm leading-7 text-slate-600">{t("quickStart.step0.note")}</p>
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="get-api-key">{t("quickStart.getKey.heading")}</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          {t.rich("quickStart.getKey.body", {
            dash: (chunks) => <Link href="/dashboard" className={linkClass}>{chunks}</Link>,
          })}
        </p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="first-request">{t("quickStart.firstRequest.heading")}</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          {t.rich("quickStart.firstRequest.body", {
            endpoint: () => (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">GET /v2/datasets/{"{資料集}"}</code>
            ),
            key: () => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">X-API-Key</code>,
          })}
        </p>
        <CodeBlock code={curlExample} language="bash" copyButtonVariant="icon" />
        <CodeBlock code={pythonExample} language="python" copyButtonVariant="icon" />
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="see-response">{t("quickStart.seeResponse.heading")}</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          {t.rich("quickStart.seeResponse.body", {
            link: (chunks) => <Link href="/datasets" className={linkClass}>{chunks}</Link>,
          })}
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading id="whats-next">{t("quickStart.whatsNext.heading")}</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          <li>
            {t("quickStart.whatsNext.pickIntro")}
            {NEXT_DATASETS.map((d, i) => {
              const slug = d.href.split("/").pop() ?? d.href;
              return (
                <span key={d.href}>
                  {i > 0 ? t("quickStart.whatsNext.separator") : ""}
                  <Link href={d.href} className={linkClass}>{t(`quickStart.datasets.${slug}`)}</Link>
                </span>
              );
            })}
            {t("quickStart.whatsNext.pickEnd")}
          </li>
          <li>
            {t.rich("quickStart.whatsNext.quota", {
              link: (chunks) => <Link href="/pricing" className={linkClass}>{chunks}</Link>,
            })}
          </li>
        </ul>
        <p className="pt-2 text-[15px] leading-7 text-slate-700">
          {t.rich("quickStart.whatsNext.next", {
            link: (chunks) => <Link href="/docs/authentication" className={linkClass}>{chunks}</Link>,
          })}
        </p>
      </section>
    </div>
  );
}
