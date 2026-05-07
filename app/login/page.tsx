import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/src/auth/session";
import { GoogleSignInButton } from "@/src/components/auth/google-sign-in-button";
import { PasswordLoginForm } from "@/src/components/auth/password-login-form";
import { EncryptedTextRotator, type LoginHeadlinePhrase } from "@/src/components/ui/encrypted-text-rotator";
import { getSafeRedirectTarget } from "@/src/lib/security/safe-redirect";

export const metadata: Metadata = {
  title: "登入",
  description: "登入控制台。",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

const LOGIN_PHRASES: LoginHeadlinePhrase[] = [
  {
    primaryLine: "為 AI agent 提供",
    secondaryLine: "可驗證的台股資料",
  },
  {
    primaryLine: "把價格、財報與事件",
    secondaryLine: "接進同一條資料流程",
  },
  {
    primaryLine: "讓量化研究與自動化",
    secondaryLine: "共用同一份資料底座",
  },
  {
    primaryLine: "用結構化資料",
    secondaryLine: "建立可重複的研究流程",
  },
  {
    primaryLine: "讓模型讀到的不是雜訊",
    secondaryLine: "而是可追溯的市場資料",
  },
];

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const hasError = Boolean(params.error);
  const callbackUrl = getSafeRedirectTarget(params.next, "/dashboard");

  return (
    <main className="fixed inset-x-0 top-[73px] bottom-0 overflow-hidden bg-white">
      <div className="h-full overflow-hidden">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[1.55fr_0.95fr]">
          <section className="flex h-full items-center bg-white px-8 md:px-12 lg:px-20">
            <div className="max-w-3xl -translate-y-6 lg:-translate-y-8">
              <EncryptedTextRotator phrases={LOGIN_PHRASES} />
            </div>
          </section>

          <section className="flex h-full items-center justify-center bg-slate-50 px-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">歡迎回來</h2>

              {hasError ? (
                <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">登入失敗，請稍後再試一次。</p>
              ) : null}

              <div className="mt-6 grid gap-3">
                <GoogleSignInButton callbackUrl={callbackUrl} />
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] uppercase tracking-wide text-slate-400">或</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="mt-5">
                <PasswordLoginForm callbackPath={callbackUrl} />
              </div>

              <p className="mt-5 text-center text-xs text-slate-500">
                登入即表示同意
                <Link href="/terms" className="mx-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
                  Terms
                </Link>
                與
                <Link href="/privacy" className="mx-1 underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
                  Privacy
                </Link>
              </p>

              {process.env.NODE_ENV !== "production" ? (
                <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  <summary className="cursor-pointer font-medium text-slate-700">本機開發用</summary>
                  <p className="mt-2">Google OAuth 需設定 `GOOGLE_CLIENT_ID` 與 `GOOGLE_CLIENT_SECRET` 後可測試。</p>
                </details>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
