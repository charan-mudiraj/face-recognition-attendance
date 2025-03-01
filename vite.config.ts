import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      manifest: {
        name: "My App",
        short_name: "MyApp",
        description: "abc",
        start_url: "/",
        scope: "/",
        orientation: "portrait",
        display: "standalone", // Hides browser UI
        background_color: "#ffffff", // Optional, improves loading
        theme_color: "#000000", // Optional, sets app bar color
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
          {
            src: "/maskable_icon.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      registerType: "prompt", // Ensures PWA updates automatically
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
