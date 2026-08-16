import Link from "next/link";

import { ProductSection } from "@/components/product/primitives";

export function CaseScoreSection({ score }: { score: number }) {
  return (
    <ProductSection width="wide" className="investigation-case-score">
      <div className="investigation-case-score__value">
        <p className="product-eyebrow">Skor tertinggi</p>
        <p aria-label={`${score} dari 100`}>
          <strong>{score}</strong>
          <span>/100</span>
        </p>
      </div>
      <div className="investigation-case-score__explanation">
        <h2>Cara membaca angka ini</h2>
        <p>
          Angka ini mengikuti skor tertinggi dari hasil yang dibandingkan agar
          tanda penting tidak tertutup oleh nilai rata-rata. Gunakan untuk
          menentukan apa yang perlu diperiksa lebih dulu, bukan sebagai kepastian.
        </p>
        <Link className="product-button product-button--secondary" href="/investigate">
          ← Kembali ke semua perbandingan
        </Link>
      </div>
    </ProductSection>
  );
}
