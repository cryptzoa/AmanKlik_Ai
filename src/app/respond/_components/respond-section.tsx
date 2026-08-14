import { RespondClient } from "@/app/respond/_components/respond-client";

export function RespondSection() {
  return (
    <section>
      <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[0.65fr_0.35fr] lg:items-end">
        <h2 className="section-title max-w-3xl">
          Pilih yang terjadi. Kerjakan yang pertama.
        </h2>
        <p className="max-w-lg text-sm leading-7 text-muted lg:justify-self-end">
          Untuk uang yang sudah terkirim, kecepatan melapor penting. Gunakan
          hanya kanal resmi yang kamu buka sendiri—bukan nomor atau tautan dari
          pesan.
        </p>
      </div>
      <RespondClient />
    </section>
  );
}
