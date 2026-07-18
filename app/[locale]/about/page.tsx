import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DocsLayout } from "@/src/components/docs/docs-layout";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { Card } from "@/src/components/ui/card";
import { aboutSections } from "@/src/content/docs";
import { sourcePolicy } from "@/src/content/site";

export const metadata: Metadata = {
  title: "關於",
  description: "來源政策與可信任設計。",
};

export default async function AboutPage() {
  const t = await getTranslations("about");

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
