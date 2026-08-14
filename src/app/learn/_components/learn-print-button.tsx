"use client";

export function LearnPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="product-button product-button--secondary product-print-hidden min-h-11"
    >
      <span className="relative z-[1]">Cetak</span>
    </button>
  );
}
