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
        annotation="Data privat tetap diperiksa terhadap sesi browser aktif."
        pattern="analysis"
      />
      <ProductSection width="wide">
        <StatusBand tone="loading" role="status">
          <strong>Memuat data sesi…</strong>
          <p>Konten akan muncul di area ini tanpa menampilkan record sesi lain.</p>
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
