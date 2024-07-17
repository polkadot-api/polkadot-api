import { defineConfig } from "vite"

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      shimMissingExports: true,
    },
    sourcemap: true,
  },
  optimizeDeps: {
    esbuildOptions: { target: "esnext" },
  },
})
