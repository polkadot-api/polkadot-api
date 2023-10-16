import { describe, test, expect } from "vitest"
import { runner } from "clet"
import fsExists from "fs.promises.exists"
import path from "path"

const cmd = "./bin/main.js"
const outputDir = "artifacts/descriptors"

describe("cli", () => {
  test(
    "descriptor codegen",
    async () => {
      await runner()
        .file("package.json", { bin: { "polkadot-api": cmd } })
        .file("test_descriptors.json", {
          polkadot: { outputFolder: outputDir },
        })
        .spawn(cmd, ["--file test_descriptors.json"], {})
        .code(0)
        .end()
      await expect(
        fsExists(path.join(outputDir, "polkadot-types.d.ts")),
      ).resolves.toEqual(true)
      await expect(
        fsExists(path.join(outputDir, "polkadot.ts")),
      ).resolves.toEqual(true)
      await expect(
        fsExists(path.join(outputDir, "polkadot.d.ts")),
      ).resolves.toEqual(false)
    },
    5 * 60_000,
  )
})
