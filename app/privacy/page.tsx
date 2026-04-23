import type { Metadata } from "next";

import { Container } from "@/src/components/ui/container";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "TW Market Data 隱私政策。",
};

const sections = [
  {
    title: "我們蒐集哪些資訊",
    items: ["帳戶資訊（例如電子郵件）", "API 請求與用量紀錄", "裝置與瀏覽器基礎資訊"],
  },
  {
    title: "如何使用資料",
    items: ["提供與維護平台服務", "改善產品效能與使用體驗", "回應客服與技術支援需求"],
  },
  {
    title: "Cookie / 分析工具",
    items: ["使用必要 Cookie 維持登入與安全狀態", "使用分析工具了解功能使用情況", "可透過瀏覽器設定管理 Cookie 偏好"],
  },
  {
    title: "資料保存與安全性",
    items: ["依業務與法規需求保存資料", "採取合理安全措施保護資料", "僅於必要範圍內提供授權人員存取"],
  },
  {
    title: "聯絡方式",
    items: ["如有隱私相關問題，請透過聯絡頁面與我們聯繫。"],
  },
];

export default function PrivacyPage() {
  return (
    <Container className="space-y-8 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">隱私政策</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">本政策說明我們如何蒐集、使用與保護您在使用服務時提供的資訊。</p>
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
