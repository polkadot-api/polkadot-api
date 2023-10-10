import { describe, test, expect } from "vitest"
import { runner } from "clet"
import fsExists from "fs.promises.exists"

const cmd = "./bin/main.js"

describe("cli", () => {
  test(
    "descriptor codegen",
    async () => {
      await runner()
        .file("package.json", { bin: { "polkadot-api": "./bin/main.js" } })
        .spawn(cmd, ["--file test_descriptors.json"], {})
        .code(0)
        .end()
      await expect(
        fsExists("src/descriptors/polkadot-types.d.ts"),
      ).resolves.toEqual(true)
      await expect(fsExists("src/descriptors/polkadot.ts")).resolves.toEqual(
        true,
      )
    },
    5 * 60_000,
  )
})
