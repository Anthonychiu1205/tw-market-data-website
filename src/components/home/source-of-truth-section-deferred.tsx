"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { MarketingContainer } from "@/src/components/ui/marketing-container";

const SourceOfTruthSection = dynamic(
  () => import("./source-of-truth-section").then((module) => module.SourceOfTruthSection),
  { ssr: false },
);

function SourceOfTruthSectionSkeleton() {
  return (
    <section className="bg-white py-10">
      <MarketingContainer className="space-y-7">
        <div className="space-y-3">
          <div className="h-9 w-64 animate-pulse rounded-md bg-slate-200" />
          <div className="h-6 w-full max-w-3xl animate-pulse rounded-md bg-slate-100" />
        </div>
        <div className="h-[520px] animate-pulse rounded-md border border-slate-200 bg-slate-50" />
      </MarketingContainer>
    </section>
  );
}

export function SourceOfTruthSectionDeferred() {
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
        rootMargin: "280px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return <div ref={hostRef}>{shouldLoad ? <SourceOfTruthSection /> : <SourceOfTruthSectionSkeleton />}</div>;
}
