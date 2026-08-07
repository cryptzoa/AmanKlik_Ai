import { SimulatorClient } from "@/app/simulator/simulator-client";
import { InteriorShell } from "@/components/site/interior-shell";

export const metadata = {
  title: "Simulator — AmanKlik AI",
};

export default function SimulatorPage() {
  return (
    <InteriorShell
      eyebrow="02 / Simulator"
      title="Latih refleks amanmu."
      description="Hadapi skenario sintetis, pilih responsmu, dan lihat kapan keputusan seharusnya dipindahkan ke kanal verifikasi independen."
      marker="PILIH / NILAI / PELAJARI"
      fragments={["JANGAN BURU-BURU", "CEK ULANG", "KANAL RESMI"]}
    >
      <section data-reveal>
        <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-2 lg:items-end">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl">Keputusan kecil, dampak besar.</h2>
          <p className="max-w-xl text-sm leading-7 text-muted lg:justify-self-end">Tidak ada data nyata atau konsekuensi nyata di sini. Tujuannya membangun jeda sebelum mengeklik, membalas, atau mengirim sesuatu.</p>
        </div>
          <SimulatorClient />
      </section>
    </InteriorShell>
  );
}
