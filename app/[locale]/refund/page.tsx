import type { Metadata } from "next";

import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/src/components/ui/container";
import { siteConfig } from "@/src/config/site";
import { CANCELLATION_EFFECTIVE_AT_PERIOD_END } from "@/src/lib/legal/cancellation-copy";

export const metadata: Metadata = {
  title: "退款政策",
  description: "TW Market Data 退款政策。",
};

export default async function RefundPage() {
  const t = await getTranslations("refund");

  const sections = [
    {
      title: t("section1Title"),
      items: [t("section1Body1"), t("section1Body2")],
    },
    {
      title: t("section2Title"),
      items: [t("section2Body1"), t("section2Body2")],
    },
    {
      title: t("section3Title"),
      items: [t("section3Body1"), t("section3Body2"), t("section3Body3")],
    },
    {
      title: t("section4Title"),
      items: [
        t("section4Body1"),
        // Canonical clause — shared verbatim with the in-app cancel-confirm modal (SSOT).
        CANCELLATION_EFFECTIVE_AT_PERIOD_END,
      ],
    },
    {
      title: t("section5Title"),
      items: [
        t("section5Body1"),
        `${t("section5EmailLabel")}${siteConfig.supportEmail}`,
        `${t("section5ContactLabel")}/contact`,
      ],
    },
  ];

  const locale = await getLocale();
  const tc = await getTranslations("common");

  return (
    <Container className="space-y-8 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
        {locale === "en" ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">{tc("enLegalReference")}</p>
        ) : null}
        <p className="max-w-3xl text-sm leading-7 text-slate-600">{t("intro")}</p>
      </section>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <ul className="space-y-1 text-sm leading-7 text-slate-600">
              {section.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
