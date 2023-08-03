import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  test: {
    include: ["**/*.spec.ts"],
    deps: {
      inline: ["@fast-check/vitest"],
    },
  },
  plugins: [tsconfigPaths()],
})
