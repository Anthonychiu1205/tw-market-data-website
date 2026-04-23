export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "tw-market-data-source-policy",
    title: "台股資料平台的來源政策：為何 official/public-first 很重要",
    excerpt: "說明 canonical、fallback、helper 的角色分離，以及在研究與系統上線時的風險差異。",
    category: "資料方法",
    publishedAt: "2026-04-20",
    readingMinutes: 6,
    body: [
      "在台股資料整合中，來源混用會直接影響策略可重現性與報表一致性。",
      "我們將 TWSE、TPEx、MOPS 視為優先來源，並在回應中保留來源角色與 lineage。",
      "這個設計的目標不是多抓資料，而是讓資料在開發、驗證、營運三個階段都可追溯。",
    ],
  },
  {
    slug: "developer-vs-pro-plan-selection",
    title: "Developer 與 Pro 該怎麼選：從開發驗證到生產環境",
    excerpt: "整理兩個方案在速率、歷史資料深度、更新優先級與監控能力上的實際差異。",
    category: "導入教學",
    publishedAt: "2026-04-18",
    readingMinutes: 5,
    body: [
      "Developer 適合功能驗證與研究原型，Pro 則面向正式策略與自動化系統。",
      "兩者差異不只在配額，還包含歷史資料深度、資料校對與更新優先級。",
      "若你的流程已進入 production，建議優先評估 Pro 的穩定性與觀測能力。",
    ],
  },
  {
    slug: "from-docs-to-production-workflow",
    title: "從文件到上線：台股資料 API 的最小導入流程",
    excerpt: "提供一條可操作的導入順序，從文件閱讀、金鑰管理到用量監控。",
    category: "實作流程",
    publishedAt: "2026-04-15",
    readingMinutes: 4,
    body: [
      "第一步先確認資料集覆蓋範圍與欄位定義，再決定接入端點。",
      "第二步使用控制台管理 API 金鑰與配額，建立開發與生產分離策略。",
      "第三步建立用量監控與錯誤重試規則，確保系統在高頻請求下可持續運行。",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
