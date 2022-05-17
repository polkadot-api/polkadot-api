import { Vector, uint, str, Tuple } from "../"
import { testCodec } from "./test-utils"

describe("Vector", () => {
  it("works with dynamic codecs", () => {
    const codec = Tuple(Vector(str))
    const bytes = codec.enc([["abcd", "efg", "hijk"]])
    expect(codec.dec(bytes)).toEqual([["abcd", "efg", "hijk"]])
  })

  it("Sequence", () => {
    const testerSeq = testCodec(Vector(uint))
    const value = [1n, 2n, 3n]
    const hex =
      "0x0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003"
    testerSeq(value, hex)
  })

  it("Array", () => {
    const testerArr = testCodec(Vector(uint, 3))
    const value = [1n, 2n, 3n]
    const hex =
      "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003"
    testerArr(value, hex)
  })
})
