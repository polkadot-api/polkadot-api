import { i64 } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(i64)

describe("i64", () => {
  it("zero", () => {
    tester(0n, "0x0000000000000000")
    expect(
      i64.dec(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
    ).toEqual(0n)
    expect(
      i64.dec(
        new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).buffer,
      ),
    ).toEqual(0n)
  })

  it("-1n", () => {
    tester(-1n, "0xffffffffffffffff")
  })

  it("max", () => {
    tester(9223372036854775807n, "0xffffffffffffff7f")
  })

  it("min", () => {
    tester(-9223372036854775808n, "0x0000000000000080")
  })
})
