import Link from "next/link";

import {
  SystemState,
  systemStateStyles,
} from "@/app/_components/system-state";

export default function NotFound() {
  return (
    <SystemState
      code="404"
      eyebrow="Halaman tidak ditemukan"
      title="Jalurnya berhenti di sini."
      description="Alamatnya mungkin tidak valid, hasilnya sudah kedaluwarsa, atau resource ini tidak tersedia untuk sesi browsermu. Kamu dapat langsung memulai pemeriksaan baru."
      primaryAction={(
        <Link className={systemStateStyles.actionPrimary} href="/scan">
          Buka scanner
        </Link>
      )}
      secondaryAction={(
        <Link className={systemStateStyles.actionSecondary} href="/">
          Kembali ke beranda
        </Link>
      )}
    />
  );
}
