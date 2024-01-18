import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // base: "src",
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": "/src",
      assets: "/src/assets",
      context: "/src/context",
      pages: "/src/pages",
    },
  },
  build: {
    sourcemap: true,
  },
});
