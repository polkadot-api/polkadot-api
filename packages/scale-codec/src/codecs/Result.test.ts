import { Result, u8, boolean } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Result(u8, boolean))

describe("Result", () => {
  it("OK", () => {
    tester({ success: true, value: 42 }, "0x002a")
  })

  it("KO", () => {
    tester({ success: false, value: false }, "0x0100")
  })
})
