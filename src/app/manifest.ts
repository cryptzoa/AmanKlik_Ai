import type { MetadataRoute } from "next";

type ShareTargetManifest = MetadataRoute.Manifest & {
  share_target: {
    action: string;
    method: "POST";
    enctype: "multipart/form-data";
    params: {
      title: string;
      text: string;
      url: string;
      files: Array<{ name: string; accept: string[] }>;
    };
  };
};

export default function manifest(): ShareTargetManifest {
  return {
    name: "AmanKlik AI",
    short_name: "AmanKlik",
    description: "Pahami risikonya sebelum percaya pesannya.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f2",
    theme_color: "#f7f6f2",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    share_target: {
      action: "/api/share-target",
      method: "POST",
      enctype: "multipart/form-data",
      params: {
        title: "title",
        text: "text",
        url: "url",
        files: [{
          name: "image",
          accept: [
            "image/png",
            "image/jpeg",
            "image/webp",
            ".png",
            ".jpg",
            ".jpeg",
            ".webp",
          ],
        }],
      },
    },
  };
}
