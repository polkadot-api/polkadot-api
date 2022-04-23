import { Tuple, compact, bool } from "../index.ts"
import { testCodec } from "./test-utils.ts"

const tester = testCodec(Tuple(compact, bool))

describe("Tuple", () => {
  it("works", () => {
    tester([3, false], "0x0c00")
  })
})
