import { Result, U8, Bool } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Result(U8, Bool))

describe("Result", () => {
  it("OK", () => {
    tester({ success: true, value: 42 }, "0x002a")
  })

  it("KO", () => {
    tester({ success: false, value: false }, "0x0100")
  })
})
