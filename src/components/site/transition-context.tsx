"use client";

import { createContext, useCallback, useContext, useRef, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TransitionContextType {
  navigate: (href: string) => void;
  registerAnimateOut: (fn: (href: string) => Promise<void>) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const animateOutRef = useRef<((href: string) => Promise<void>) | null>(null);
  const isAnimatingRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const registerAnimateOut = useCallback((fn: (href: string) => Promise<void>) => {
    animateOutRef.current = fn;
  }, []);

  const navigate = useCallback((href: string) => {
    if (isAnimatingRef.current) return;
    setIsTransitioning(true);

    if (!animateOutRef.current) {
      router.push(href);
      return;
    }

    isAnimatingRef.current = true;
    void (async () => {
      try {
        await Promise.race([
          animateOutRef.current?.(href),
          new Promise<void>((resolve) => window.setTimeout(resolve, 1_000)),
        ]);
        router.push(href);
      } finally {
        window.setTimeout(() => {
          isAnimatingRef.current = false;
        }, 500);
      }
    })();
  }, [router]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [pathname, isTransitioning]);

  return (
    <TransitionContext.Provider value={{ navigate, registerAnimateOut, isTransitioning }}>
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
