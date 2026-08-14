"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { PreloaderProvider } from "@/components/site/preloader-context";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { TransitionProvider } from "@/components/site/transition-context";
import { TransitionOverlay } from "@/components/site/transition-overlay";

const LegacyRuntimeEffects = dynamic(() =>
  import("@/components/site/legacy-runtime-effects").then((module) =>
    module.LegacyRuntimeEffects
  )
);

function TransitionRuntime({
  children,
  usesSmoothScroll,
}: {
  children: React.ReactNode;
  usesSmoothScroll: boolean;
}) {
  return (
    <TransitionProvider>
      <TransitionOverlay />
      {usesSmoothScroll ? <SmoothScroll /> : null}
      {children}
    </TransitionProvider>
  );
}

export function SiteRuntime({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const usesLegacyEffects = pathname === "/" || pathname.startsWith("/promo");
  const usesSmoothScroll = !pathname.startsWith("/promo");

  return (
    <TransitionRuntime usesSmoothScroll={usesSmoothScroll}>
      {usesLegacyEffects ? (
        <PreloaderProvider>
          <LegacyRuntimeEffects />
          {children}
        </PreloaderProvider>
      ) : children}
    </TransitionRuntime>
  );
}
