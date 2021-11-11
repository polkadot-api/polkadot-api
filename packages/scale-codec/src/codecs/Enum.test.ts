import { Enum, U8, Bool } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(Enum({ Int: U8, Bool }))

describe("Tuple", () => {
  it("Int(42)", () => {
    tester({ tag: "Int" as const, value: 42 }, "0x002a")
  })

  it("Bool(true)", () => {
    tester({ tag: "Bool" as const, value: true }, "0x0101")
  })
})
