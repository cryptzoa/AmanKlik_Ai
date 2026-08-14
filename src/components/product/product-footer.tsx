import Link from "next/link";

const navigation = [
  ["/scan", "Periksa"],
  ["/investigate", "Investigasi"],
  ["/simulator", "Latihan"],
  ["/learn", "Pelajari"],
  ["/history", "Riwayat"],
  ["/privacy", "Privasi"],
] as const;

export function ProductFooter() {
  return (
    <footer className="product-footer">
      <div className="product-container product-footer__inner">
        <div className="product-footer__opening">
          <div>
            <p className="product-footer__brand">AmanKlik AI</p>
            <p className="product-footer__promise">
              Risiko rendah bukan jaminan aman. Berhenti sejenak, periksa
              buktinya, lalu verifikasi melalui kanal resmi.
            </p>
          </div>
          <nav aria-label="Navigasi footer">
            {navigation.map(([href, label]) => (
              <Link href={href} key={href}>{label}</Link>
            ))}
          </nav>
        </div>

        <div className="product-footer__wordmark" aria-hidden="true">
          AMANKLIK
        </div>

        <div className="product-footer__closing">
          <span>© {new Date().getFullYear()} AmanKlik AI</span>
          <span>Made with precision by bersiaplah - HMTI UNIPI</span>
        </div>
      </div>
    </footer>
  );
}
