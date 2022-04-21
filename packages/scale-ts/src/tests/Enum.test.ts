import { Enum, u8, bool, _void, Option } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(
  Enum({
    nothingHere: _void,
    someNumber: u8,
    trueOrFalse: bool,
    optionalBool: Option(bool),
    optVoid: Option(_void),
  }),
)

describe("Enum", () => {
  it("Void()", () => {
    tester({ tag: "nothingHere" }, "0x00")
  })

  it("Int(42)", () => {
    tester({ tag: "someNumber", value: 42 }, "0x012a")
  })

  it("Bool(true)", () => {
    tester({ tag: "trueOrFalse", value: true }, "0x0201")
  })

  it("Option(true)", () => {
    tester({ tag: "optionalBool", value: true }, "0x0301")
  })

  it("Option(false)", () => {
    tester({ tag: "optionalBool", value: false }, "0x0302")
  })

  it("Option()", () => {
    tester({ tag: "optionalBool" }, "0x0300")
  })

  it("Option(_void)", () => {
    tester({ tag: "optVoid" }, "0x0400")
    tester({ tag: "optVoid", value: undefined }, "0x0400")
  })
})
