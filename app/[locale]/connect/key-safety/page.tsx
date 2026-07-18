import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { Container } from "@/src/components/ui/container";
import type { AppLocale } from "@/src/i18n/locales";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

// FRICTION-01 B-0b / §C-3 — key safety guidance (public).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  return {
    title: isEn ? "Create a Dedicated Key for Your AI" : "為你的 AI 建一把專用 key",
    description: isEn
      ? "One key per agent, independently revocable, never paste your main key into a chat, and rotate regularly."
      : "一個 agent 一把 key、可獨立撤銷、絕不貼主 key 進對話、定期輪換。",
    alternates: buildAlternates(l, "/connect/key-safety"),
    openGraph: { locale: OG_LOCALE[l] },
  };
}

const POINT_KEYS = ["oneKeyPerAgent", "independentRevoke", "neverPasteMainKey", "rotate"] as const;

export default async function KeySafetyPage() {
  const t = await getTranslations("connectKeySafety");

  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Connect</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t("title")}</h1>
        </header>

        <ol className="space-y-4">
          {POINT_KEYS.map((key, i) => (
            <li key={key} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-base font-semibold text-slate-950">
                {i + 1}. {t(`points.${key}.term`)}
              </p>
              <p className="mt-1 text-sm leading-7 text-slate-600">{t(`points.${key}.desc`)}</p>
            </li>
          ))}
        </ol>

        <p className="rounded-lg bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
          {t.rich("capabilityNote", {
            keyLabel: () => <code className="text-slate-600">key_label</code>,
            revokedAt: () => <code className="text-slate-600">revoked_at</code>,
            createdByCustomer: () => <code className="text-slate-600">created_by_customer</code>,
          })}
        </p>

        <p className="border-t border-slate-200 pt-6 text-sm">
          ←{" "}
          <Link href="/connect" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">{t("backToConnect")}</Link>
        </p>
      </div>
    </Container>
  );
}
