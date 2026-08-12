import { SimulatorSection } from "@/app/simulator/_components/simulator-section";
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
      compact
    >
      <SimulatorSection />
    </InteriorShell>
  );
}
