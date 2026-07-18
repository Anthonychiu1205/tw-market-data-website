"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";
// Shared server-safe content (also feeds /llms-full.txt). Query param `symbol`; do NOT change.
// The habit copy is localized from the `docsContent` messages namespace (authHabits stays the zh
// source for authenticationLlmsMarkdown()).
import { authCurl as curlExample } from "@/src/content/docs-guide-content";

const linkClass =
  "font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700";

const codeClass = "rounded bg-slate-100 px-1.5 py-0.5 text-[13px]";

export function AuthenticationContent() {
  const t = useTranslations("docsContent");

  return (
    <div className="space-y-8 py-8">
      <section className="space-y-4 border-b border-slate-200 pb-8">
        <p className="text-[15px] leading-7 text-slate-700">
          {t.rich("auth.intro", {
            code: () => <code className={codeClass}>X-API-Key</code>,
            dash: (chunks) => <Link href="/dashboard" className={linkClass}>{chunks}</Link>,
          })}
        </p>
        <CodeBlock code={curlExample} language="bash" copyButtonVariant="icon" />
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="habits">{t("auth.habitsHeading")}</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          {["habit1", "habit2", "habit3"].map((k) => (
            <li key={k}>
              <strong className="font-semibold text-slate-900">{t(`auth.${k}.term`)}</strong>
              {" — "}
              {t(`auth.${k}.desc`)}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <SectionHeading id="errors">{t("auth.errorsHeading")}</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          <li>
            {t.rich("auth.error1", {
              code: () => <code className={codeClass}>401 missing_api_key</code>,
            })}
          </li>
          <li>
            {t.rich("auth.error2", {
              code: () => <code className={codeClass}>402 not_entitled_for_dataset</code>,
            })}
          </li>
          <li>
            {t.rich("auth.error3", {
              code: () => <code className={codeClass}>429</code>,
            })}
          </li>
        </ul>
        <p className="pt-2 text-[15px] leading-7 text-slate-700">
          {t.rich("auth.next", {
            link: (chunks) => <Link href="/docs/data-provenance" className={linkClass}>{chunks}</Link>,
          })}
        </p>
      </section>
    </div>
  );
}
