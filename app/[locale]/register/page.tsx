import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getSession } from "@/src/auth/session";
import { GoogleSignInButton } from "@/src/components/auth/google-sign-in-button";
import { RegisterForm } from "@/src/components/auth/register-form";
import { Link } from "@/src/i18n/navigation";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as import("@/src/i18n/locales").AppLocale;
  const isEn = l === "en";
  const title = isEn ? "Sign Up" : "註冊";
  const description = isEn ? "Create your TW Market Data account." : "建立 TW Market Data 帳戶。";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: buildAlternates(l, "/register"),
    openGraph: { title, description, locale: OG_LOCALE[l] },
  };
}

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  const t = await getTranslations("authRegister");

  return (
    <main className="fixed inset-x-0 top-[73px] bottom-0 overflow-hidden bg-white">
      <div className="h-full overflow-hidden">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[1.55fr_0.95fr]">
          <section className="hidden h-full items-center bg-white px-8 md:px-12 lg:flex lg:px-20">
            <div className="max-w-3xl -translate-y-4">
              <p className="text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">{t("hero.title")}</p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                {t("hero.subtitle")}
              </p>
            </div>
          </section>

          <section className="flex h-full items-center justify-center bg-slate-50 px-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{t("heading")}</h2>

              <div className="mt-6 grid gap-3">
                <GoogleSignInButton />
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] uppercase tracking-wide text-slate-400">{t("or")}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="mt-5">
                <RegisterForm />
              </div>

              <p className="mt-5 text-center text-xs text-slate-500">
                {t.rich("termsNotice", {
                  terms: (chunks) => (
                    <Link href="/terms" className="mx-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link href="/privacy" className="mx-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
