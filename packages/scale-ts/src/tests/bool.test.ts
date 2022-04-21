import { bool } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(bool)

describe("boolean", () => {
  it("false", () => {
    tester(false, "0x00")
  })

  it("true", () => {
    tester(true, "0x01")
  })
})
