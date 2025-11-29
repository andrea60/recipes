import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    VitePWA({
      includeAssets: ["icon.svg"],
      manifest: {
        short_name: "Recipes CookBook",
        description: "A simple recipes cookbook app",
        theme_color: "#D49454",
        background_color: "#1A1816",
        icons: [{ src: "icon.png", sizes: "512x512", type: "image/png" }],
      },
    }),
  ],
});
