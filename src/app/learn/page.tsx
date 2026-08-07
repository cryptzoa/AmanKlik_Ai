import Link from "next/link";

const topics = [
  ["OTP, PIN, dan password", "Kode rahasia tidak perlu dibagikan kepada pengirim pesan, apa pun alasannya."],
  ["Tekanan waktu", "Jeda dan verifikasi independen membantu memutus keputusan yang didorong rasa panik."],
  ["Identitas yang berubah", "Nomor baru atau permintaan mendadak perlu dicek lewat kanal lama yang sudah dipercaya."],
  ["Anatomi URL", "Nama di subdomain atau path tidak sama dengan domain utama yang sebenarnya."],
  ["Kalau sudah terlanjur", "Hubungi penyedia layanan melalui kanal resmi, amankan akun, dan simpan bukti."],
];

export const metadata = {
  title: "Learn — AmanKlik AI",
};

export default function LearnPage() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-line pb-6">
          <Link className="font-mono text-sm font-semibold uppercase tracking-[0.2em]" href="/">AmanKlik AI</Link>
          <Link className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface" href="/scan">Cek pesan</Link>
        </header>
        <section className="py-16 sm:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-ai">AmanKlik / Learn</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">Pola yang bisa kamu kenali sendiri.</h1>
          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {topics.map(([title, body], index) => (
              <article key={title} className="bg-surface p-6 sm:p-8">
                <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="mt-8 text-2xl font-semibold">{title}</h2>
                <p className="mt-4 leading-7 text-muted">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
