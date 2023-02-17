import { defineConfig } from "vitest/config"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import Icons from "unplugin-icons/vite"

import { join } from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), Icons({ compiler: "svelte" })],
  resolve: {
    alias: {
      "#": `${join(__dirname, "src")}/`,
      "#types": `${join(__dirname, "types")}/`,
    },
  },
  build: { minify: true },

  // Vitest
  test: { includeSource: ["./src/**/*.ts"] },
  define: {
    "import.meta.vitest": "undefined",
  },
})
