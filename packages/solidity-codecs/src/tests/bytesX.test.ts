import { bytes3, bytes32 } from "../"
import { testEncoder, testDecoder } from "./test-utils"

describe("bytes", () => {
  it("works", () => {
    const encoder = testEncoder(bytes3.enc)
    const decoder = testDecoder(bytes3.dec)
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
    expect(bytes32.enc(input)).toBe(input)
  })
})
