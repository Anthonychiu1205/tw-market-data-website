import type { Metadata } from "next";

import { Container } from "@/src/components/ui/container";

export const metadata: Metadata = {
  title: "隱私政策",
  description: "TW Market Data 隱私政策。",
};

type PrivacySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const sections: PrivacySection[] = [
  {
    title: "一、蒐集之資訊類型",
    paragraphs: ["我們可能蒐集下列資訊。"],
    bullets: [
      "帳號資訊：例如姓名、電子郵件、公司名稱、登入資訊或帳號識別資訊。",
      "使用資訊：例如 API 呼叫紀錄、使用時間、功能操作紀錄、控制台互動、裝置與瀏覽器資訊。",
      "付款與訂閱資訊：例如方案、付款狀態、訂閱紀錄、帳務資訊。",
      "聯絡資訊：例如您透過表單、電子郵件或支援流程提供的內容。",
    ],
  },
  {
    title: "二、資訊使用目的",
    paragraphs: ["我們可能將蒐集之資訊用於下列目的。"],
    bullets: [
      "提供、維護與改善本服務。",
      "驗證帳號與 API 金鑰。",
      "管理配額、速率限制與授權邊界。",
      "處理訂閱、付款、帳務與支援請求。",
      "偵測異常活動、濫用或安全事件。",
      "發送與服務相關之重要通知。",
      "進行內部分析、產品優化與合規管理。",
    ],
  },
  {
    title: "三、資料分享與揭露",
    paragraphs: ["除下列情況外，我們不會任意出售或揭露您的個人資料。"],
    bullets: [
      "經您同意。",
      "為履行服務所必要，與付款、雲端、分析、客服或技術供應商合作。",
      "為遵循法律義務、法院命令或主管機關要求。",
      "為保護本平台、使用者或第三人之權利、安全或合法利益。",
    ],
  },
  {
    title: "四、資料保存與安全",
    paragraphs: [
      "我們採取合理技術與管理措施保護您的資訊安全，包括但不限於權限控管、驗證、記錄與其他合理保護措施。然而，任何網路傳輸或儲存方式均無法保證絕對安全，您仍應妥善管理帳號與 API 金鑰。",
      "我們將依資料性質、法令要求、合規需求與服務目的，在合理必要期間內保存您的資訊。",
    ],
  },
  {
    title: "五、Cookie 與類似技術",
    paragraphs: [
      "本平台可能使用 Cookie 或類似技術，以維持登入狀態、改善體驗、分析流量與支援網站功能。您得依瀏覽器設定管理 Cookie，但部分功能可能因此受影響。",
    ],
  },
  {
    title: "六、您的權利",
    paragraphs: [
      "在適用法令範圍內，您可能享有查詢、更正、刪除、限制處理或其他相關權利。若您欲行使相關權利，請透過本平台聯絡頁與我們聯繫，我們將於合理期間內處理。",
    ],
  },
  {
    title: "七、政策更新",
    paragraphs: ["我們可能因法令、服務或產品調整更新本隱私政策。更新後版本將公布於網站，並自公告或標示之生效日起生效。"],
  },
  {
    title: "八、聯絡方式",
    paragraphs: ["如您對本隱私政策有任何疑問，請透過官網聯絡頁與我們聯繫。"],
  },
];

export default function PrivacyPage() {
  return (
    <Container className="space-y-8 py-12">
      <section className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">隱私政策</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          本隱私政策說明 TW Market Data 如何蒐集、使用、保護與處理您在使用本平台與相關服務時提供之資訊。請您於使用前詳閱本政策內容。
        </p>
      </section>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            {section.paragraphs ? (
              <div className="space-y-2 text-sm leading-7 text-slate-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            {section.bullets ? (
              <ul className="space-y-1 text-sm leading-7 text-slate-600">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>- {bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section id="analytics-cookies" className="scroll-mt-24 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Analytics & Cookies（產品分析）</h2>
          <p className="text-sm leading-7 text-slate-600">
            我們使用輕量 product analytics 來改善 onboarding、登入流程、API 穩定性與文件可用性。此分析僅用於產品優化與營運觀測，不用於廣告追蹤，也不出售個人資料。
          </p>
          <ul className="space-y-1 text-sm leading-7 text-slate-600">
            <li>- 不蒐集 raw API key、token、密碼等敏感欄位。</li>
            <li>- 僅保留必要事件（例如登入成功、API key 操作、SDK/MCP 文件檢視、gateway 超時事件）。</li>
            <li>- 可於網站的 analytics 設定提示中選擇關閉產品分析。</li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
