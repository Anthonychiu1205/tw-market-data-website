import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/ui/container";

// FRICTION-01 B-0b / §C-3 — key safety guidance (public).
export const metadata: Metadata = {
  title: "為你的 AI 建一把專用 key",
  description: "一個 agent 一把 key、可獨立撤銷、絕不貼主 key 進對話、定期輪換。",
  alternates: { canonical: "/connect/key-safety" },
};

const POINTS: { term: string; desc: string }[] = [
  { term: "一個 agent 一把 key", desc: "到帳戶頁「API Keys」新增一把，命名（如 claude-desktop、research-bot）方便日後辨識。" },
  { term: "可獨立撤銷", desc: "某把 key 外洩或不再用，直接撤銷該把，不影響其他 agent、不必換主 key。" },
  { term: "絕不貼主 key 進對話", desc: "對話紀錄可能被保存；只給 agent 專用副 key。" },
  { term: "定期輪換", desc: "高頻或公開場景的 key 建議定期換發。" },
];

export default function KeySafetyPage() {
  return (
    <Container className="py-12 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Connect</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">為你的 AI 建一把專用 key</h1>
        </header>

        <ol className="space-y-4">
          {POINTS.map((p, i) => (
            <li key={p.term} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-base font-semibold text-slate-950">
                {i + 1}. {p.term}
              </p>
              <p className="mt-1 text-sm leading-7 text-slate-600">{p.desc}</p>
            </li>
          ))}
        </ol>

        <p className="rounded-lg bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
          能力對照：系統已支援一帳號多把可命名、可獨立撤銷的 key（<code className="text-slate-600">key_label</code> /{" "}
          <code className="text-slate-600">revoked_at</code> / <code className="text-slate-600">created_by_customer</code>）。若帳戶頁尚未開放「新增多把」，此為待補的小前置。
        </p>

        <p className="border-t border-slate-200 pt-6 text-sm">
          ←{" "}
          <Link href="/connect" className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">回接入你的 AI</Link>
        </p>
      </div>
    </Container>
  );
}
