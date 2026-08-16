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
      description="Alamatnya mungkin salah, hasilnya sudah kedaluwarsa, atau hasil ini berasal dari browser lain. Kamu dapat langsung memulai pemeriksaan baru."
      primaryAction={(
        <Link className={systemStateStyles.actionPrimary} href="/scan">
          Mulai periksa
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
