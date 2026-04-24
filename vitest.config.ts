import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["**/*.spec.ts"],
    disableConsoleIntercept: true,
  },
  resolve: { tsconfigPaths: true },
})
