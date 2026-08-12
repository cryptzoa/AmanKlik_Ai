type SiteFooterProps = {
  variant: "landing" | "interior";
};

function FooterContent() {
  return (
    <>
      <p className="font-mono uppercase tracking-[0.14em]">
        AmanKlik AI · 2026
      </p>
      <p>
        Risiko rendah bukan jaminan aman. Verifikasi selalu melalui kanal resmi.
      </p>
    </>
  );
}

export function SiteFooter({ variant }: SiteFooterProps) {
  if (variant === "landing") {
    return (
      <footer className="flex flex-col gap-4 bg-ink px-5 py-9 text-sm text-[#aaa9a2] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <FooterContent />
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/15 bg-ink px-5 py-9 text-sm text-[#aaa9a2] sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FooterContent />
      </div>
    </footer>
  );
}
