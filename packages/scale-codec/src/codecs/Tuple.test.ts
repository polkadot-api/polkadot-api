import { Tuple, compact, boolean } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Tuple(compact, boolean))

describe("Tuple", () => {
  it("works", () => {
    tester([3, false], "0x0c00")
  })
})
