import { Enum, u8, boolean } from "../"
import { testCodec } from "../test-utils"

enum Options {
  Int,
  Bool,
}

const tester = testCodec(Enum({ [Options.Int]: u8, [Options.Bool]: boolean }))

describe("Enum", () => {
  it("Int(42)", () => {
    tester({ tag: Options.Int, value: 42 }, "0x002a")
  })

  it("Bool(true)", () => {
    tester({ tag: Options.Bool, value: true }, "0x0101")
  })
})
