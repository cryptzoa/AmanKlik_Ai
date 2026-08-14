import type { Metadata } from "next";
import { ConnectClient } from "@/app/connect/_components/connect-client";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Hubungkan extension — AmanKlik AI",
  description:
    "Buat token terbatas untuk extension AmanKlik dan cabut akses perangkat dari sesi anonim ini.",
  robots: { index: false, follow: false },
};

export default function ConnectPage() {
  return (
    <PageFrame>
      <RouteIntro
        eyebrow="10 / Hubungkan"
        title="AmanKlik di tempat pesan datang, dengan akses yang bisa kamu putus."
        description="Hubungkan extension AmanKlik dengan token terbatas yang ditampilkan sekali, disimpan dalam bentuk fingerprint di server, dan dapat dicabut dari sesi penerbitnya."
        annotation="Token bukan kunci Gemini · satu nama untuk tiap akses · jangan kirim melalui chat"
        pattern="task"
      >
        Halaman ini tidak muncul di navigasi publik selama extension masih
        didistribusikan melalui mode developer.
      </RouteIntro>
      <div className="product-section">
        <div className="product-task-canvas">
          <ConnectClient appBaseUrl={env.APP_BASE_URL.replace(/\/$/, "")} />
        </div>
      </div>
    </PageFrame>
  );
}
