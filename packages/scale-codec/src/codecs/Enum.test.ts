import { Enum, u8, bool } from "../"
import { testCodec } from "../test-utils"
import { empty } from "./empty"

enum Options {
  Int = "Int",
  Bool = "Bool",
  Void = "Void",
}

const tester = testCodec(
  Enum({
    [Options.Int]: u8,
    [Options.Bool]: bool,
    [Options.Void]: empty,
  }),
)

describe("Enum", () => {
  it("Int(42)", () => {
    tester({ tag: Options.Int, value: 42 }, "0x002a")
  })

  it("Bool(true)", () => {
    tester({ tag: Options.Bool, value: true }, "0x0101")
  })

  it("Void()", () => {
    tester({ tag: Options.Void }, "0x02")
  })
})
