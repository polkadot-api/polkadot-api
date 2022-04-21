import { Tuple, compact, bool } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(Tuple(compact, bool))

describe("Tuple", () => {
  it("works", () => {
    tester([3, false], "0x0c00")
  })
})
