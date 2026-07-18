import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/src/auth/session";
import { ResetPasswordForm } from "@/src/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "重設密碼",
  description: "使用重設連結更新密碼。",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const token = params.token?.trim() ?? "";

  return (
    <main className="fixed inset-x-0 top-[73px] bottom-0 overflow-hidden bg-white">
      <div className="h-full overflow-hidden">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[1.55fr_0.95fr]">
          <section className="hidden h-full items-center bg-white px-8 md:px-12 lg:flex lg:px-20">
            <div className="max-w-3xl -translate-y-4">
              <p className="text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">設定新密碼</p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                請輸入新密碼完成重設。
              </p>
            </div>
          </section>

          <section className="flex h-full items-center justify-center bg-slate-50 px-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">重設密碼</h2>

              {token ? (
                <div className="mt-6">
                  <ResetPasswordForm token={token} />
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  連結無效，請重新申請重設密碼。
                  <div className="mt-3">
                    <Link href="/forgot-password" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-800">
                      前往忘記密碼
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
