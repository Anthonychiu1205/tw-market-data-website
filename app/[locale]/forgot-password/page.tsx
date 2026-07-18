import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getSession } from "@/src/auth/session";
import { ForgotPasswordForm } from "@/src/components/auth/forgot-password-form";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as import("@/src/i18n/locales").AppLocale;
  const isEn = l === "en";
  const title = isEn ? "Forgot Password" : "忘記密碼";
  const description = isEn ? "Send a password reset link." : "寄送重設密碼連結。";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: buildAlternates(l, "/forgot-password"),
    openGraph: { title, description, locale: OG_LOCALE[l] },
  };
}

export default async function ForgotPasswordPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  const t = await getTranslations("authForgot");

  return (
    <main className="fixed inset-x-0 top-[73px] bottom-0 overflow-hidden bg-white">
      <div className="h-full overflow-hidden">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[1.55fr_0.95fr]">
          <section className="hidden h-full items-center bg-white px-8 md:px-12 lg:flex lg:px-20">
            <div className="max-w-3xl -translate-y-4">
              <p className="text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">{t("heroTitle")}</p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                {t("heroSubtitle")}
              </p>
            </div>
          </section>

          <section className="flex h-full items-center justify-center bg-slate-50 px-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{t("formTitle")}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("formSubtitle")}
              </p>

              <div className="mt-6">
                <ForgotPasswordForm />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
