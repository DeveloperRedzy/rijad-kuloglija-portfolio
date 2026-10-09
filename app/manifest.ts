import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Redzy — Rijad Kuloglija", short_name: "Redzy", start_url: "/", display: "standalone",
    background_color: "#0A0908", theme_color: "#0A0908",
    icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" }],
  };
}
