import { defineConfig, mergeConfig } from "vitest/config"
import rootConfig from "../../vitest.config"

export default defineConfig((env) => {
  if (env.mode === "CI") {
    return mergeConfig(
      rootConfig,
      defineConfig({
        test: {
          include: ["tests/e2e/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        },
      }),
    )
  }

  return mergeConfig(
    rootConfig,
    defineConfig({
      test: {
        include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        passWithNoTests: true,
        exclude: [
          "**/node_modules/**",
          "**/dist/**",
          "**/cypress/**",
          "**/.{idea,git,cache,output,temp}/**",
          "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
          "tests/integration/**/*.{test,spec}.?(c|m)[jt]s?(x)",
          "tests/e2e/**/*.{test,spec}.?(c|m)[jt]s?(x)",
        ],
      },
    }),
  )
})
