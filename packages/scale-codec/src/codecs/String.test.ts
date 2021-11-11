import { Str } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Str)

describe("Str", () => {
  it("works", () => {
    const value = "Shame on me for having such a shitty test..."
    const hex =
      "0xb05368616d65206f6e206d6520666f7220686176696e67207375636820612073686974747920746573742e2e2e"
    tester(value, hex)
  })
})
