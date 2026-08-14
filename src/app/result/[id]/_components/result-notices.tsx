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
          AmanKlik tetap menjalankan pemeriksaan pola dan struktur secara
          deterministik. Hasil ini tidak berarti konten sudah dipastikan aman.
        </StatusBand>
      ) : null}
      {intelligenceMatchCount >= 3 ? (
        <StatusBand tone="info" role="status">
          <strong>Sinyal lintas sesi.</strong> Fingerprint input yang sama muncul
          pada {intelligenceMatchCount} sesi anonim berbeda di antara hasil yang
          masih tersimpan, dalam jendela hingga 30 hari. Ini menambah konteks,
          tetapi tidak membuktikan pengirim atau konten pasti berbahaya.
        </StatusBand>
      ) : null}
    </div>
  );
}
