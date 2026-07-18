import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { AlertTriangle, Lightbulb } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";
import type { AppLocale } from "@/src/i18n/locales";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

// FRICTION-01 B-0 / §C-2 — public (white-zone) three-tier connect funnel. Reachable without login
// (the site middleware gates only /dashboard|/billing|/usage|/settings|/account).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as AppLocale;
  const isEn = l === "en";
  return {
    title: isEn ? "Connect Your AI" : "接入你的 AI",
    description: isEn
      ? "Three ways to connect to TW Market Data: a one-line zero-auth trial, a developer API key, and a consumer chat MCP connector."
      : "三層接入 TW Market Data：一句話零認證試玩、開發者 API key、消費者聊天 MCP connector。",
    alternates: buildAlternates(l, "/connect"),
    openGraph: {
      locale: OG_LOCALE[l],
      title: isEn ? "Connect Your AI | TW Market Data" : "接入你的 AI | TW Market Data",
      description: isEn
        ? "One-line trial, API key, MCP connector — pick a tier to start connecting to Taiwan stock data."
        : "一句話試玩、API key、MCP connector — 選一層開始接台股資料。",
      url: "/connect",
      images: [getAbsoluteUrl(siteConfig.ogImagePath)],
    },
  };
}

const pasteLine = "Read https://twmarketdata.com/skill.md and connect to TW Market Data. 先用 2330 試一筆。";
const curlLine =
  'curl -H "X-API-Key: $TWMD_API_KEY" "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330"';

function CodeLine({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
      <code>{children}</code>
    </pre>
  );
}

export default async function ConnectPage() {
  const t = await getTranslations("connect");

  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t("h1")}</h1>
          <p className="text-base leading-7 text-slate-600">{t("intro")}</p>
        </header>

        {/* 第一層 */}
        <section className="rounded-2xl border border-slate-900 bg-white p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("tier1Label")}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{t("tier1Title")}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">{t("tier1PasteLead")}</p>
          <CodeLine>{pasteLine}</CodeLine>
          <p className="mt-3 text-sm leading-7 text-slate-600">{t("tier1Tickers")}</p>
        </section>

        {/* 第二層 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("tier2Label")}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{t("tier2Title")}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">{t("tier2Body")}</p>
          <CodeLine>{curlLine}</CodeLine>
          <p className="mt-3 flex items-start gap-2 text-sm leading-7 text-slate-600">
            <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
            <span>
              {t.rich("tier2KeyWarning", {
                b: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
                link: (chunks) => (
                  <Link href="/connect/key-safety" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">{chunks}</Link>
                ),
              })}
            </span>
          </p>
        </section>

        {/* 第三層 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("tier3Label")}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{t("tier3Title")}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {t.rich("tier3Body", {
              b: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
            })}
          </p>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
            <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            <span>
              {t.rich("tier3Note", {
                b: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
              })}
            </span>
          </p>
        </section>

        {/* 底部三配套連結 */}
        <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-sm">
          <a href="/skill.md" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">/skill.md</a>
          <Link href="/connect/key-safety" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">{t("linkKeySafety")}</Link>
          <Link href="/connect/which-tier" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">{t("linkWhichTier")}</Link>
        </div>

        <p className="text-sm leading-7 text-slate-500">
          {t.rich("summary", {
            b: (chunks) => <strong className="font-medium text-slate-700">{chunks}</strong>,
          })}
        </p>
      </div>
    </Container>
  );
}
