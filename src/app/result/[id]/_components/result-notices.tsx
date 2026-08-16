import { StatusBand } from "@/components/product/primitives";

export function ResultNotices({
  aiAvailable,
  intelligenceMatchCount,
}: {
  aiAvailable: boolean;
  intelligenceMatchCount: number;
}) {
  if (aiAvailable && intelligenceMatchCount < 3) return null;

  return (
    <div className="result-notices">
      {!aiAvailable ? (
        <StatusBand tone="warning" role="status">
          <strong>Analisis AI sedang terbatas.</strong>{" "}
          AmanKlik tetap memeriksa pola pesan dan susunan tautan dengan aturan
          keamanan. Hasil ini tidak berarti isinya sudah dipastikan aman.
        </StatusBand>
      ) : null}
      {intelligenceMatchCount >= 3 ? (
        <StatusBand tone="info" role="status">
          <strong>Isi yang sama pernah diperiksa.</strong> Isi ini muncul pada
          {" "}{intelligenceMatchCount} sesi browser berbeda di antara hasil yang
          masih tersimpan. Ini menambah konteks, tetapi belum membuktikan bahwa
          pengirim atau isinya berbahaya.
        </StatusBand>
      ) : null}
    </div>
  );
}
