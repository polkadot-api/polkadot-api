import { concatBytes, randomBytes } from "@noble/hashes/utils"
import { compact } from "scale-ts"
import { describe, expect, test } from "vitest"
import { bitSequence } from "@/."

describe("bitSequence", () => {
  test("it correctly encodes/decodes its inputs while only taking the necessary bytes", () => {
    // 9 bits required 2 bytes
    const bitsLen = 9
    const nine = compact.enc(bitsLen)

    const otherData = randomBytes(10)
    const expectedBytes = otherData.slice(0, 2)
    const input = concatBytes(nine, otherData)

    const decoded = bitSequence.dec(input)

    expect(decoded).toEqual({
      bitsLen,
      bytes: expectedBytes,
    })

    const encoded = bitSequence.enc(decoded)
    expect(encoded).toEqual(input.slice(0, nine.length + expectedBytes.length))
  })

  test("it throws when trying to encode it with more bits than avaiable", () => {
    expect(() =>
      bitSequence.enc({
        bitsLen: 8,
        bytes: new Uint8Array(1),
      }),
    ).not.toThrowError()

    expect(() =>
      bitSequence.enc({
        bitsLen: 9,
        bytes: new Uint8Array(1),
      }),
    ).toThrowError()
  })
})
