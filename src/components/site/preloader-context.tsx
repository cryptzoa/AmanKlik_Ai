"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PreloaderContextType {
  isLoaded: boolean;
  setIsLoaded: (value: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextType | null>(null);

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(() => pathname !== "/");

  return (
    <PreloaderContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
}
