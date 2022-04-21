import { u64 } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(u64)

describe("u64", () => {
  it("zero", () => {
    tester(0n, "0x0000000000000000")
    expect(u64.dec(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]))).toEqual(0n)
    expect(u64.dec(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]).buffer)).toEqual(0n)
  })

  it("max", () => {
    tester(18446744073709551615n, "0xffffffffffffffff")
  })
})
