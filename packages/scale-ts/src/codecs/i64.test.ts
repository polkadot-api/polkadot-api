import { i64 } from "../"
import { testCodec } from "../test-utils"

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

  it("almost max", () => {
    tester(1152921504606846975n, "0xffffffffffffff0f")
  })

  it("almost min", () => {
    tester(-1152921504606846976n, "0x00000000000000f0")
  })
})
