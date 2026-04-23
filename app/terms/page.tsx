import type { Metadata } from "next";

import { Container } from "@/src/components/ui/container";

export const metadata: Metadata = {
  title: "服務條款",
  description: "TW Market Data 服務條款。",
};

const sections = [
  {
    title: "服務內容",
    items: ["本服務提供台股資料 API 與相關控制台功能", "實際可用功能以當前方案與文件說明為準"],
  },
  {
    title: "使用者責任",
    items: ["使用者需妥善保管帳戶與 API 金鑰", "應遵守相關法令與平台使用規範"],
  },
  {
    title: "禁止事項",
    items: ["不得濫用服務或嘗試繞過配額與存取限制", "不得從事未授權的資料重散布或非法用途"],
  },
  {
    title: "服務可用性與變更",
    items: ["我們可能因維運需求調整服務內容與功能", "重大變更將以合理方式公告"],
  },
  {
    title: "免責聲明",
    items: ["資料與服務依現況提供", "使用者應自行評估資料於其業務或決策之適用性"],
  },
  {
    title: "聯絡方式",
    items: ["若對條款內容有疑問，請透過聯絡頁面與我們聯繫。"],
  },
];

export default function TermsPage() {
  return (
    <Container className="space-y-8 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">服務條款</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">本條款說明使用 TW Market Data 服務時，您與我們之間的權利與義務。</p>
      </section>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <ul className="space-y-1 text-sm leading-7 text-slate-600">
              {section.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
