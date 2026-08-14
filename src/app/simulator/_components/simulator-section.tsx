import { SimulatorClient } from "@/app/simulator/_components/simulator-client";

export function SimulatorSection({ sourceScanId }: { sourceScanId: string | null }) {
  return (
    <section>
      <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-2 lg:items-end">
        <h2 className="section-title max-w-3xl">
          Latih keputusan, bukan tebakan.
        </h2>
        <p className="max-w-xl text-sm leading-7 text-muted lg:justify-self-end">
          Tidak ada data, uang, atau konsekuensi nyata. Setiap skenario
          mengajarkan satu aturan yang bisa dipakai kembali ketika modus dan
          tampilannya berubah.
        </p>
      </div>
      <SimulatorClient sourceScanId={sourceScanId} />
    </section>
  );
}
