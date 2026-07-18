import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { Link } from "@/src/i18n/navigation";
import { getSession } from "@/src/auth/session";
import { GoogleSignInButton } from "@/src/components/auth/google-sign-in-button";
import { PasswordLoginForm } from "@/src/components/auth/password-login-form";
import { EncryptedTextRotator, type LoginHeadlinePhrase } from "@/src/components/ui/encrypted-text-rotator";
import { getSafeRedirectTarget } from "@/src/lib/security/safe-redirect";
import { buildAlternates, OG_LOCALE } from "@/src/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "en" ? "en" : "zh-TW") as import("@/src/i18n/locales").AppLocale;
  const isEn = l === "en";
  const title = isEn ? "Log In" : "登入";
  const description = isEn ? "Log in to the console." : "登入控制台。";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: buildAlternates(l, "/login"),
    openGraph: { title, description, locale: OG_LOCALE[l] },
  };
}

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string; reset?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  const t = await getTranslations("authLogin");

  const loginPhrases: LoginHeadlinePhrase[] = [
    { primaryLine: t("phrases.p1.primary"), secondaryLine: t("phrases.p1.secondary") },
    { primaryLine: t("phrases.p2.primary"), secondaryLine: t("phrases.p2.secondary") },
    { primaryLine: t("phrases.p3.primary"), secondaryLine: t("phrases.p3.secondary") },
    { primaryLine: t("phrases.p4.primary"), secondaryLine: t("phrases.p4.secondary") },
    { primaryLine: t("phrases.p5.primary"), secondaryLine: t("phrases.p5.secondary") },
  ];

  const params = await searchParams;
  const hasError = Boolean(params.error);
  const hasResetNotice = params.reset === "1";
  const callbackUrl = getSafeRedirectTarget(params.next, "/dashboard");
  const hasGoogleOAuthConfigured = Boolean(
    (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) ||
      (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
  );

  return (
    <main className="fixed inset-x-0 top-[73px] bottom-0 overflow-hidden bg-white">
      <div className="h-full overflow-hidden">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[1.55fr_0.95fr]">
          <section className="flex h-full items-center bg-white px-8 md:px-12 lg:px-20">
            <div className="max-w-3xl -translate-y-6 lg:-translate-y-8">
              <EncryptedTextRotator phrases={loginPhrases} />
            </div>
          </section>

          <section className="flex h-full items-center justify-center bg-slate-50 px-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{t("welcomeBack")}</h2>

              {hasError ? (
                <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{t("errorGeneric")}</p>
              ) : null}
              {hasResetNotice ? (
                <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{t("passwordResetNotice")}</p>
              ) : null}

              {hasGoogleOAuthConfigured ? (
                <>
                  <div className="mt-6 grid gap-3">
                    <GoogleSignInButton callbackUrl={callbackUrl} />
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[11px] uppercase tracking-wide text-slate-400">{t("divider")}</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                </>
              ) : (
                <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  {t("googleNotConfigured")}
                </p>
              )}

              <div className="mt-5">
                <PasswordLoginForm callbackPath={callbackUrl} />
              </div>

              <p className="mt-5 text-center text-xs text-slate-500">
                {t.rich("agreementNotice", {
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

              {process.env.NODE_ENV !== "production" ? (
                <details
                  className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600"
                  open={process.env.ALLOW_DEV_LOGIN === "1"}
                >
                  <summary className="cursor-pointer font-medium text-slate-700">{t("devTitle")}</summary>
                  {process.env.ALLOW_DEV_LOGIN === "1" ? (
                    <form method="post" action="/api/dev-login" className="mt-3 grid gap-2">
                      <p className="text-[11px] text-slate-500">
                        {t("devDescription")}
                      </p>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder={t("devEmailPlaceholder")}
                        className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900"
                      />
                      <input
                        name="userId"
                        type="text"
                        required
                        placeholder={t("devUserIdPlaceholder")}
                        className="h-9 rounded-md border border-slate-300 bg-white px-2 font-mono text-sm text-slate-900"
                      />
                      <button
                        type="submit"
                        className="h-9 rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
                      >
                        {t("devSubmit")}
                      </button>
                    </form>
                  ) : (
                    <p className="mt-2">
                      {t("devHint")}
                    </p>
                  )}
                </details>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
