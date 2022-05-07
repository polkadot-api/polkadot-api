import { bool } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(bool)

describe("boolean", () => {
  it("false", () => {
    tester(
      false,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    )
  })

  it("true", () => {
    tester(
      true,
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    )
  })
})
