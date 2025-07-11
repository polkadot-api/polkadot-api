import { describe, expect, test } from "vitest"
import { BitSeq } from "@/."
import { toHex } from "@polkadot-api/utils"

describe("BitSeq", () => {
  test("it correctly encodes/decodes with lsb and msb", () => {
    const lsb = BitSeq()
    const msb = BitSeq(false)

    const input = "0x349f05" // bitsLen: 13, bytes: [159, 5]
    const decLsb: Array<0 | 1> = [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0]
    const decMsb: Array<0 | 1> = [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]

    expect(lsb.dec(input)).toEqual(decLsb)
    expect(msb.dec(input)).toEqual(decMsb)
    expect(toHex(lsb.enc(decLsb))).toEqual(input)
    expect(toHex(msb.enc(decMsb))).toEqual("0x349f00")
  })
})
