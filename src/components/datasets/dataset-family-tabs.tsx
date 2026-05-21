"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { cn } from "@/src/lib/cn";

type DatasetItem = {
  name: string;
  description: string;
  href: string;
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
  const defaultFamilyId = families[0]?.id ?? "";
  const [activeFamilyId, setActiveFamilyId] = useState(defaultFamilyId);

  const activeFamily = useMemo(() => {
    return families.find((family) => family.id === activeFamilyId) ?? families[0];
  }, [activeFamilyId, families]);

  if (!activeFamily) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">資料集目錄</h2>

      <div
        className="mt-5 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="資料集家族"
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
                "shrink-0 rounded-t-xl border border-slate-200 px-4 py-2 text-sm font-medium transition duration-200 ease-out",
                "motion-reduce:transition-none",
                isActive
                  ? "-mb-px bg-white text-slate-950"
                  : "bg-slate-50 text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {family.label}
            </button>
          );
        })}
      </div>

      <div
        id={`dataset-panel-${activeFamily.id}`}
        role="tabpanel"
        aria-labelledby={`dataset-tab-${activeFamily.id}`}
        className="rounded-b-2xl rounded-tr-2xl border border-slate-200 border-t-slate-200 bg-white p-5 sm:p-6"
      >
        <h3 className="text-lg font-semibold text-slate-950">{activeFamily.label}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{activeFamily.description}</p>

        <div className="mt-5 divide-y divide-slate-200">
          {activeFamily.datasets.map((dataset, index) => (
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
                <Link
                  href={dataset.href}
                  className="inline-block text-xs font-medium text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline"
                >
                  查看文件
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
