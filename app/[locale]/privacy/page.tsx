import type { Metadata } from "next";

import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/src/components/ui/container";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "TW Market Data 隱私政策。",
};

type PrivacySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  const sections: PrivacySection[] = [
    {
      title: t("collect.title"),
      paragraphs: [t("collect.intro")],
      bullets: [
        t("collect.account"),
        t("collect.usage"),
        t("collect.payment"),
        t("collect.contact"),
      ],
    },
    {
      title: t("use.title"),
      paragraphs: [t("use.intro")],
      bullets: [
        t("use.provide"),
        t("use.verify"),
        t("use.quota"),
        t("use.billing"),
        t("use.abuse"),
        t("use.notify"),
        t("use.internal"),
      ],
    },
    {
      title: t("share.title"),
      paragraphs: [t("share.intro")],
      bullets: [
        t("share.consent"),
        t("share.vendors"),
        t("share.legal"),
        t("share.protect"),
      ],
    },
    {
      title: t("retention.title"),
      paragraphs: [t("retention.security"), t("retention.period")],
    },
    {
      title: t("cookies.title"),
      paragraphs: [t("cookies.body")],
    },
    {
      title: t("rights.title"),
      paragraphs: [t("rights.body")],
    },
    {
      title: t("updates.title"),
      paragraphs: [t("updates.body")],
    },
    {
      title: t("contact.title"),
      paragraphs: [t("contact.body")],
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

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            {section.paragraphs ? (
              <div className="space-y-2 text-sm leading-7 text-slate-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            {section.bullets ? (
              <ul className="space-y-1 text-sm leading-7 text-slate-600">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>- {bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section id="analytics-cookies" className="scroll-mt-24 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{t("analytics.title")}</h2>
          <p className="text-sm leading-7 text-slate-600">{t("analytics.body")}</p>
          <ul className="space-y-1 text-sm leading-7 text-slate-600">
            <li>- {t("analytics.noAdTracking")}</li>
            <li>- {t("analytics.noSell")}</li>
            <li>- {t("analytics.noSecrets")}</li>
            <li>- {t("analytics.userChoice")}</li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
