"use client";

import Link from "next/link";

import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";

// Query param `symbol` + header `X-API-Key` match the homepage code sample and /openapi.json.
// Error codes are only asserted where the gateway route actually returns them (401 / 403 verified
// in app/v2/datasets/[dataset]/route.ts). 429 + Retry-After are NOT implemented yet → marked as
// building, not stated as live behavior.
const linkClass =
  "font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700";

const curlExample = `curl "https://api.twmarketdata.com/v2/datasets/monthly-revenue?symbol=2330" \\
  -H "X-API-Key: $TWMD_API_KEY"`;

const HABITS: { term: string; desc: string }[] = [
  { term: "金鑰只放標頭，別放網址", desc: "免得留在伺服器日誌或瀏覽紀錄裡。" },
  { term: "一個環境一把金鑰", desc: "開發跟正式分開，哪把外洩就撤哪把（多把金鑰依方案提供）。" },
  { term: "額度看方案", desc: "每把金鑰的每分鐘請求數與每月用量依方案計。" },
];

export function AuthenticationContent() {
  return (
    <div className="space-y-8 py-8">
      <section className="space-y-4 border-b border-slate-200 pb-8">
        <p className="text-[15px] leading-7 text-slate-700">
          每個請求都帶 <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">X-API-Key</code> 標頭。金鑰在{" "}
          <Link href="/dashboard" className={linkClass}>儀表板</Link>{" "}
          自己建立、輪替、撤銷，不用聯絡我們。
        </p>
        <CodeBlock code={curlExample} language="bash" copyButtonVariant="icon" />
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="habits">幾個習慣</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          {HABITS.map((item) => (
            <li key={item.term}>
              <strong className="font-semibold text-slate-900">{item.term}</strong>
              {" — "}
              {item.desc}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <SectionHeading id="errors">常見錯誤</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          <li>
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">401</code> — 金鑰沒帶或無效。
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">403</code> — 你的方案沒有這個資料集的權限。
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">429</code>（速率限制）— rate-limit 回應與{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">Retry-After</code> 標頭建置中；超過方案 RPM／額度的行為以上線公告為準。
          </li>
        </ul>
        <p className="pt-2 text-[15px] leading-7 text-slate-700">
          下一步 →{" "}
          <Link href="/docs/data-provenance" className={linkClass}>來源政策</Link>
        </p>
      </section>
    </div>
  );
}
