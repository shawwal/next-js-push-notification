import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Push Notification System",
    short_name: "Notifications",
    description: "A progressive web app for managing and sending push notifications",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        //purpose: "any maskable",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        //purpose: "any maskable",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        //purpose: "any maskable",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        //purpose: "any maskable",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        //purpose: "any maskable",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        //purpose: "any maskable",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        //purpose: "any maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        //purpose: "any maskable",
      },
    ],
    shortcuts: [
      {
        name: "Send Notification",
        short_name: "Send",
        description: "Send a new notification",
        url: "/?tab=send",
        icons: [{ src: "/icons/send-shortcut.png", sizes: "192x192" }],
      },
      {
        name: "Notification History",
        short_name: "History",
        description: "View notification history",
        url: "/?tab=history",
        icons: [{ src: "/icons/history-shortcut.png", sizes: "192x192" }],
      },
    ],
    categories: ["utilities", "productivity"],
  }
}
