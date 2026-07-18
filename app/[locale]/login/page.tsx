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
  searchParams: Promise<{ error?: string; next?: string; reset?: string }>;
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
              <EncryptedTextRotator phrases={LOGIN_PHRASES} />
            </div>
          </section>

          <section className="flex h-full items-center justify-center bg-slate-50 px-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">歡迎回來</h2>

              {hasError ? (
                <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">登入失敗，請稍後再試一次。</p>
              ) : null}
              {hasResetNotice ? (
                <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">密碼已更新，請重新登入。</p>
              ) : null}

              {hasGoogleOAuthConfigured ? (
                <>
                  <div className="mt-6 grid gap-3">
                    <GoogleSignInButton callbackUrl={callbackUrl} />
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[11px] uppercase tracking-wide text-slate-400">或</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                </>
              ) : (
                <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  本機未設定 Google OAuth，請使用 Email 與密碼登入。
                </p>
              )}

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
                <details
                  className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600"
                  open={process.env.ALLOW_DEV_LOGIN === "1"}
                >
                  <summary className="cursor-pointer font-medium text-slate-700">本機開發用</summary>
                  {process.env.ALLOW_DEV_LOGIN === "1" ? (
                    <form method="post" action="/api/dev-login" className="mt-3 grid gap-2">
                      <p className="text-[11px] text-slate-500">
                        dev-login：以指定 userId 建立 session（userId = sandbox 訂閱的 externalCustomerId）。僅本機。
                      </p>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="email（如 anthonyiaaan@gmail.com）"
                        className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900"
                      />
                      <input
                        name="userId"
                        type="text"
                        required
                        placeholder="userId = sandbox sub externalId"
                        className="h-9 rounded-md border border-slate-300 bg-white px-2 font-mono text-sm text-slate-900"
                      />
                      <button
                        type="submit"
                        className="h-9 rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
                      >
                        Dev 登入
                      </button>
                    </form>
                  ) : (
                    <p className="mt-2">
                      設 `ALLOW_DEV_LOGIN=1`（僅 .env.local）可用 dev-login 表單；或設定 Google OAuth。
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
