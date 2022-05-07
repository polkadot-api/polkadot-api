import { tuple, uint, bool } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(tuple(uint(8), bool, tuple(bool, uint(8))))

describe("Tuple", () => {
  it("works", () => {
    const three =
      "0000000000000000000000000000000000000000000000000000000000000003"
    const falsy =
      "0000000000000000000000000000000000000000000000000000000000000000"
    tester([3n, false, [false, 3n]], `0x${three}${falsy}${falsy}${three}`)
  })
})
