import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ButtonMotion } from "@/components/ui/animated-button";

const productSans = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-product-sans",
});

const productMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-product-mono",
  weight: ["400", "500", "600"],
});

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${productSans.variable} ${productMono.variable} product-scope min-h-screen bg-canvas text-ink`}
    >
      <a className="product-skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <SiteHeader variant="interior" />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <ButtonMotion selector=".product-button, [data-header-cta]" />
    </div>
  );
}
