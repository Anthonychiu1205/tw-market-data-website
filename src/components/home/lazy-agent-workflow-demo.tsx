"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { AgentWorkflowDemoConfig } from "./agent-workflow-demo";

const AgentWorkflowDemo = dynamic(
  () => import("./agent-workflow-demo").then((module) => module.AgentWorkflowDemo),
  { ssr: false },
);

function WorkflowDemoSkeleton() {
  return (
    <div className="w-full rounded-[24px] border border-slate-200 bg-slate-50/60 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] lg:p-4">
      <div className="h-[448px] animate-pulse rounded-xl border border-slate-300 bg-white/80" />
    </div>
  );
}

type LazyAgentWorkflowDemoProps = {
  config?: AgentWorkflowDemoConfig;
};

export function LazyAgentWorkflowDemo({ config }: LazyAgentWorkflowDemoProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "220px 0px",
        threshold: 0.05,
      },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return <div ref={hostRef}>{shouldLoad ? <AgentWorkflowDemo config={config} /> : <WorkflowDemoSkeleton />}</div>;
}
