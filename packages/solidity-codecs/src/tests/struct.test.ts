import { struct, uint, bool } from "../"
import { testCodec } from "./test-utils"

const three = "0000000000000000000000000000000000000000000000000000000000000003"
const falsy = "0000000000000000000000000000000000000000000000000000000000000000"
describe("Struct", () => {
  it("encodes and decodes complex Objects", () => {
    const tester = testCodec(
      struct({
        num: uint(8),
        bool,
        nested: struct({
          bool,
          num: uint(8),
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

  it("encodes Objects correctly, even when the key order is different", () => {
    const tester = testCodec(
      struct({
        num: uint(8),
        bool,
        nested: struct({
          bool,
          num: uint(8),
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
