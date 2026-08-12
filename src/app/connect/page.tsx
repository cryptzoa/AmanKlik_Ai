import { ConnectClient } from "@/app/connect/_components/connect-client";
import { InteriorShell } from "@/components/site/interior-shell";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function ConnectPage() {
  return (
    <InteriorShell
      eyebrow="10 / Connect"
      title="AmanKlik di tempat pesan datang."
      description="Hubungkan browser extension dengan token terbatas yang dapat dicabut, tanpa mengekspos kredensial AI."
      marker="SELECT / CONSENT / CHECK"
      fragments={["ACTIVE TAB", "REVOCABLE", "NO API KEY"]}
      compact
    >
      <ConnectClient appBaseUrl={env.APP_BASE_URL.replace(/\/$/, "")} />
    </InteriorShell>
  );
}
