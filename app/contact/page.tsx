import type { Metadata } from "next";

import { buttonClass } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";

export const metadata: Metadata = {
  title: "聯絡",
  description: "商務、資料需求與整合支援入口。",
};

export default function ContactPage() {
  return (
    <Container className="space-y-6 py-12">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold tracking-wide text-slate-500">聯絡</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">產品導向聯繫入口</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
          依需求類型提交，我們會回覆對應的導入建議與處理流程。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["企業與商務", "方案、採購與 SLA 需求"],
          ["資料需求", "欄位、覆蓋範圍與品質需求"],
          ["整合支援", "API 接入與用量流程問題"],
        ].map(([title, text]) => (
          <Card key={title}>
            <p className="text-base font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm text-slate-600">{text}</p>
          </Card>
        ))}
      </section>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">需求表單（介面示意）</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2">
          <select className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
            <option>選擇需求類型</option>
            <option>企業與商務</option>
            <option>資料需求</option>
            <option>整合支援</option>
          </select>
          <input className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="聯絡 Email" />
          <input className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2" placeholder="公司 / 團隊 / 專案名稱" />
          <textarea
            className="min-h-28 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2"
            placeholder="描述需求、預估流量、導入時程"
          />
          <button type="button" className={buttonClass("primary", "w-fit")}>
            提交（僅介面）
          </button>
        </form>
      </Card>
    </Container>
  );
}
