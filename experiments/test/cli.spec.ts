import { describe, test, expect } from "vitest"
import { runner } from "clet"
import fsExists from "fs.promises.exists"

describe("cli", () => {
  test(
    "descriptor codegen",
    async () => {
      await runner()
        .spawn("node_modules/.bin/polkadot-api", ["--key polkadot"], {})
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
