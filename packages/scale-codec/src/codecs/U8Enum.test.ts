import { U8Enum } from "../"
import { testCodec } from "../test-utils"
import { createCodec } from "../utils"
import { U8EnumDec, U8EnumEnc } from "./U8Enum"

describe("U8Enum", () => {
  it("works with default Enums", () => {
    enum Basic {
      Foo,
      Bar,
      Baz,
    }

    const tester = testCodec(createCodec(U8EnumEnc(Basic), U8EnumDec(Basic)))

    tester(Basic.Foo, "0x00")
    tester(Basic.Bar, "0x01")
    tester(Basic.Baz, "0x02")
  })

  it("works with computed values Enums", () => {
    enum Computed {
      Foo = 1,
      Bar = 3,
      Baz = 5,
    }

    const codec = U8Enum(Computed)
    const tester = testCodec(codec)

    tester(Computed.Foo, "0x01")
    tester(Computed.Bar, "0x03")
    tester(Computed.Baz, "0x05")
  })
})
