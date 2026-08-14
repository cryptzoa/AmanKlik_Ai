import Link from "next/link";
import { ScanClient } from "@/app/scan/_components/scan-client";
import {
  ProductSection,
  SectionHeading,
} from "@/components/product/primitives";

export function ScanSection({ initialError }: { initialError: string | null }) {
  return (
    <ProductSection width="task" className="pt-12 sm:pt-16 lg:pt-20">
      <SectionHeading
        eyebrow="Meja pemeriksaan"
        title="Mulai dari bentuk buktinya."
        description="Pilih satu jenis input. Penjelasan format dan batas pemeriksaan mengikuti pilihanmu tanpa mengubah tujuan analisis."
      />
      <ScanClient initialError={initialError} />
      <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Tekanan dan permintaannya muncul dalam beberapa tahap?
        </p>
        <Link
          className="inline-flex min-h-11 items-center text-sm font-semibold text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai"
          href="/scan/conversation"
        >
          Periksa percakapan berurutan →
        </Link>
      </div>
    </ProductSection>
  );
}
