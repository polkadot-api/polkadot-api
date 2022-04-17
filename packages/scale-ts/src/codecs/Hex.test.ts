import { Hex } from "../"
import { testCodec } from "../test-utils"

describe("Hex", () => {
  it("works", () => {
    const tester = testCodec(Hex(3))
    tester("0x000fff", "0x000fff")

    const codec = Hex(2)

    expect(codec[0]("0x1234")).toEqual(new Uint8Array([18, 52]))
    expect(codec[1]("0x12345678")).toEqual("0x1234")
    expect(codec[1](new Uint8Array([18, 52, 34, 23]))).toEqual("0x1234")
  })

  it("greedy", () => {
    const codec = Hex(Infinity)
    expect(codec[0]("0x12341234")).toEqual(new Uint8Array([18, 52, 18, 52]))
    expect(codec[0]("0x112341234")).toEqual(new Uint8Array([1, 18, 52, 18, 52]))

    expect(codec[1]("0x000fff01")).toEqual("0x000fff01")
  })
})
