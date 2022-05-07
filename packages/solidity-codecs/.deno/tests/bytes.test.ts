import { bytes } from "../index.ts"
import { testEncoder, testDecoder } from "./test-utils.ts"

describe("bytes", () => {
  it("works", () => {
    const encoder = testEncoder(bytes(3).enc)
    const decoder = testDecoder(bytes(3).dec)
    encoder(
      new Uint8Array([0, 15, 255, 16, 74]),
      "0x000fff0000000000000000000000000000000000000000000000000000000000",
    )

    encoder(
      new Uint8Array([0, 15, 255]),
      "0x000fff0000000000000000000000000000000000000000000000000000000000",
    )

    decoder(
      "0x000fff0000000000000000000000000000000000000000000000000000000000",
      new Uint8Array([0, 15, 255]),
    )

    const input = new Uint8Array(32)
    expect(bytes(32).enc(input)).toBe(input)
  })
})
