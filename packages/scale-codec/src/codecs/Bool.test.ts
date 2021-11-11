import { Bool } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Bool)

describe("Bool", () => {
  it("false", () => {
    tester(false, "0x00")
  })

  it("true", () => {
    tester(true, "0x01")
  })
})
