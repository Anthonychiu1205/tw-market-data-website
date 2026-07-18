import { getTranslations } from "next-intl/server";

import { SectionHeading } from "@/src/components/docs/section-heading";
import { datasetCoverageTable } from "@/src/content/coverage-facts";

// BENCH-01 §2 doc-layer additions for each API endpoint page:
//   - ApiCoverageTable: 4-col coverage mini-table (標的數 / 起始年 / 更新時點 / 含已下市). One column
//     more than financialdatasets.ai (含已下市). DB-verified values only; unknown → "coming".
//   - ApiLimitations: honest "限制與注意" — FDS has no caveats section; this is our differentiator.
// Both are pure content (no client JS, no new chrome).

export async function ApiCoverageTable({ slug }: { slug: string }) {
  const t = await getTranslations("docsDemo");
  const row = datasetCoverageTable[slug];
  const cell = (value?: string) => value ?? t("coverage.comingValue");
  const delisted =
    row?.includesDelisted === true ? "✓" : row?.includesDelisted === false ? "—" : "coming";

  return (
    <section className="space-y-3 border-b border-slate-200 pb-8">
      <SectionHeading id="coverage">{t("coverage.heading")}</SectionHeading>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">{t("coverage.instruments")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("coverage.startYear")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("coverage.updateTiming")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("coverage.includesDelisted")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="text-slate-700">
              <td className="px-3 py-2">{cell(row?.instruments)}</td>
              <td className="px-3 py-2">{cell(row?.startYear)}</td>
              <td className="px-3 py-2">{cell(row?.updateTiming)}</td>
              <td className="px-3 py-2">{delisted}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">
        {t.rich("coverage.caption", {
          nowrap: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
        })}
      </p>
    </section>
  );
}

// Honest platform-wide limitations (all true; see 差異聲明). Per-endpoint specifics can be added to
// DATASET_LIMITATIONS later without touching layout.
// NOTE: This zh array is the source for the /llms-full.txt build (zh-only static file, see
// build-llms-full.ts). The UI renders the bilingual copy from the docsDemo.limitations.items catalog
// (zh values there mirror these byte-for-byte); keep the two in sync if edited.
export const PLATFORM_LIMITATIONS: string[] = [
  "覆蓋非全市場、全期間；實際範圍以上方覆蓋小表與回應中的 data_gaps 為準。",
  "資料有缺會如實標記，不以推測值補洞。",
  "本平台聚焦日頻與基本面資料；不提供即時報價、盤中分K與加密貨幣。",
  "TWSE 為 verified baseline；TPEx 歷史深度與還原股價目前為 beta / deferred，逐集標示。",
];

const DATASET_LIMITATIONS: Record<string, string[]> = {};

export async function ApiLimitations({ slug }: { slug: string }) {
  const t = await getTranslations("docsDemo");
  const platformItems = t.raw("limitations.items") as string[];
  const items = [...platformItems, ...(DATASET_LIMITATIONS[slug] ?? [])];
  return (
    <section className="space-y-3 border-b border-slate-200 pb-8">
      <SectionHeading id="limitations">{t("limitations.heading")}</SectionHeading>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-500">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
