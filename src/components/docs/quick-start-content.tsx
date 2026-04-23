"use client";

import { useState } from "react";

import Link from "next/link";

import { AnimatedCodeBlock } from "@/src/components/docs/animated-code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";
import { cn } from "@/src/lib/cn";

const quickStartTabs = [
  {
    id: "python",
    label: "Python",
    code: `import requests

headers = {"X-API-Key": "your_api_key_here"}

url = "https://api.yourdomain.com/v2/datasets/twse-daily-price?symbol=2330&start_date=2026-04-01&end_date=2026-04-23&limit=30"

response = requests.get(url, headers=headers)
data = response.json()

print(data)`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    code: `const res = await fetch("https://api.yourdomain.com/v2/datasets/tpex-daily-price?symbol=5483&limit=20", {
  headers: {
    "X-API-Key": "your_api_key_here"
  }
})

const data = await res.json()
console.log(data)`,
  },
  {
    id: "curl",
    label: "cURL",
    code: `curl -H "X-API-Key: your_api_key_here" \\
"https://api.yourdomain.com/v2/datasets/twse-daily-price?symbol=2330&start_date=2026-04-01&end_date=2026-04-23&limit=30"`,
  },
] as const;

const exploreItems = [
  {
    id: "twse-daily-price",
    title: "查詢 TWSE 日價資料",
    description: "使用 /v2/datasets/twse-daily-price 取得 TWSE 未還原（unadjusted）日價資料。",
    href: "/docs/api/market-prices/price-data",
  },
  {
    id: "tpex-daily-price",
    title: "查詢 TPEx 日價資料",
    description: "使用 /v2/datasets/tpex-daily-price 取得 TPEx 未還原（unadjusted）日價資料。",
    href: "/docs/api/market-prices/price-data",
  },
  {
    id: "search-api",
    title: "搜尋 API",
    description: "使用 /v2/search 進行代號與名稱搜尋，作為查詢入口。",
    href: "/docs/api/query-tools/search-api",
  },
  {
    id: "query-api",
    title: "查詢 API",
    description: "使用 /v2/query 做欄位條件查詢與批次篩選。",
    href: "/docs/api/query-tools/query-api",
  },
  {
    id: "explainability",
    title: "Explainability",
    description: "查詢結果可附帶來源與公式解釋，方便驗證與審計。",
    href: "/docs/api/query-tools/explainability",
  },
] as const;

const nextCards = [
  { title: "股價資料", description: "查看價格資料頁（含 TWSE/TPEx 日價相關說明）。", href: "/docs/api/market-prices/price-data" },
  { title: "技術指標", description: "查看 technical_indicators 主題與欄位定義。", href: "/docs/api/market-prices/technical-indicators" },
  { title: "查詢與工具", description: "查看 Search / Query / Explainability 文件。", href: "/docs/api/query-tools" },
  { title: "產品總覽", description: "查看目前可對外展示的產品能力。", href: "/product" },
] as const;

export function QuickStartContent() {
  const [openItemId, setOpenItemId] = useState<string>(exploreItems[0]?.id ?? "");

  return (
    <div className="space-y-8 py-8">
      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="create-account">1. 建立帳號</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">註冊帳號後，在 dashboard 取得 API key，先完成單一主題驗證，再擴展到多主題流程。</p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="first-request">2. 發送第一個請求</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">每個 API request 需要：</p>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
          <li>API key（放在 X-API-Key header）</li>
          <li>symbol（股票代碼，例如 TWSE: 2330、TPEx: 5483）</li>
          <li>日價查詢參數：start_date、end_date、limit（可選）</li>
          <li>TWSE/TPEx 日價端點目前採每組 API key 每分鐘 60 次限制</li>
          <li>日價資料語意為未還原（unadjusted），日期以 Asia/Taipei 交易日（YYYY-MM-DD）為準</li>
        </ul>
        <p className="text-sm leading-7 text-slate-600">
          回應結構可先用 <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">dataset</code>、<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">rows</code>、<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">count</code> 驗證整合是否成功。
        </p>
        <AnimatedCodeBlock tabs={[...quickStartTabs]} className="mt-2" />
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="explore-more">3. Explore More</SectionHeading>
        <p className="text-sm leading-7 text-slate-600">完成基本請求後，可以繼續嘗試其他常用資料。</p>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          {exploreItems.map((item, index) => {
            const isOpen = openItemId === item.id;
            return (
              <div key={item.id} className={cn(index < exploreItems.length - 1 ? "border-b border-slate-200" : "")}>
                <button
                  type="button"
                  onClick={() => setOpenItemId((prev) => (prev === item.id ? "" : item.id))}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn("h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform", isOpen ? "rotate-90" : "")}
                    aria-hidden="true"
                  >
                    <path d="m7 5 6 5-6 5" />
                  </svg>
                  <span className="flex-1">{item.title}</span>
                </button>
                {isOpen ? (
                  <div className="space-y-2 px-9 pb-4">
                    <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                    <Link href={item.href} className="inline-flex text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
                      前往文件
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading id="whats-next">4. What&apos;s Next</SectionHeading>
        <div className="grid gap-3 md:grid-cols-2">
          {nextCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-lg border border-slate-200 bg-white p-4 transition duration-200 hover:border-slate-300 hover:shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
