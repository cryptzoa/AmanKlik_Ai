"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import {
  SystemState,
  systemStateStyles,
} from "@/app/_components/system-state";

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <SystemState
      code="500"
      eyebrow="Pemulihan halaman"
      title="Halaman belum dapat ditampilkan."
      description="Proses berhenti sebelum halaman selesai dimuat. Coba lagi; bila kendala berulang, kembali ke scanner untuk memulai alur baru."
      headingRef={headingRef}
      primaryAction={(
        <button
          className={systemStateStyles.actionButton}
          onClick={retry}
          type="button"
        >
          Coba lagi
        </button>
      )}
      secondaryAction={(
        <Link className={systemStateStyles.actionSecondary} href="/scan">
          Buka scanner
        </Link>
      )}
    />
  );
}
