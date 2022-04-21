import { i32 } from "../"
import { testCodec } from "./test-utils"

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
    tester(2147483647, "0xffffff7f")
  })

  it("min", () => {
    tester(-2147483648, "0x00000080")
  })
})
