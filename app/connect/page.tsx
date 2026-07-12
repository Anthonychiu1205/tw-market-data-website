import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/ui/container";
import { getAbsoluteUrl, siteConfig } from "@/src/config/site";

// FRICTION-01 B-0 / §C-2 — public (white-zone) three-tier connect funnel. Reachable without login
// (the site middleware gates only /dashboard|/billing|/usage|/settings|/account).
export const metadata: Metadata = {
  title: "接入你的 AI",
  description:
    "三層接入 TW Market Data：一句話零認證試玩、開發者 API key、消費者聊天 MCP connector。",
  alternates: { canonical: "/connect" },
  openGraph: {
    title: "接入你的 AI | TW Market Data",
    description: "一句話試玩、API key、MCP connector — 選一層開始接台股資料。",
    url: "/connect",
    images: [getAbsoluteUrl(siteConfig.ogImagePath)],
  },
};

const pasteLine = "Read https://twmarketdata.com/skill.md and connect to TW Market Data. 先用 2330 試一筆。";
const curlLine =
  'curl -H "X-API-Key: $TWMD_API_KEY" "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330"';

function CodeLine({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
      <code>{children}</code>
    </pre>
  );
}

export default function ConnectPage() {
  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">接入你的 AI</h1>
          <p className="text-base leading-7 text-slate-600">
            選一層開始接台股官方第一手資料——免費試玩、開發整合，或在聊天裡付費使用。
          </p>
        </header>

        {/* 第一層 */}
        <section className="rounded-2xl border border-slate-900 bg-white p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">第一層</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">30 秒試玩（零認證零註冊）</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">把這句貼給你的 AI：</p>
          <CodeLine>{pasteLine}</CodeLine>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            任何 agent 都能用免 key 五檔（2330 台積電 / 2317 鴻海 / 2454 聯發科 / 0050 元大台灣50 / 2603 長榮）立即拿到真資料。
          </p>
        </section>

        {/* 第二層 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">第二層</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">開發者正式通道（API key）</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Claude Code / Cursor / 自建 agent：於帳戶頁取 API key，走 REST，按用量計費。
          </p>
          <CodeLine>{curlLine}</CodeLine>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            ⚠️ 請為每個 agent 開<strong className="font-semibold text-slate-900">專用 key</strong>（見{" "}
            <Link href="/connect/key-safety" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">key 安全</Link>
            ），別把主 key 貼進對話。
          </p>
        </section>

        {/* 第三層 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">第三層</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">消費者聊天（MCP connector，OAuth）</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            在 Claude.ai / ChatGPT 裡付費使用的<strong className="font-semibold text-slate-900">唯一正道</strong>、也是工具呼叫最穩的方式：加入 TW Market Data connector 授權即用。
          </p>
          <p className="mt-3 rounded-lg bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
            💡 若你在 Claude.ai 裡貼「一句話」卻拿不到付費資料，<strong className="font-semibold text-slate-900">不是產品壞掉</strong>——消費者聊天請走這層 connector。
          </p>
        </section>

        {/* 底部三配套連結 */}
        <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-sm">
          <a href="/skill.md" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">/skill.md</a>
          <Link href="/connect/key-safety" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">key 安全指引</Link>
          <Link href="/connect/which-tier" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">哪一層適合我</Link>
        </div>

        <p className="text-sm leading-7 text-slate-500">
          一句話總結：<strong className="font-medium text-slate-700">免費試玩走一句話，開發整合走 API key，消費者聊天付費走 connector。</strong>
        </p>
      </div>
    </Container>
  );
}
