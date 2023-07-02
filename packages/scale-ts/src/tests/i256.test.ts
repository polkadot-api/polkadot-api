import { i256 } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(i256)

describe("i256", () => {
  it("zero", () => {
    tester(
      0n,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    )
  })

  it("-1n", () => {
    tester(
      -1n,
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    )
  })

  it("max", () => {
    tester(
      57896044618658097711785492504343953926634992332820282019728792003956564819967n,
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
    )
  })

  it("min", () => {
    tester(
      -57896044618658097711785492504343953926634992332820282019728792003956564819968n,
      "0x0000000000000000000000000000000000000000000000000000000000000080",
    )
  })
})
