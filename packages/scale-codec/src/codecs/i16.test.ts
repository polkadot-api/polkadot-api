import { i16 } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(i16)

describe("i16", () => {
  it("zero", () => {
    tester(0, "0x0000")
    expect(i16.dec(new Uint8Array([0, 0]))).toEqual(0)
    expect(i16.dec(new Uint8Array([0, 0]).buffer)).toEqual(0)
  })

  it("-1", () => {
    tester(-1, "0xffff")
  })

  it("max", () => {
    tester(4095, "0xff0f")
  })

  it("min", () => {
    tester(-4096, "0x00f0")
  })
})
