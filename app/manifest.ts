import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GoogleAi",
    short_name: "GoogleAi",
    description: "GoogleAi News, Shopping, TV, Mobiles, Jobs and more",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1020",
    theme_color: "#5b21b6",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
