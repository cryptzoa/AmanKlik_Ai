import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AmanKlik AI",
    short_name: "AmanKlik",
    description: "Pahami risikonya sebelum percaya pesannya.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f1ea",
    theme_color: "#f3f1ea",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
