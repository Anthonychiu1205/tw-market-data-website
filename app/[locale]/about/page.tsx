import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { DocsLayout } from "@/src/components/docs/docs-layout";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { Card } from "@/src/components/ui/card";
import { aboutSections } from "@/src/content/docs";
import { getSourcePolicy } from "@/src/content/site";
import type { AppLocale } from "@/src/i18n/locales";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  const title = isEn ? "About" : "關於";
  const description = isEn
    ? "Source policy and trustworthy-by-design principles."
    : "來源政策與可信任設計。";
  return {
    title,
    description,
    alternates: buildAlternates(l, "/about"),
    openGraph: { title, description, locale: OG_LOCALE[l] },
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = (await getLocale()) as AppLocale;
  const sourcePolicy = getSourcePolicy(locale);

  return (
    <DocsLayout
      title={t("title")}
      description={t("description")}
      sections={aboutSections}
    >
      <Card className="fade-in">
        <SectionHeading id="trust-model">{t("trustModel.heading")}</SectionHeading>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {t("trustModel.body")}
        </p>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="source-policy">{t("sourcePolicy.heading")}</SectionHeading>
        <div className="mt-3 grid gap-2">
          {sourcePolicy.map((line) => (
            <p key={line} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {line}
            </p>
          ))}
        </div>
      </Card>

      <Card className="fade-in">
        <SectionHeading id="why-us">{t("whyUs.heading")}</SectionHeading>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {t("whyUs.body")}
        </p>
      </Card>
    </DocsLayout>
  );
}
