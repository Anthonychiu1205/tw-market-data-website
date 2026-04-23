"use client";

import { useEffect, useRef, useState } from "react";

type UseReplayOnVisibleOptions = {
  threshold?: number;
  rootMargin?: string;
};

export function useReplayOnVisible<T extends HTMLElement>({
  threshold = 0.35,
  rootMargin = "0px 0px -10% 0px",
}: UseReplayOnVisibleOptions = {}) {
  const elementRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return { elementRef, isVisible };
}

