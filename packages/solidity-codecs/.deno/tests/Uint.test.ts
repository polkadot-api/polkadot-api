import { uint248 } from "../index.ts"
import { testCodec } from "./test-utils.ts"

const tester = testCodec(uint248)

describe("uint", () => {
  it("zero", () => {
    tester(
      0n,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    )
  })

  it("one", () => {
    tester(
      1n,
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    )
  })

  it("MAX_SAFE_INTEGER", () => {
    tester(
      BigInt(Number.MAX_SAFE_INTEGER),
      "0x000000000000000000000000000000000000000000000000001fffffffffffff",
    )
  })

  it("next higher value than MAX_SAFE_INTEGER", () => {
    tester(
      9007199254740992n,
      "0x0000000000000000000000000000000000000000000000000020000000000000",
    )
  })

  it("MAX_SAFE_INTEGER + 2", () => {
    tester(
      9007199254740993n,
      "0x0000000000000000000000000000000000000000000000000020000000000001",
    )
  })

  it("a value", () => {
    tester(
      2342345533n,
      "0x000000000000000000000000000000000000000000000000000000008b9d5b3d",
    )
  })
})
