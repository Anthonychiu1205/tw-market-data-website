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

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {WORKFLOW_STEPS.map((step) => (
            <article
              key={step.id}
              className="relative rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-4"
            >
              <div className="mb-2 inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700">
                {step.id}
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">{step.description}</p>
              {step.id < WORKFLOW_STEPS.length ? (
                <span className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-slate-300 xl:block" aria-hidden="true">
                  →
                </span>
              ) : null}
            </article>
          ))}
        </div>

        <p className="text-sm text-slate-600">可追溯、可驗證、可程式化、AI Ready</p>
      </MarketingContainer>
    </section>
  );
}

