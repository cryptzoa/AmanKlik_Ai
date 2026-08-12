import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { ButtonMotion } from "@/components/ui/animated-button";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { PreloaderProvider } from "@/components/site/preloader-context";
import { TransitionProvider } from "@/components/site/transition-context";
import { Preloader } from "@/components/site/preloader";
import { TransitionOverlay } from "@/components/site/transition-overlay";

export const metadata: Metadata = {
  title: "AmanKlik AI",
  description: "Pahami risikonya sebelum percaya pesannya.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  other: { "theme-color": "#f7f6f2" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <PreloaderProvider>
          <TransitionProvider>
            <Preloader />
            <TransitionOverlay />
            <SmoothScroll />
            <ButtonMotion />
            {children}
          </TransitionProvider>
        </PreloaderProvider>
      </body>
    </html>
  );
}
