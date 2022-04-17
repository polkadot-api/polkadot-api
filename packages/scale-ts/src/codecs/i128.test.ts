import { i128 } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(i128)

describe("i128", () => {
  it("zero", () => {
    tester(0n, "0x00000000000000000000000000000000")
    expect(
      i128.dec(
        new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]),
      ),
    ).toEqual(0n)
    expect(
      i128.dec(
        new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]).buffer,
      ),
    ).toEqual(0n)
  })

  it("-1n", () => {
    tester(-1n, "0xffffffffffffffffffffffffffffffff")
  })

  it("works", () => {
    tester(
      -18676936063680574795862633153229949450n,
      "0xf6f5f4f3f2f1f0f9f8f7f6f5f4f3f2f1",
    )
  })

  it("max", () => {
    tester(
      21267647932558653966460912964485513215n,
      "0xffffffffffffffffffffffffffffff0f",
    )
  })

  it("min", () => {
    tester(
      -21267647932558653966460912964485513216n,
      "0x000000000000000000000000000000f0",
    )
  })
})
