import { TransitionLink } from "@/components/site/transition-link";
import type { ScanItem } from "@/app/investigate/_components/types";

type Props = {
  scans: ScanItem[];
  selected: string[];
  title: string;
  loading: boolean;
  error: string | null;
  onTitleChange: (title: string) => void;
  onToggle: (id: string) => void;
  onCreate: () => void;
};

const inputLabels: Record<ScanItem["inputType"], string> = {
  text: "Pesan",
  image: "Screenshot",
  url: "Tautan",
  conversation: "Percakapan",
};

const riskLabels: Record<ScanItem["riskLevel"], string> = {
  LOW: "Risiko rendah",
  MEDIUM: "Risiko sedang",
  HIGH: "Risiko tinggi",
  VERY_HIGH: "Risiko sangat tinggi",
};

export function ComparisonBuilderSection({
  scans,
  selected,
  title,
  loading,
  error,
  onTitleChange,
  onToggle,
  onCreate,
}: Props) {
  const selectedScans = scans.filter((scan) => selected.includes(scan.id));
  const titleLength = title.trim().length;
  const canCreate = selected.length >= 2 && titleLength >= 3 && !loading;
  const disabledReason = loading
    ? "Kasus sedang dibuat."
    : titleLength < 3
    ? "Beri nama kasus minimal 3 karakter."
    : selected.length < 2
    ? `Pilih ${2 - selected.length} hasil berbeda lagi.`
    : selected.length >= 8
    ? "Batas 8 hasil sudah tercapai."
    : "Kasus siap dibuat.";

  return (
    <section className="investigation-builder" aria-labelledby="case-builder-heading">
      <div className="investigation-builder__intro">
        <p className="product-eyebrow text-ai">01 / Susun bukti</p>
        <h2 id="case-builder-heading">Pilih hasil pemeriksaan yang berbeda.</h2>
        <p>
          Pemeriksaan berulang atas isi yang sama hanya dihitung sekali agar
          perbandingannya tidak menyesatkan.
        </p>
      </div>

      <form
        className="investigation-builder__workspace"
        onSubmit={(event) => {
          event.preventDefault();
          if (canCreate) onCreate();
        }}
      >
        <div>
          <label className="product-field-label" htmlFor="case-title">
            Nama kasus
          </label>
          <input
            id="case-title"
            className="product-field mt-3"
            value={title}
            minLength={3}
            maxLength={80}
            autoComplete="off"
            aria-invalid={title.length > 0 && titleLength < 3}
            aria-describedby="case-title-help case-title-error"
            placeholder="Contoh: Pesan kurir dan tautan pembayaran"
            onChange={(event) => onTitleChange(event.target.value)}
          />
          <p id="case-title-help" className="product-field-help">
            Nama ini disimpan bersama kasus. Jangan gunakan identitas atau data
            sensitif.
          </p>
          <p id="case-title-error" className="product-field-error">
            {title.length > 0 && titleLength < 3
              ? "Nama kasus minimal 3 karakter."
              : "\u00a0"}
          </p>
          <span className="product-character-count">
            {title.length} / 80
          </span>
        </div>

        <div className="investigation-selection-rail" aria-label="Hasil terpilih">
          <div>
            <p className="product-eyebrow">Pilihan aktif</p>
            <strong>{selected.length} / 8 hasil</strong>
          </div>
          <div className="investigation-selection-rail__items">
            {selectedScans.length ? (
              selectedScans.map((scan) => (
                <span key={scan.id}>
                  {inputLabels[scan.inputType]} · {scan.finalScore}/100
                </span>
              ))
            ) : (
              <span>Belum ada hasil yang dipilih.</span>
            )}
          </div>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {selected.length} dari 8 hasil dipilih. {disabledReason}
        </p>

        <div className="investigation-artifact-list">
          {scans.length ? (
            scans.map((scan) => {
              const active = selected.includes(scan.id);
              return (
                <button
                  key={scan.id}
                  type="button"
                  aria-pressed={active}
                  className="investigation-artifact-row"
                  data-selected={active ? "true" : "false"}
                  onClick={() => onToggle(scan.id)}
                >
                  <span className="investigation-artifact-row__mark" aria-hidden="true">
                    {active ? "✓" : "+"}
                  </span>
                  <span className="min-w-0">
                    <span className="investigation-artifact-row__meta">
                      {inputLabels[scan.inputType]} · {riskLabels[scan.riskLevel]}
                    </span>
                    <span className="investigation-artifact-row__preview">
                      {scan.preview ?? "Cuplikan teks tidak tersedia"}
                    </span>
                    <time dateTime={scan.createdAt}>
                      {new Date(scan.createdAt).toLocaleString("id-ID")}
                    </time>
                  </span>
                  <strong>{scan.finalScore}<small>/100</small></strong>
                  <span className="sr-only">
                    {active ? "Dipilih" : "Belum dipilih"}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="investigation-artifact-empty">
              <h3>Belum ada hasil yang bisa dibandingkan.</h3>
              <p>
                Lakukan sedikitnya dua pemeriksaan dengan isi yang berbeda
                sebelum membuat perbandingan.
              </p>
            </div>
          )}
        </div>

        <div className="investigation-builder__actions">
          <button
            type="submit"
            disabled={!canCreate}
            className="product-button product-button--primary"
          >
            {loading ? "Menyiapkan perbandingan…" : `Bandingkan ${selected.length} hasil`}
          </button>
          <TransitionLink
            className="product-button product-button--secondary"
            href="/scan"
          >
            Tambah pemeriksaan
          </TransitionLink>
          <p>{disabledReason}</p>
        </div>

        {error ? (
          <p className="mt-4 rounded-[16px] border-l-4 border-risk bg-risk-soft p-4 text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
