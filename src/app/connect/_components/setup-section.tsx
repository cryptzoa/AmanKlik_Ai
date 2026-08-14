export function SetupSection(
  { appBaseUrl, onCopy }: {
    appBaseUrl: string;
    onCopy: (value: string) => void;
  },
) {
  return (
    <section className="connect-setup" aria-labelledby="connect-setup-heading">
      <div>
        <p className="product-eyebrow text-ai">02 / Siapkan side panel</p>
        <h2 id="connect-setup-heading" className="connect-section-title">
          Empat langkah, lalu uji dengan konten sintetis.
        </h2>
        <ol className="connect-setup__steps">
          <li>
            <span>01</span>
            <p>Buka <code>chrome://extensions</code> dan aktifkan Developer mode.</p>
          </li>
          <li>
            <span>02</span>
            <p>
              Pilih Load unpacked, lalu pilih folder <code>extension/</code> di
              repository.
            </p>
          </li>
          <li>
            <span>03</span>
            <p>Buka ikon AmanKlik, lalu isi Base URL dan token dari atas.</p>
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
        <p className="product-eyebrow text-white/55">Base URL terverifikasi</p>
        <code className="mt-3 block break-all text-ai-soft">{appBaseUrl}</code>
        <button
          type="button"
          className="product-button mt-4 border border-white/30 text-surface"
          onClick={() => onCopy(appBaseUrl)}
        >
          Salin Base URL
        </button>
        <div className="connect-setup__permission">
          Manifest extension meminta <strong>activeTab</strong>, context menu,
          scripting, side panel, dan storage. Pemeriksaan dikirim ketika kamu
          menjalankan aksi extension; token mentah disimpan oleh extension di
          penyimpanan lokal browser sampai kamu mengganti atau menghapusnya.
        </div>
      </div>
    </section>
  );
}
