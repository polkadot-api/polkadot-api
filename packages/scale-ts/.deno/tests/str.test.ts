import { str } from "../index.ts"
import { testCodec } from "./test-utils.ts"

const tester = testCodec(str)

describe("string", () => {
  it("works", () => {
    const value = "a$¢ह€한𐍈😃"
    const hex = "0x546124c2a2e0a4b9e282aced959cf0908d88f09f9883"
    tester(value, hex)
  })
})
