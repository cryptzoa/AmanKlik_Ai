import Link from "next/link";

import { ProductSection } from "@/components/product/primitives";

export function CaseScoreSection({ score }: { score: number }) {
  return (
    <ProductSection width="wide" className="investigation-case-score">
      <div className="investigation-case-score__value">
        <p className="product-eyebrow">Skor kasus</p>
        <p aria-label={`${score} dari 100`}>
          <strong>{score}</strong>
          <span>/100</span>
        </p>
      </div>
      <div className="investigation-case-score__explanation">
        <h2>Cara membaca angka ini</h2>
        <p>
          Skor kasus mengikuti risiko tertinggi di antara artefak agar indikator
          penting tidak tertutup oleh rata-rata. Angka ini membantu prioritas
          verifikasi—bukan probabilitas atau kepastian penipuan.
        </p>
        <Link className="product-button product-button--secondary" href="/investigate">
          ← Kembali ke semua kasus
        </Link>
      </div>
    </ProductSection>
  );
}
