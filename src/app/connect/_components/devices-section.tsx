import type { TokenItem } from "@/app/connect/_components/types";

type Props = {
  items: TokenItem[];
  listState: "loading" | "loaded" | "unavailable";
  revokePendingId: string | null;
  onRetry: () => void;
  onRevoke: (id: string, name: string) => void;
};

export function DevicesSection({
  items,
  listState,
  revokePendingId,
  onRetry,
  onRevoke,
}: Props) {
  return (
    <section aria-labelledby="connected-devices-heading">
      <p className="product-eyebrow text-ai">03 / Akses aktif</p>
      <div className="connect-devices-heading">
        <h2 id="connected-devices-heading" className="connect-section-title">
          Perangkat yang masih terhubung.
        </h2>
        <p>
          Kode akses yang kedaluwarsa atau sudah dicabut tidak dapat dipakai
          lagi.
        </p>
      </div>

      <div className="connect-device-list">
        {listState === "loading" ? (
          <div className="connect-device-state" role="status">
            Memuat daftar akses…
          </div>
        ) : listState === "unavailable" ? (
          <div className="connect-device-state" role="status">
            <p>Daftar akses belum dapat dimuat.</p>
            <button
              type="button"
              className="product-button product-button--secondary mt-4"
              onClick={onRetry}
            >
              Coba lagi
            </button>
          </div>
        ) : items.length ? (
          items.map((item) => (
            <article key={item.id} className="connect-device-row">
              <div className="min-w-0">
                <h3>{item.name}</h3>
                <dl>
                  <div>
                    <dt>Dibuat</dt>
                    <dd>
                      <time dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleString("id-ID")}
                      </time>
                    </dd>
                  </div>
                  <div>
                    <dt>Terakhir dipakai</dt>
                    <dd>
                      {item.lastUsedAt ? (
                        <time dateTime={item.lastUsedAt}>
                          {new Date(item.lastUsedAt).toLocaleString("id-ID")}
                        </time>
                      ) : (
                        "Belum pernah"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Kedaluwarsa</dt>
                    <dd>
                      <time dateTime={item.expiresAt}>
                        {new Date(item.expiresAt).toLocaleString("id-ID")}
                      </time>
                    </dd>
                  </div>
                </dl>
              </div>
              <button
                type="button"
                className="product-button product-button--destructive"
                disabled={Boolean(revokePendingId)}
                onClick={() => onRevoke(item.id, item.name)}
              >
                {revokePendingId === item.id
                  ? "Mencabut…"
                  : `Cabut akses ${item.name}`}
              </button>
            </article>
          ))
        ) : (
          <div className="connect-device-state">
            <p>Belum ada perangkat yang terhubung.</p>
            <span>Buat kode akses di langkah pertama untuk memulai.</span>
          </div>
        )}
      </div>
    </section>
  );
}
