import { Vector, u16 } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Vector(u16))

describe("Vector", () => {
  it("works", () => {
    const value = [4, 8, 15, 16, 23, 42]
    const hex = "0x18040008000f00100017002a00"
    tester(value, hex)
  })
})
