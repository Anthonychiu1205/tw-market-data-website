"use client";

import Link from "next/link";

import { CodeBlock } from "@/src/components/docs/code-block";
import { SectionHeading } from "@/src/components/docs/section-heading";
// Shared server-safe content (also feeds /llms-full.txt). curlExample/pythonExample use the SSOT
// query param `symbol`; do NOT change to "ticker".
import {
  quickStartCurl as curlExample,
  quickStartPython as pythonExample,
  quickStartNoKeyCurl,
  quickStartNextDatasets as NEXT_DATASETS,
} from "@/src/content/docs-guide-content";

const linkClass =
  "font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700";

export function QuickStartContent() {
  return (
    <div className="space-y-8 py-8">
      {/* Step 0: zero-registration no-key trial (FRICTION-01), placed before "拿 key". */}
      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="try-no-key">步驟 0 · 零註冊先試一筆（免 key）</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          這 5 檔可直接打、不用金鑰：2330 台積電 / 2317 鴻海 / 2454 聯發科 / 0050 / 2603。貼給你的 AI 或直接 curl：
        </p>
        <CodeBlock code={quickStartNoKeyCurl} language="bash" copyButtonVariant="icon" />
        <p className="text-sm leading-7 text-slate-600">（其他股票 / 其他資料集才需要下面的 API key。）</p>
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="get-api-key">1. 拿一把 API 金鑰</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          到{" "}
          <Link href="/dashboard" className={linkClass}>儀表板</Link>{" "}
          註冊，並在後台建立一把 API 金鑰。金鑰放在請求標頭，別放進網址。
        </p>
      </section>

      <section className="space-y-4 border-b border-slate-200 pb-8">
        <SectionHeading id="first-request">2. 打第一個請求</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          每個資料端點都是 <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">GET /v2/datasets/{"{資料集}"}</code>，用{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">X-API-Key</code> 標頭帶上金鑰。
        </p>
        <CodeBlock code={curlExample} language="bash" copyButtonVariant="icon" />
        <CodeBlock code={pythonExample} language="python" copyButtonVariant="icon" />
      </section>

      <section className="space-y-3 border-b border-slate-200 pb-8">
        <SectionHeading id="see-response">3. 看回應</SectionHeading>
        <p className="text-[15px] leading-7 text-slate-700">
          回傳 typed JSON，每筆都帶來源；缺的資料如實留空，不會亂補。欄位說明在各{" "}
          <Link href="/datasets" className={linkClass}>資料集頁</Link>。
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading id="whats-next">接下來</SectionHeading>
        <ul className="space-y-2.5 text-[15px] leading-7 text-slate-700">
          <li>
            挑一個資料集開始：
            {NEXT_DATASETS.map((d, i) => (
              <span key={d.href}>
                {i > 0 ? "、" : ""}
                <Link href={d.href} className={linkClass}>{d.name}</Link>
              </span>
            ))}
            。
          </li>
          <li>
            想看額度與方案 →{" "}
            <Link href="/pricing" className={linkClass}>方案價格</Link>。
          </li>
        </ul>
        <p className="pt-2 text-[15px] leading-7 text-slate-700">
          下一步 →{" "}
          <Link href="/docs/authentication" className={linkClass}>認證</Link>
        </p>
      </section>
    </div>
  );
}
