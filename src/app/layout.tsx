import type { Metadata } from "next";
import { connection } from "next/server";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SiteRuntime } from "@/components/site/site-runtime";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  return (
    <html lang="id">
      <body>
        <SiteRuntime>{children}</SiteRuntime>
      </body>
    </html>
  );
}
