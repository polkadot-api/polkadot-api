import { Result, u8, bool } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Result(u8, bool))

describe("Result", () => {
  it("OK", () => {
    tester({ success: true, value: 42 }, "0x002a")
  })

  it("KO", () => {
    tester({ success: false, value: false }, "0x0100")
  })
})
