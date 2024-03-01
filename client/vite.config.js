import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
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
      api: "/src/api",
      components: "/src/components",
      context: "/src/context",
      pages: "/src/pages",
      reducer: "/src/reducer",
    },
  },
  build: {
    sourcemap: true,
  },
});
