import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Container } from "@/src/components/ui/container";

export const metadata: Metadata = {
  title: "聯繫我們",
  description: "企業合作、資料授權、技術支援或方案諮詢聯繫入口。",
};

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
