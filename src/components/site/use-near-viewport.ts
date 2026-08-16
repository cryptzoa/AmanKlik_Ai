"use client";

import { useEffect, useState, type RefObject } from "react";

export function useNearViewport<T extends Element>(
  targetRef: RefObject<T | null>,
  rootMargin = "60% 0px",
) {
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    if (isNearViewport) return;

    const target = targetRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isNearViewport, rootMargin, targetRef]);

  return isNearViewport;
}
