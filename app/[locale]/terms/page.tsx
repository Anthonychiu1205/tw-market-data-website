import type { Metadata } from "next";

import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/src/components/ui/container";
import { investmentDisclaimer } from "@/src/lib/legal/disclaimer";

export const metadata: Metadata = {
  title: "使用條款",
  description: "TW Market Data 使用條款。",
};

type TermsSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const locale = await getLocale();

  // §九 first paragraph is the canonical non-investment-advice disclaimer (SSOT in
  // @/src/lib/legal/disclaimer). Rendered via the locale-aware selector, NOT the messages catalog.
  const disclaimer = investmentDisclaimer(locale === "en" ? "en" : "zh-TW");

  const sections: TermsSection[] = [
    {
      title: t("scope.title"),
      paragraphs: [t("scope.p1"), t("scope.p2")],
    },
    {
      title: t("definitions.title"),
      paragraphs: [t("definitions.p1")],
      bullets: [
        t("definitions.b1"),
        t("definitions.b2"),
        t("definitions.b3"),
        t("definitions.b4"),
        t("definitions.b5"),
        t("definitions.b6"),
      ],
    },
    {
      title: t("service.title"),
      paragraphs: [t("service.p1"), t("service.p2"), t("service.p3")],
    },
    {
      title: t("account.title"),
      paragraphs: [t("account.p1"), t("account.p2"), t("account.p3"), t("account.p4")],
      bullets: [t("account.b1"), t("account.b2"), t("account.b3")],
    },
    {
      title: t("license.title"),
      paragraphs: [t("license.p1")],
      bullets: [
        t("license.b1"),
        t("license.b2"),
        t("license.b3"),
        t("license.b4"),
        t("license.b5"),
        t("license.b6"),
        t("license.b7"),
      ],
    },
    {
      title: t("plans.title"),
      paragraphs: [t("plans.p1"), t("plans.p2"), t("plans.p3"), t("plans.p4")],
    },
    {
      title: t("dataSources.title"),
      paragraphs: [
        t("dataSources.p1"),
        t("dataSources.p2"),
        t("dataSources.p3"),
        t("dataSources.p4"),
      ],
    },
    {
      title: t("disclaimerGeneral.title"),
      paragraphs: [
        t("disclaimerGeneral.p1"),
        t("disclaimerGeneral.p2"),
        t("disclaimerGeneral.p3"),
      ],
    },
    {
      title: t("notInvestmentAdvice.title"),
      paragraphs: [
        disclaimer,
        t("notInvestmentAdvice.p1"),
        t("notInvestmentAdvice.p2"),
        t("notInvestmentAdvice.p3"),
      ],
    },
    {
      title: t("suspension.title"),
      paragraphs: [t("suspension.p1")],
      bullets: [
        t("suspension.b1"),
        t("suspension.b2"),
        t("suspension.b3"),
        t("suspension.b4"),
        t("suspension.b5"),
        t("suspension.b6"),
      ],
    },
    {
      title: t("ip.title"),
      paragraphs: [t("ip.p1"), t("ip.p2")],
    },
    {
      title: t("privacy.title"),
      paragraphs: [t("privacy.p1"), t("privacy.p2")],
    },
    {
      title: t("serviceChanges.title"),
      paragraphs: [t("serviceChanges.p1"), t("serviceChanges.p2"), t("serviceChanges.p3")],
    },
    {
      title: t("liability.title"),
      paragraphs: [t("liability.p1"), t("liability.p2")],
    },
    {
      title: t("governingLaw.title"),
      paragraphs: [t("governingLaw.p1"), t("governingLaw.p2")],
    },
    {
      title: t("contact.title"),
      paragraphs: [t("contact.p1")],
    },
  ];

  return (
    <Container className="space-y-8 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">{t("lead1")}</p>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">{t("lead2")}</p>
      </section>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <div className="space-y-2 text-sm leading-7 text-slate-600">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.bullets ? (
              <ul className="space-y-1 text-sm leading-7 text-slate-600">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>- {bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </Container>
  );
}
