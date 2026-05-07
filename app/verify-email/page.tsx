import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/src/auth/session";
import { VerifyEmailForm } from "@/src/components/auth/verify-email-form";
import { normalizeEmail } from "@/src/lib/auth/email-verification";

export const metadata: Metadata = {
  title: "驗證 Email",
  description: "輸入驗證碼啟用帳戶。",
};

type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const initialEmail = params.email ? normalizeEmail(params.email) : "";

  return (
    <main className="fixed inset-x-0 top-[73px] bottom-0 overflow-hidden bg-white">
      <div className="h-full overflow-hidden">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[1.55fr_0.95fr]">
          <section className="hidden h-full items-center bg-white px-8 md:px-12 lg:flex lg:px-20">
            <div className="max-w-3xl -translate-y-4">
              <p className="text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">完成 Email 驗證</p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                我們已寄出 6 位數驗證碼。輸入後即可建立 session 並進入控制台。
              </p>
            </div>
          </section>

          <section className="flex h-full items-center justify-center bg-slate-50 px-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">驗證 Email</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                驗證碼 10 分鐘內有效。若未收到可重新寄送。
              </p>

              <div className="mt-6">
                <VerifyEmailForm initialEmail={initialEmail} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
