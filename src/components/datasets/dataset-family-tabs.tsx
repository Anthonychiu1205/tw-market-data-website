"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Link } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";

type DatasetItem = {
  name: string;
  description: string;
  href: string;
  overviewHref?: string;
  note?: string;
};

type DatasetFamily = {
  id: string;
  label: string;
  description: string;
  datasets: readonly DatasetItem[];
};

type DatasetFamilyTabsProps = {
  families: readonly DatasetFamily[];
};

export function DatasetFamilyTabs({ families }: DatasetFamilyTabsProps) {
  const t = useTranslations("datasets");
  const defaultFamilyId = families[0]?.id ?? "";
  const [activeFamilyId, setActiveFamilyId] = useState(defaultFamilyId);

  const activeFamily = useMemo(() => {
    return families.find((family) => family.id === activeFamilyId) ?? families[0];
  }, [activeFamilyId, families]);

  if (!activeFamily) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{t("catalogTitle")}</h2>

      <div
        className="mt-5 flex items-end gap-1 overflow-x-auto overflow-y-hidden pb-0"
        role="tablist"
        aria-label={t("familyTablistLabel")}
      >
        {families.map((family) => {
          const isActive = family.id === activeFamily.id;

          return (
            <button
              key={family.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`dataset-panel-${family.id}`}
              id={`dataset-tab-${family.id}`}
              onClick={() => setActiveFamilyId(family.id)}
              className={cn(
                "relative shrink-0 rounded-t-xl border px-4 py-2 text-sm font-medium transition duration-200 ease-out",
                "motion-reduce:transition-none",
                isActive
                  ? "z-10 -mb-px border-slate-200 border-b-white bg-white text-slate-950"
                  : "z-0 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {family.label}
            </button>
          );
        })}
      </div>

      {/* Every family's panel is rendered into the DOM; inactive ones are hidden with the `hidden`
          attribute rather than conditionally unmounted. Previously only the ACTIVE family was
          rendered, so the text layer (crawlers, AI answer engines, "view source") saw just the first
          family — which is why the catalog looked like it held ~3 datasets while /pricing claimed
          "全部資料集". Visual behaviour is unchanged: still one visible tab at a time. */}
      {families.map((family) => {
        const isActive = family.id === activeFamily.id;

        return (
          <div
            key={family.id}
            id={`dataset-panel-${family.id}`}
            role="tabpanel"
            aria-labelledby={`dataset-tab-${family.id}`}
            hidden={!isActive}
            className="-mt-px rounded-b-2xl rounded-tr-2xl border border-slate-200 bg-white p-5 sm:p-6"
          >
            <h3 className="text-lg font-semibold text-slate-950">{family.label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{family.description}</p>

            <div className="mt-5 divide-y divide-slate-200">
              {family.datasets.map((dataset, index) => (
                <article
                  key={dataset.name}
                  className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  style={{
                    opacity: 1,
                    transform: "translateY(0)",
                    transition: "opacity 200ms ease-out, transform 200ms ease-out",
                    transitionDelay: `${Math.min(index * 24, 140)}ms`,
                  }}
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 sm:text-base">{dataset.name}</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{dataset.description}</p>
                    {dataset.note ? <p className="mt-1 text-xs text-slate-500">{dataset.note}</p> : null}
                  </div>
                  <div className="sm:pl-6">
                    <div className="flex items-center gap-3">
                      {dataset.overviewHref ? (
                        <Link
                          href={dataset.overviewHref}
                          className="inline-block text-xs font-medium text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline"
                        >
                          {t("datasetOverview")}
                        </Link>
                      ) : null}
                      <Link
                        href={dataset.href}
                        className="inline-block text-xs font-medium text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline"
                      >
                        {t("apiDocs")}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
