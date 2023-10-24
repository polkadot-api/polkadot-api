import { defineConfig } from "vite"

export default defineConfig({
  plugins: [],
  build: {
    target: "esnext",
    rollupOptions: {
      shimMissingExports: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: { target: "esnext" },
  },
})
