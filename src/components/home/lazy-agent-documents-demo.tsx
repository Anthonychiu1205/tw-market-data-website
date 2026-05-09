"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const AgentDocumentsDemo = dynamic(
  () => import("./agent-documents-demo").then((module) => module.AgentDocumentsDemo),
  { ssr: false },
);

function DocumentsDemoSkeleton() {
  return (
    <div className="w-full rounded-[24px] border border-slate-200 bg-slate-50/60 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] lg:p-4">
      <div className="h-[448px] animate-pulse rounded-xl border border-slate-300 bg-white/80" />
    </div>
  );
}

export function LazyAgentDocumentsDemo() {
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

  return <div ref={hostRef}>{shouldLoad ? <AgentDocumentsDemo /> : <DocumentsDemoSkeleton />}</div>;
}
