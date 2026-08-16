import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { ProductSection, StatusBand } from "@/components/product/primitives";

export function ProductLoadingPage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <PageFrame>
      <RouteIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        annotation="Data hanya ditampilkan jika berasal dari sesi browser ini."
        pattern="analysis"
      />
      <ProductSection width="wide">
        <StatusBand tone="loading" role="status">
          <strong>Memuat data sesi…</strong>
          <p>Konten akan muncul di sini tanpa menampilkan data dari sesi lain.</p>
        </StatusBand>
        <div className="product-loading-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </ProductSection>
    </PageFrame>
  );
}
