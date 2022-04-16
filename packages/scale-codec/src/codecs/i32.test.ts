import { i32 } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(i32)

describe("i32", () => {
  it("zero", () => {
    tester(0, "0x00000000")
    expect(i32.dec(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]))).toEqual(0)
    expect(i32.dec(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]).buffer)).toEqual(0)
  })

  it("-1", () => {
    tester(-1, "0xffffffff")
  })

  it("max", () => {
    tester(268435455, "0xffffff0f")
  })

  it("min", () => {
    tester(-268435456, "0x000000f0")
  })
})
