"use client";

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from "react";
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

  const registerAnimateOut = (fn: (href: string) => Promise<void>) => {
    animateOutRef.current = fn;
  };

  const navigate = async (href: string) => {
    if (isAnimatingRef.current) return;
    setIsTransitioning(true);

    if (!animateOutRef.current) {
      router.push(href);
      return;
    }

    isAnimatingRef.current = true;
    try {
      await animateOutRef.current(href);
      router.push(href);
    } finally {
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 500);
    }
  };

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
