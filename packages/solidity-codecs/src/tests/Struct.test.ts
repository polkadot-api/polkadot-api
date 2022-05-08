import { Struct, uint8, bool } from "../"
import { testCodec } from "./test-utils"

const three = "0000000000000000000000000000000000000000000000000000000000000003"
const falsy = "0000000000000000000000000000000000000000000000000000000000000000"
describe("Struct", () => {
  it("encodes and decodes complex Objects", () => {
    const tester = testCodec(
      Struct({
        num: uint8,
        bool,
        nested: Struct({
          bool,
          num: uint8,
        }),
      }),
    )

    tester(
      {
        num: 3n,
        bool: false,
        nested: {
          bool: false,
          num: 3n,
        },
      },
      `0x${three}${falsy}${falsy}${three}`,
    )
  })

  /*
  it("works", () => {
    const tester = testCodec(
      Struct({
        foo: Uint(256),
        bar: Int(256),
        text: str,
      }),
    )

    const output =
      "0x0000000000000000000000000000000000000000000000000000000000000005fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000"

    tester(
      {
        foo: 5n,
        bar: -5n,
        text: "hello",
      },
      output,
    )
  })
  */

  it("encodes Objects correctly, even when the key order is different", () => {
    const tester = testCodec(
      Struct({
        num: uint8,
        bool,
        nested: Struct({
          bool,
          num: uint8,
        }),
      }),
    )

    tester(
      {
        nested: {
          num: 3n,
          bool: false,
        },
        bool: false,
        num: 3n,
      },
      `0x${three}${falsy}${falsy}${three}`,
    )
  })
})
