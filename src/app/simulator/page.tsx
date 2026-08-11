import { SimulatorClient } from "@/app/simulator/simulator-client";
import { InteriorShell } from "@/components/site/interior-shell";

export const metadata = {
  title: "Latihan Keputusan Aman — AmanKlik AI",
};

export default function SimulatorPage() {
  return (
    <InteriorShell
      eyebrow="02 / Simulator"
      title="Latih refleks amanmu."
      description="Hadapi delapan situasi sintetis yang dekat dengan pengguna Indonesia. Pilih tindakan yang benar-benar akan kamu ambil, lalu pelajari dampaknya setelah setiap keputusan."
      marker="PILIH / PAHAMI / ULANGI"
      fragments={["JANGAN BURU-BURU", "CEK SENDIRI", "KANAL RESMI"]}
    >
      <section data-reveal>
        <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-2 lg:items-end">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl">Latih keputusan, bukan tebakan.</h2>
          <p className="max-w-xl text-sm leading-7 text-muted lg:justify-self-end">Tidak ada data, uang, atau konsekuensi nyata. Setiap skenario mengajarkan satu aturan yang bisa dipakai kembali ketika modus dan tampilannya berubah.</p>
        </div>
        <SimulatorClient />
      </section>
    </InteriorShell>
  );
}
