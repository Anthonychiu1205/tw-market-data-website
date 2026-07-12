import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/ui/container";

// FRICTION-01 B-0c / §C-4 — "哪一層適合我" routing guide (public).
export const metadata: Metadata = {
  title: "哪一層適合我",
  description: "只想試看看走免 key、開發者走 API key、Claude.ai/ChatGPT 付費走 MCP connector。",
  alternates: { canonical: "/connect/which-tier" },
};

const ROWS: { who: string; tier: string; how: string }[] = [
  { who: "只想試看看 / 給 AI 貼一句", tier: "第一層 · 免 key", how: "貼 /skill.md 那句，用五檔試" },
  { who: "開發者 / 自建 agent / 量化", tier: "第二層 · API key", how: "帳戶頁取 key，走 REST 計費" },
  { who: "在 Claude.ai / ChatGPT 裡要付費用", tier: "第三層 · MCP connector", how: "加 connector、OAuth 授權" },
];

export default function WhichTierPage() {
  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Connect</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">哪一層適合我</h1>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">你是…</th>
                <th className="px-3 py-2 font-medium">走哪層</th>
                <th className="px-3 py-2 font-medium">怎麼開始</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROWS.map((r) => (
                <tr key={r.who} className="text-slate-700">
                  <td className="px-3 py-3 align-top">{r.who}</td>
                  <td className="px-3 py-3 align-top font-medium text-slate-900">{r.tier}</td>
                  <td className="px-3 py-3 align-top">{r.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
          一句話總結：<strong className="font-semibold text-slate-900">免費試玩走一句話，開發整合走 API key，消費者聊天付費走 connector。</strong>
        </p>

        <p className="border-t border-slate-200 pt-6 text-sm">
          ←{" "}
          <Link href="/connect" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">回接入你的 AI</Link>
        </p>
      </div>
    </Container>
  );
}
