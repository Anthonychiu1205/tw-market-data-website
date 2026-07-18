import Link from "next/link";

import { buttonClass } from "@/src/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-start justify-center px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">找不到頁面</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
        這個頁面不存在，或已被移動。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={buttonClass("primary")}>回首頁</Link>
        <Link href="/docs" className={buttonClass("secondary")}>查看文件</Link>
      </div>
    </main>
  );
}
