import { u128 } from "../"
import { testCodec } from "./test-utils"

const tester = testCodec(u128)

describe("u128", () => {
  it("zero", () => {
    tester(0n, "0x00000000000000000000000000000000")
    expect(
      u128.dec(
        new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      ),
    ).toEqual(0n)
    expect(
      u128.dec(
        new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).buffer,
      ),
    ).toEqual(0n)
  })

  it("works", () => {
    tester(
      340282366920938463190132210839945477888n,
      "0x00ffffffffffff2ff1ffffffffffffff",
    )
  })

  it("max", () => {
    tester(
      340282366920938463463374607431768211455n,
      "0xffffffffffffffffffffffffffffffff",
    )
  })
})
