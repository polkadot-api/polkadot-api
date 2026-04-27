import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["**/*.spec.ts"],
    disableConsoleIntercept: true,
    globalSetup: ["./setupTests.ts"],
    testTimeout: 20_000,
  },
  resolve: { tsconfigPaths: true },
})
