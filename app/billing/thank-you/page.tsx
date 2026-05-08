import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/src/components/ui/container";
import { buttonClass } from "@/src/components/ui/button";

export const metadata: Metadata = {
  title: "付款確認中",
  description: "付款授權結果正在確認中，系統將以綠界付款通知更新方案狀態。",
  alternates: {
    canonical: "/billing/thank-you",
  },
};

export default function BillingThankYouPage() {
  return (
    <Container className="py-16">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">付款授權結果正在確認中。</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          系統會以綠界付款通知為準更新你的方案狀態。此頁僅作為流程導回，不代表已完成付款確認。
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/billing" className={buttonClass("primary")}>前往帳務</Link>
          <Link href="/dashboard" className={buttonClass("secondary")}>前往儀表板</Link>
        </div>
      </section>
    </Container>
  );
}
