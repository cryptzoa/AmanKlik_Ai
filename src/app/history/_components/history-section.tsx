import { TransitionLink as Link } from "@/components/site/transition-link";
import type { InputType, RiskLevel } from "@/types/analysis";

const riskLabels: Record<RiskLevel, string> = {
  LOW: "Risiko rendah",
  MEDIUM: "Risiko sedang",
  HIGH: "Risiko tinggi",
  VERY_HIGH: "Risiko sangat tinggi",
};

const inputLabels: Record<InputType, string> = {
  text: "Pesan",
  image: "Screenshot",
  url: "Tautan",
  conversation: "Percakapan",
};

const historyDateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export type HistoryItem = {
  id: string;
  inputType: InputType;
  riskLevel: RiskLevel;
  previewRedacted: string | null;
  finalScore: number;
  createdAt: Date;
};

export function HistorySection(
  { rows, storageUnavailable }: {
    rows: HistoryItem[];
    storageUnavailable: boolean;
  },
) {
  return (
    <section aria-labelledby="history-list-title">
      <div className="flex flex-col gap-6  border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Terbaru lebih dahulu
          </p>
          <h2
            id="history-list-title"
            className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
          >
            Pemeriksaan terakhir
          </h2>
        </div>
        <Link
          className="product-button product-button--primary w-fit"
          href="/scan"
        >
          Periksa pesan baru
          <span className="ml-3" aria-hidden="true">→</span>
        </Link>
      </div>

      {storageUnavailable ? (
        <div className="product-empty-state" role="status">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-risk">
            Penyimpanan tidak tersedia
          </p>
          <h2>Riwayat belum dapat dibaca</h2>
          <p className="product-empty-state__copy">
            Tempat penyimpanan sedang tidak dapat diakses. Hasil baru mungkin
            belum bisa ditemukan kembali sampai layanan pulih.
          </p>
        </div>
      ) : rows.length > 0 ? (
        <ol
          className="grid gap-3"
          aria-label="Riwayat pemeriksaan, terbaru lebih dahulu"
        >
          {rows.map((row, index) => (
            <li key={row.id} className="overflow-hidden rounded-[18px] border border-line-strong bg-surface">
              <Link
                prefetch={false}
                href={`/result/${row.id}`}
                className="group grid min-h-28 gap-5 p-6 transition-colors hover:bg-ai-soft focus-visible:bg-ai-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai sm:grid-cols-[3rem_9rem_minmax(0,1fr)_7rem] sm:items-center"
              >
                <span className="font-mono text-[11px] font-semibold tabular-nums text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="grid gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                    {inputLabels[row.inputType]}
                  </span>
                  <time
                    className="text-xs leading-5 text-muted"
                    dateTime={row.createdAt.toISOString()}
                  >
                    {historyDateFormatter.format(row.createdAt)} WIB
                  </time>
                </span>

                <span className="min-w-0">
                  <strong className="block text-lg font-semibold tracking-[-0.025em] sm:text-xl">
                    {riskLabels[row.riskLevel]}
                  </strong>
                  <span className="mt-2 block break-words text-sm leading-6 text-muted [overflow-wrap:anywhere]">
                    {row.previewRedacted ?? "Cuplikan teks tidak tersedia."}
                  </span>
                </span>

                <span className="flex items-end justify-between sm:items-center sm:justify-end">
                  <span>
                    <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted sm:text-right">
                      Skor
                    </span>
                    <span className="mt-1 block font-mono text-3xl font-semibold tabular-nums sm:text-right">
                      {row.finalScore}
                    </span>
                  </span>
                  <span
                    className="ml-5 text-lg text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ai"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="product-empty-state">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ai">
            0 hasil
          </p>
          <h2>Belum ada pemeriksaan di sesi ini</h2>
          <p className="product-empty-state__copy">
            Hasil dari browser ini akan muncul setelah pemeriksaan selesai.
            Riwayat ini bukan akun dan tidak mengambil isi kotak masuk pesanmu.
          </p>
          <div className="product-empty-state__action">
            <Link
              className="product-button product-button--primary"
              href="/scan"
            >
              Mulai periksa
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
