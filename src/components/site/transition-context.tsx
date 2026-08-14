"use client";

import { createContext, useCallback, useContext, useRef, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type TransitionAnimator = {
  cover: () => Promise<void>;
  reveal: () => Promise<void>;
};

interface TransitionContextType {
  navigate: (href: string) => void;
  registerAnimator: (animator: TransitionAnimator | null) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const animatorRef = useRef<TransitionAnimator | null>(null);
  const isAnimatingRef = useRef(false);
  const [transitionOrigin, setTransitionOrigin] = useState<string | null>(null);
  const isTransitioning = transitionOrigin === routeKey;

  const registerAnimator = useCallback((animator: TransitionAnimator | null) => {
    animatorRef.current = animator;
  }, []);

  const navigate = useCallback((href: string) => {
    if (isAnimatingRef.current) return;
    router.prefetch(href);
    setTransitionOrigin(routeKey);
    isAnimatingRef.current = true;

    if (!animatorRef.current) {
      router.push(href);
      return;
    }

    void (async () => {
      try {
        await animatorRef.current?.cover();
      } catch {}
      router.push(href);
    })();
  }, [routeKey, router]);

  useEffect(() => {
    if (!transitionOrigin || transitionOrigin === routeKey) return;
    let cancelled = false;
    const reveal = animatorRef.current?.reveal() ?? Promise.resolve();

    void reveal.finally(() => {
      if (cancelled) return;
      setTransitionOrigin(null);
      isAnimatingRef.current = false;
    });

    return () => {
      cancelled = true;
    };
  }, [routeKey, transitionOrigin]);

  useEffect(() => {
    if (!isTransitioning) return;
    const timer = window.setTimeout(() => {
      const reveal = animatorRef.current?.reveal() ?? Promise.resolve();
      void reveal.finally(() => {
        setTransitionOrigin(null);
        isAnimatingRef.current = false;
      });
    }, 2_000);
    return () => window.clearTimeout(timer);
  }, [isTransitioning]);

  return (
    <TransitionContext.Provider value={{ navigate, registerAnimator, isTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
