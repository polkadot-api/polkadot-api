import { testCodec } from "../test-utils"
import { bool, compact, Option } from "../"

describe("Option", () => {
  it("None", () => {
    const tester = testCodec(Option(compact))
    tester(undefined, "0x00")
  })

  it("Some", () => {
    const tester = testCodec(Option(compact))
    tester(1, "0x0104")
  })

  it("Booleans", () => {
    const tester = testCodec(Option(bool))
    tester(undefined, "0x00")
    tester(true, "0x01")
    tester(false, "0x02")
  })
})
