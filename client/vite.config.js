import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  // base: "src",
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react(),
  ],
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
      layout: "/src/layout",
      views: "/src/views",
      reducer: "/src/reducer",
      config: "/src/config",
      constants: "/src/constants",
      utils: "/src/utils",
      hooks: "/src/hooks",
      "ui-component": "/src/ui-component",
      "menu-items": "/src/menu-items",
    },
  },
  // build: {
  //   sourcemap: true,
  // },

  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
