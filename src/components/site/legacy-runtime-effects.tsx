"use client";

import { ButtonMotion } from "@/components/ui/animated-button";
import { Preloader } from "@/components/site/preloader";

export function LegacyRuntimeEffects() {
  return (
    <>
      <Preloader />
      <ButtonMotion />
    </>
  );
}
