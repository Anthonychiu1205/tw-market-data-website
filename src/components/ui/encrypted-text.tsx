"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/src/lib/cn";

type EncryptedTextProps = {
  text: string;
  className?: string;
  revealMs?: number;
  scrambleChars?: string;
  startSignal: number;
};

const DEFAULT_SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789台股資料市場流程分析";

export function EncryptedText({
  text,
  className,
  revealMs = 720,
  scrambleChars = DEFAULT_SCRAMBLE,
  startSignal,
}: EncryptedTextProps) {
  const [display, setDisplay] = useState(text);

  const sourceChars = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    if (!text) return;

    const totalSteps = Math.max(8, Math.floor(revealMs / 42));
    let step = 0;

    const timer = window.setInterval(() => {
      step += 1;
      const revealCount = Math.floor((step / totalSteps) * sourceChars.length);

      const next = sourceChars
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealCount) return char;
          const r = Math.floor(Math.random() * scrambleChars.length);
          return scrambleChars[r] ?? "*";
        })
        .join("");

      setDisplay(next);

      if (step >= totalSteps) {
        window.clearInterval(timer);
        setDisplay(text);
      }
    }, 42);

    return () => {
      window.clearInterval(timer);
    };
  }, [text, sourceChars, revealMs, scrambleChars, startSignal]);

  return <span className={cn("block", className)}>{text ? display : ""}</span>;
}
