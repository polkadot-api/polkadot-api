import { Tuple, Compat, Bool } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Tuple(Compat, Bool))

describe("Tuple", () => {
  it("works", () => {
    tester([3, false], "0x0c00")
  })
})
