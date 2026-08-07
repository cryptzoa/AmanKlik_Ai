import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/site/smooth-scroll";

export const metadata: Metadata = {
  title: "AmanKlik AI",
  description: "Pahami risikonya sebelum percaya pesannya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
