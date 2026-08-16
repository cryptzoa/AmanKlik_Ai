export function SetupSection(
  { appBaseUrl, onCopy }: {
    appBaseUrl: string;
    onCopy: (value: string) => void;
  },
) {
  return (
    <section className="connect-setup" aria-labelledby="connect-setup-heading">
      <div>
        <p className="product-eyebrow text-ai">02 / Pasang ekstensi</p>
        <h2 id="connect-setup-heading" className="connect-section-title">
          Ikuti empat langkah, lalu coba dengan contoh buatan.
        </h2>
        <ol className="connect-setup__steps">
          <li>
            <span>01</span>
            <p>Buka <code>chrome://extensions</code>, lalu aktifkan <i>Developer mode</i> atau mode pengembang.</p>
          </li>
          <li>
            <span>02</span>
            <p>
              Pilih <i>Load unpacked</i>, lalu pilih folder
              <code> extension/</code> dari proyek AmanKlik.
            </p>
          </li>
          <li>
            <span>03</span>
            <p>
              Buka ikon AmanKlik, lalu isi alamat server (Base URL) dan kode
              akses dari langkah pertama.
            </p>
          </li>
          <li>
            <span>04</span>
            <p>
              Blok pesan atau klik kanan tautan, lalu pilih “Periksa dengan
              AmanKlik”.
            </p>
          </li>
        </ol>
      </div>
      <div className="connect-setup__endpoint">
        <p className="product-eyebrow text-white/55">Alamat server (Base URL)</p>
        <code className="mt-3 block break-all text-ai-soft">{appBaseUrl}</code>
        <button
          type="button"
          className="product-button mt-4 border border-white/30 text-surface"
          onClick={() => onCopy(appBaseUrl)}
        >
          Salin alamat server
        </button>
        <div className="connect-setup__permission">
          Ekstensi meminta izin untuk membaca tab yang sedang aktif, menampilkan
          menu klik kanan, membuka panel samping, dan menyimpan pengaturan.
          Bahan hanya dikirim saat kamu memilih tindakan AmanKlik. Kode akses
          disimpan di browser sampai kamu mengganti atau menghapusnya.
        </div>
      </div>
    </section>
  );
}
