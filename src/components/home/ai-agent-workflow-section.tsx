import { MarketingContainer } from "@/src/components/ui/marketing-container";

type WorkflowStep = {
  id: number;
  title: string;
  description: string;
};

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    title: "任務理解與規劃",
    description: "AI Agent 解析使用者問題，規劃所需資料與指標。",
  },
  {
    id: 2,
    title: "找對資料集與欄位",
    description: "透過資料目錄與 schema，精準選擇資料集與欄位。",
  },
  {
    id: 3,
    title: "調用 API 取得資料",
    description: "以標準化 API 取得資料，回應包含來源與 lineage。",
  },
  {
    id: 4,
    title: "驗證與品質檢查",
    description: "檢查 freshness、來源層級與欄位完整性，確保可靠性。",
  },
  {
    id: 5,
    title: "資料處理與分析",
    description: "進行指標計算、特徵工程或分析，產生可溯源結論。",
  },
  {
    id: 6,
    title: "輸出結果與可追溯性",
    description: "回傳結果並保留來源、時間與 lineage，可驗證、可稽核。",
  },
];

export function AiAgentWorkflowSection() {
  return (
    <section className="border-t border-slate-200 bg-white py-12">
      <MarketingContainer className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">AI Agent 使用流程</h2>
          <p className="max-w-4xl text-sm leading-7 text-slate-600">
            從任務規劃到取得可靠資料，專為 AI Agent / Quant 工作流程設計，讓資料可驗證、可追溯、可程式化使用。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {WORKFLOW_STEPS.map((step) => (
            <article
              key={step.id}
              className="h-full rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 hover:bg-slate-50/60"
            >
              <div className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-sm font-medium text-slate-700">
                {step.id}
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{step.description}</p>
            </article>
          ))}
        </div>

        <p className="text-sm text-slate-600">可追溯、可驗證、可程式化，適合 agent workflow。</p>
      </MarketingContainer>
    </section>
  );
}
