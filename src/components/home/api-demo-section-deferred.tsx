"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { MarketingContainer } from "@/src/components/ui/marketing-container";
import type { ApiDemoRealData } from "@/src/lib/homepage/demo-real-data-types";

const ApiDemoSection = dynamic(
  () => import("./api-demo-section").then((module) => module.ApiDemoSection),
  { ssr: false },
);

function ApiDemoSectionSkeleton() {
  return (
    <section className="bg-white py-24">
      <MarketingContainer>
        <div className="mb-12 space-y-3">
          <div className="h-9 w-72 animate-pulse rounded-md bg-slate-200" />
          <div className="h-7 w-full max-w-[900px] animate-pulse rounded-md bg-slate-100" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-[460px] animate-pulse rounded-[2rem] border border-slate-200/60 bg-slate-50/80" />
          <div className="h-[460px] animate-pulse rounded-[2rem] border border-slate-200/60 bg-slate-50/80" />
        </div>
      </MarketingContainer>
    </section>
  );
}

export function ApiDemoSectionDeferred({ data }: { data?: ApiDemoRealData }) {
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
        rootMargin: "320px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return <div ref={hostRef}>{shouldLoad ? <ApiDemoSection data={data} /> : <ApiDemoSectionSkeleton />}</div>;
}
