"use client";

import { useEffect, useState } from "react";

import { EncryptedText } from "@/src/components/ui/encrypted-text";

export type LoginHeadlinePhrase = {
  primaryLine: string;
  secondaryLine: string;
};

type EncryptedTextRotatorProps = {
  phrases: LoginHeadlinePhrase[];
  className?: string;
  holdMs?: number;
};

export function EncryptedTextRotator({ phrases, className, holdMs = 2300 }: EncryptedTextRotatorProps) {
  const [index, setIndex] = useState(0);
  const [signal, setSignal] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
      setSignal((prev) => prev + 1);
    }, holdMs);

    return () => window.clearInterval(timer);
  }, [phrases.length, holdMs]);

  const current = phrases[index] ?? { primaryLine: "", secondaryLine: "" };

  return (
    <div className={className}>
      <EncryptedText
        text={current.primaryLine}
        startSignal={signal}
        revealMs={760}
        className="text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl"
      />
      <EncryptedText
        text={current.secondaryLine}
        startSignal={signal}
        revealMs={820}
        className="mt-1 text-balance text-3xl font-medium tracking-tight text-slate-600 md:text-4xl"
      />
    </div>
  );
}
