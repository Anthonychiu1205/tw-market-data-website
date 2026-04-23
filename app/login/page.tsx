import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getDemoCredentials, getSession } from "@/src/auth/session";
import { buttonClass } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";

export const metadata: Metadata = {
  title: "登入",
  description: "登入控制台。",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const hasError = params.error === "credentials";
  const demo = getDemoCredentials();

  return (
    <Container className="py-14">
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <Card className="p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">控制台入口</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">管理金鑰、用量與方案</h1>
          <p className="mt-4 max-w-xl text-base text-slate-600">登入後可查看目前方案、用量摘要與 API 金鑰。</p>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">登入</h2>

          {hasError && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Email 或密碼不正確。</p>
          )}

          <form action="/api/auth/login" method="post" className="mt-5 grid gap-3">
            <label className="grid gap-1 text-sm text-slate-700">
              Email
              <input name="email" type="email" required className="rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600" placeholder="you@example.com" />
            </label>
            <label className="grid gap-1 text-sm text-slate-700">
              密碼
              <input name="password" type="password" required className="rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600" placeholder="••••••••" />
            </label>
            <button type="submit" className={buttonClass("primary", "mt-2")}>
              登入
            </button>
          </form>

          <details className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <summary className="cursor-pointer font-medium text-slate-700">開發環境憑證</summary>
            <p className="mt-2">DEMO_USER_EMAIL={demo.email}</p>
            <p>DEMO_USER_PASSWORD={demo.password}</p>
          </details>
        </Card>
      </div>
    </Container>
  );
}
