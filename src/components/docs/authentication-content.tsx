"use client";

import Link from "next/link";

import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";
// Shared server-safe content (also feeds /llms-full.txt). Query param `symbol`; do NOT change.
import { authCurl as curlExample, authHabits as HABITS } from "@/src/content/docs-guide-content";

const linkClass =
  "font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700";

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
