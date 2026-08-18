import { expect, describe, it } from "vitest"
import { getSignBytes } from "@polkadot-api/signers-common"
import { fromHex, toHex } from "@polkadot-api/utils"
import { ed25519 } from "@noble/curves/ed25519.js"
import { Binary } from "@polkadot-api/substrate-bindings"

const aliceEd25519PrivKey = fromHex(
  "0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115",
)

const signBytes = getSignBytes((input: Uint8Array) =>
  ed25519.sign(input, aliceEd25519PrivKey),
)

describe("signBytes", () => {
  it("provides the same signature for padded/unpadded", async () => {
    const unpadded = Binary.fromText("hello world")
    const padded = Binary.fromText("<Bytes>hello world</Bytes>")

    expect(toHex(await signBytes(unpadded))).toBe(
      toHex(await signBytes(padded)),
    )
  })

  it("provides the same signature for empty padded/unpadded", async () => {
    const unpadded = Binary.fromText("")
    const padded = Binary.fromText("<Bytes></Bytes>")

    expect(toHex(await signBytes(unpadded))).toBe(
      toHex(await signBytes(padded)),
    )
  })
})
