import { getTranslations } from "next-intl/server";

import { MarketingContainer } from "@/src/components/ui/marketing-container";

type WorkflowStep = {
  id: number;
  titleKey: string;
  descriptionKey: string;
};

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    titleKey: "step1Title",
    descriptionKey: "step1Description",
  },
  {
    id: 2,
    titleKey: "step2Title",
    descriptionKey: "step2Description",
  },
  {
    id: 3,
    titleKey: "step3Title",
    descriptionKey: "step3Description",
  },
  {
    id: 4,
    titleKey: "step4Title",
    descriptionKey: "step4Description",
  },
  {
    id: 5,
    titleKey: "step5Title",
    descriptionKey: "step5Description",
  },
  {
    id: 6,
    titleKey: "step6Title",
    descriptionKey: "step6Description",
  },
];

export async function AiAgentWorkflowSection() {
  const t = await getTranslations("home.aiAgentWorkflow");

  return (
    <section className="border-t border-slate-200 bg-white py-12">
      <MarketingContainer className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h2>
          <p className="max-w-4xl text-sm leading-7 text-slate-600">
            {t("intro")}
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
              <h3 className="mt-5 text-base font-semibold text-slate-950">{t(step.titleKey)}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{t(step.descriptionKey)}</p>
            </article>
          ))}
        </div>

        <p className="text-sm text-slate-600">{t("footnote")}</p>
      </MarketingContainer>
    </section>
  );
}
