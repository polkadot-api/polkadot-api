import { Vector, u16 } from "../"
import { testCodec } from "./test-utils"

describe("Vector", () => {
  it("Sequence", () => {
    const testerSeq = testCodec(Vector(u16))
    const value = [4, 8, 15, 16, 23, 42]
    const hex = "0x18040008000f00100017002a00"
    testerSeq(value, hex)
  })

  it("Array", () => {
    const testerArr = testCodec(Vector(u16, 5))
    const value = [4, 8, 15, 16, 23]
    const hex = "0x040008000f0010001700"
    testerArr(value, hex)
  })
})
