import { Metadata } from "next";
import { PromoClient } from "./_components/promo-client";

export const metadata: Metadata = {
  title: "AmanKlik AI Promo - JEDA",
  description: "AmanKlik AI promotional film",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PromoPage({
  searchParams,
}: {
  searchParams: Promise<{ ratio?: string; cut?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const ratio = params.ratio === "9x16" ? "9x16" : "16x9";
  const cut = params.cut === "15s" ? "15s" : "master";
  const mode = params.mode === "record" ? "record" : "preview";

  return (
    <main className="fixed inset-0 z-[9999] bg-[#F3F1EA] text-[#111111] overflow-hidden">
      <PromoClient ratio={ratio} cut={cut} mode={mode} />
    </main>
  );
}
