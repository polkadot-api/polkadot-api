import { U64 } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(U64)

describe("U64", () => {
  it("zero", () => {
    tester(0n, "0x0000000000000000")
    expect(U64.dec(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]))).toEqual(0n)
    expect(U64.dec(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]).buffer)).toEqual(0n)
  })

  it("max", () => {
    tester(1229782938247303441n, "0x1111111111111111")
  })
})
