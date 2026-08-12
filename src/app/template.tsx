"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo(containerRef.current, {
      opacity: 0,
      y: 16
    }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      clearProps: "all"
    });
  }, { dependencies: [pathname], scope: containerRef });

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}
