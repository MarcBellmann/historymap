import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import type { Plugin } from "vite";

function geojsonPlugin(): Plugin {
  return {
    name: "geojson-loader",
    transform(code, id) {
      if (id.endsWith(".geojson")) {
        return {
          code: `export default ${code}`,
          map: null,
        };
      }
    },
  };
}

export default defineConfig({
  plugins: [
    tanstackStart({
      srcDirectory: "app",
    }),
    react(),
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    geojsonPlugin(),
  ],
});
