import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Container } from "@/src/components/ui/container";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as import("@/src/i18n/locales").AppLocale;
  const isEn = l === "en";
  const title = isEn ? "Contact Us" : "聯繫我們";
  const description = isEn
    ? "Get in touch for enterprise partnerships, data licensing, technical support, or plan inquiries."
    : "企業合作、資料授權、技術支援或方案諮詢聯繫入口。";
  return {
    title,
    description,
    alternates: buildAlternates(l, "/contact"),
    openGraph: { title, description, locale: OG_LOCALE[l] },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <Container className="py-12">
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("eyebrow")}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">{t("intro")}</p>
        <a
          href="mailto:avenra.platform@gmail.com"
          className="mt-2 inline-block text-base font-medium text-slate-900 underline underline-offset-4 transition hover:text-slate-700"
        >
          avenra.platform@gmail.com
        </a>
      </section>
    </Container>
  );
}
