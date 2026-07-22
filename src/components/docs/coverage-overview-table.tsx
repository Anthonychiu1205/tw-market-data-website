import {
  DOCS_DATASET_CATALOG,
  DOCS_DOMAINS,
  domainDisplayName,
  type DocsDomainId,
} from "@/src/content/docs/dataset-catalog";
import { getDatasetDocContent, type Bi } from "@/src/content/docs/dataset-pages";
import { DATASET_GRADE_COLORS, datasetGradeLabel, type DatasetGrade } from "@/src/lib/docs/dataset-grade";

// The full market-coverage table (owner ruling: "一表到底"). Every row is DERIVED — dataset name +
// domain + grade from the catalog SSOT, row_count + date window from the per-dataset CoverageFact that
// was filled from the measured DB manifest (never re-vendored here). A dataset with no measured
// coverage yet shows "—" + an honest status, never a fabricated number (鐵則②). institutional-ownership
// is absent because it is delisted (0 rows, no backing table).

// Datasets whose serving is being repaired (repoint in progress). Their grade is already downgraded off
// "verified" in the catalog; the table additionally flags them so a reader is not misled into treating
// the numbers (where present) as a settled service.
// chip-flows moved to grade "building" (即將開放) — its Building badge conveys the state, so it is no
// longer tagged here to avoid double-labelling. corporate-actions stays reference + serving-repair.
const SERVING_REPAIR = new Set<string>(["corporate-actions"]);

const DOMAIN_ORDER: Record<DocsDomainId, number> = Object.fromEntries(
  DOCS_DOMAINS.map((d, i) => [d.id, i]),
) as Record<DocsDomainId, number>;

const GRADE_RANK: Record<DatasetGrade, number> = { verified: 0, derived: 1, reference: 2, building: 3 };

function bi(value: Bi, en: boolean): string {
  return en ? value.en : value.zh;
}

function GradeBadge({ grade, en }: { grade: DatasetGrade; en: boolean }) {
  const color = DATASET_GRADE_COLORS[grade];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      <span style={{ color }}>{datasetGradeLabel(grade, en ? "en" : "zh-TW")}</span>
    </span>
  );
}

export function CoverageOverviewTable({ locale }: { locale: string }) {
  const en = locale === "en";

  const rows = [...DOCS_DATASET_CATALOG].sort((a, b) => {
    const byDomain = DOMAIN_ORDER[a.domain] - DOMAIN_ORDER[b.domain];
    return byDomain !== 0 ? byDomain : GRADE_RANK[a.grade] - GRADE_RANK[b.grade];
  });

  // Real total, summed from the measured figures only — never estimated for the un-measured ones.
  let totalRows = 0;
  let measured = 0;
  for (const d of rows) {
    const rowsStr = getDatasetDocContent(d.slug)?.coverage?.rows;
    if (rowsStr) {
      totalRows += Number(rowsStr.replace(/,/g, ""));
      measured += 1;
    }
  }

  const pendingLabel: Bi = { zh: "涵蓋量測中（待復驗）", en: "Coverage being measured (re-verifying)" };
  const repairLabel = en ? "serving under repair" : "serving 修復中";

  const domainForId = (id: DocsDomainId) => DOCS_DOMAINS.find((x) => x.id === id)!;

  return (
    <section className="mt-10">
      <p className="mt-3 text-slate-600">
        {en
          ? `${rows.length} datasets in the catalog — ${totalRows.toLocaleString("en-US")} rows across the ${measured} with a measured snapshot. Figures are the real database counts; a dataset still being measured shows "—" rather than an estimate.`
          : `型錄共 ${rows.length} 個資料集——已量測快照的 ${measured} 個合計 ${totalRows.toLocaleString("en-US")} 列。數字為資料庫真實列數;尚在量測的資料集顯示「—」而非估算。`}
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-4 font-semibold">{en ? "Dataset" : "資料集"}</th>
              <th className="py-2 pr-4 font-semibold">{en ? "Category" : "分類"}</th>
              <th className="py-2 pr-4 text-right font-semibold">{en ? "Rows" : "列數"}</th>
              <th className="py-2 pr-4 font-semibold">{en ? "Date range" : "日期範圍"}</th>
              <th className="py-2 font-semibold">{en ? "Grade" : "分級"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const coverage = getDatasetDocContent(d.slug)?.coverage ?? null;
              const repair = SERVING_REPAIR.has(d.slug);
              const rowsCell = coverage?.rows ?? "—";
              const rangeCell = coverage ? bi(coverage.window, en) : bi(pendingLabel, en);
              return (
                <tr key={d.slug} className="border-b border-slate-100 align-top">
                  <td className="py-2 pr-4">
                    <span className="text-slate-800">{en ? d.en : d.zh}</span>
                    {repair ? (
                      <span className="ml-2 whitespace-nowrap rounded border border-amber-500/40 px-1.5 py-0.5 text-xs text-amber-700">
                        {repairLabel}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 pr-4 text-slate-500">{domainDisplayName(domainForId(d.domain), locale)}</td>
                  <td className="py-2 pr-4 text-right tabular-nums text-slate-800">{rowsCell}</td>
                  <td className="py-2 pr-4 text-slate-600">{rangeCell}</td>
                  <td className="py-2">
                    <GradeBadge grade={d.grade} en={en} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {en
          ? "Grade reflects data maturity (official source + coverage), not per-value reconciliation. Rows / date range are a database snapshot; live feeds advance past the snapshot date."
          : "分級反映資料成熟度（官方來源＋涵蓋），非逐值對帳。列數／日期範圍為資料庫快照;即時資料會推進超過快照日期。"}
      </p>
    </section>
  );
}
