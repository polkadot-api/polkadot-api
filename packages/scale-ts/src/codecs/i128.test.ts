import { i128 } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(i128)

describe("i128", () => {
  it("zero", () => {
    tester(0n, "0x00000000000000000000000000000000")
  })

  it("-1n", () => {
    tester(-1n, "0xffffffffffffffffffffffffffffffff")
  })

  it("interesting value :-)", () => {
    tester(
      -18676936063680574795862633153229949450n,
      "0xf6f5f4f3f2f1f0f9f8f7f6f5f4f3f2f1",
    )
  })

  it("in the middle", () => {
    tester(9223372036854775807n, "0xffffffffffffff7f0000000000000000")
    tester(9223372036854775808n, "0x00000000000000800000000000000000")
  })

  it("max", () => {
    tester(
      170141183460469231731687303715884105727n,
      "0xffffffffffffffffffffffffffffff7f",
    )
  })

  it("min", () => {
    tester(
      -170141183460469231731687303715884105728n,
      "0x00000000000000000000000000000080",
    )
  })
})
