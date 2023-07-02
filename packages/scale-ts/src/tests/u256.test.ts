import { u256 } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(u256)

describe("u128", () => {
  it("zero", () => {
    tester(
      0n,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    )
  })

  it("max", () => {
    tester(
      115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    )
  })
})
