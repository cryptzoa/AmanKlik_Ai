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
    ? `Pilih ${2 - selected.length} artefak unik lagi.`
    : selected.length >= 8
    ? "Batas 8 artefak sudah tercapai."
    : "Kasus siap dibuat.";

  return (
    <section className="investigation-builder" aria-labelledby="case-builder-heading">
      <div className="investigation-builder__intro">
        <p className="product-eyebrow text-ai">01 / Susun bukti</p>
        <h2 id="case-builder-heading">Pilih artefak yang memang berbeda.</h2>
        <p>
          Pemeriksaan ulang atas input yang sama sudah disaring di server dan
          tidak dihitung sebagai bukti tambahan.
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

        <div className="investigation-selection-rail" aria-label="Artefak terpilih">
          <div>
            <p className="product-eyebrow">Pilihan aktif</p>
            <strong>{selected.length} / 8 artefak</strong>
          </div>
          <div className="investigation-selection-rail__items">
            {selectedScans.length ? (
              selectedScans.map((scan) => (
                <span key={scan.id}>
                  {inputLabels[scan.inputType]} · {scan.finalScore}/100
                </span>
              ))
            ) : (
              <span>Belum ada artefak dipilih.</span>
            )}
          </div>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {selected.length} dari 8 artefak dipilih. {disabledReason}
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
                      {inputLabels[scan.inputType]} · {scan.riskLevel.replace("_", " ")}
                    </span>
                    <span className="investigation-artifact-row__preview">
                      {scan.preview ?? "Tanpa preview teks"}
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
              <h3>Belum ada artefak dalam sesi ini.</h3>
              <p>
                Lakukan sedikitnya dua pemeriksaan dengan input berbeda sebelum
                membuat kasus.
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
            {loading ? "Menyusun kasus…" : `Buat kasus dari ${selected.length} artefak`}
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
