import type { Metadata } from "next";

import { Container } from "@/src/components/ui/container";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "退款政策",
  description: "TW Market Data 退款政策。",
};

const sections = [
  {
    title: "一、數位服務性質",
    items: [
      "本服務屬於數位內容與 API 訂閱服務，開通後即可存取平台功能與資料。",
      "由於數位服務具即時交付特性，原則上不適用一般實體商品退貨模式。",
    ],
  },
  {
    title: "二、一般退款原則",
    items: [
      "除本政策另有規定外，已收取之訂閱費用或使用費用原則上不提供退款。",
      "若您不希望續訂，請於下一計費週期前取消訂閱。",
    ],
  },
  {
    title: "三、例外情況",
    items: [
      "若因平台重大系統錯誤，導致已付款服務在合理期間內無法使用，得提出退款申請。",
      "我們將依實際情況審核，可能提供全額或部分退款，或等值服務補償。",
      "是否符合例外退款條件，以我們審核結果與系統紀錄為準。",
    ],
  },
  {
    title: "四、取消訂閱",
    items: [
      "您可隨時於帳戶或訂閱管理流程取消訂閱。",
      "取消後通常自下一計費週期起停止收費；已生效期間不另行按比例退款（依法另有規定者除外）。",
    ],
  },
  {
    title: "五、聯絡方式",
    items: [
      "如需申請退款或詢問帳務問題，請透過聯絡頁面與我們聯繫。",
      `電子郵件：${siteConfig.supportEmail}`,
      "聯絡頁面：/contact",
    ],
  },
];

export default function RefundPage() {
  return (
    <Container className="space-y-8 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">退款政策</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          本政策說明 TW Market Data 訂閱與數位服務之退款原則，作為訂閱與付款前的重要參考。
        </p>
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
