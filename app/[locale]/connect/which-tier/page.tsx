import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { Container } from "@/src/components/ui/container";
import type { AppLocale } from "@/src/i18n/locales";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

// FRICTION-01 B-0c / §C-4 — "哪一層適合我" routing guide (public).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  return {
    title: isEn ? "Which Tier Is Right for Me" : "哪一層適合我",
    description: isEn
      ? "Just exploring? Go key-free. Developers use an API key. Paid Claude.ai/ChatGPT users go through the MCP connector."
      : "只想試看看走免 key、開發者走 API key、Claude.ai/ChatGPT 付費走 MCP connector。",
    alternates: buildAlternates(l, "/connect/which-tier"),
    openGraph: { locale: OG_LOCALE[l] },
  };
}

const ROW_KEYS = ["try", "developer", "consumer"] as const;

export default async function WhichTierPage() {
  const t = await getTranslations("connectWhichTier");

  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Connect</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t("h1")}</h1>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">{t("colWho")}</th>
                <th className="px-3 py-2 font-medium">{t("colTier")}</th>
                <th className="px-3 py-2 font-medium">{t("colHow")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROW_KEYS.map((key) => (
                <tr key={key} className="text-slate-700">
                  <td className="px-3 py-3 align-top">{t(`rows.${key}.who`)}</td>
                  <td className="px-3 py-3 align-top font-medium text-slate-900">{t(`rows.${key}.tier`)}</td>
                  <td className="px-3 py-3 align-top">{t(`rows.${key}.how`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
          {t.rich("summary", {
            b: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
          })}
        </p>

        <p className="border-t border-slate-200 pt-6 text-sm">
          ←{" "}
          <Link href="/connect" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">{t("backLink")}</Link>
        </p>
      </div>
    </Container>
  );
}
