import { SDate } from "../"
import { testCodec } from "../test-utils"

const tester32 = testCodec(SDate(32))
const tester64 = testCodec(SDate(64))

describe("SDate", () => {
  it("32", () => {
    tester32(new Date(0), "0x00000000")
  })

  it("64", () => {
    tester64(new Date(0), "0x0000000000000000")
  })
})
