import { Enum, u8, bool, _void, Option } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(
  Enum({
    Int: u8,
    Bool: bool,
    Void: _void,
    Opt: Option(bool),
    OptVoid: Option(_void),
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

  it("Option()", () => {
    tester({ tag: "Opt" }, "0x0300")
  })

  it("Option(true)", () => {
    tester({ tag: "Opt", value: true }, "0x0301")
  })

  it("Option(false)", () => {
    tester({ tag: "Opt", value: false }, "0x0302")
  })

  it("Option(_void)", () => {
    tester({ tag: "OptVoid" }, "0x0400")
    tester({ tag: "OptVoid", value: undefined }, "0x0400")
  })
})
