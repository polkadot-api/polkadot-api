import { Str } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Str)

describe("Str", () => {
  it("works", () => {
    const value = "a$¢ह€한𐍈😃"
    const hex = "0x546124c2a2e0a4b9e282aced959cf0908d88f09f9883"
    tester(value, hex)
  })
})
