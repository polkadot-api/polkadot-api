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

const testerWithIdxs = testCodec(
  Enum(
    {
      nothingHere: _void,
      someNumber: u8,
      trueOrFalse: bool,
      optionalBool: Option(bool),
      optVoid: Option(_void),
    },
    [255, 0, 15, 1, 254],
  ),
)

describe("Enum", () => {
  it("Void()", () => {
    testerWithIdxs({ tag: "nothingHere" }, "0xff")
  })

  it("Int(42)", () => {
    testerWithIdxs({ tag: "someNumber", value: 42 }, "0x002a")
  })

  it("Bool(true)", () => {
    testerWithIdxs({ tag: "trueOrFalse", value: true }, "0x0f01")
  })

  it("Option(true)", () => {
    testerWithIdxs({ tag: "optionalBool", value: true }, "0x0101")
  })

  it("Option(false)", () => {
    testerWithIdxs({ tag: "optionalBool", value: false }, "0x0102")
  })

  it("Option()", () => {
    testerWithIdxs({ tag: "optionalBool" }, "0x0100")
  })

  it("Option(_void)", () => {
    testerWithIdxs({ tag: "optVoid" }, "0xfe00")
    testerWithIdxs({ tag: "optVoid", value: undefined }, "0xfe00")
  })
})
