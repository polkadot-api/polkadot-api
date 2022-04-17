import { Enum, u8, bool, _void } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(
  Enum({
    Int: u8,
    Bool: bool,
    Void: _void,
  }),
)

describe("Enum", () => {
  it("Int(42)", () => {
    tester({ tag: "Int", value: 42 }, "0x002a")
  })

  it("Bool(true)", () => {
    tester({ tag: "Bool", value: true }, "0x0101")
  })

  it("Void()", () => {
    tester({ tag: "Void" }, "0x02")
  })
})
