import descriptorTreeShake from "@polkadot-api/rollup-plugin-descriptor-treeshake"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [descriptorTreeShake("./src/codegen")],
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
