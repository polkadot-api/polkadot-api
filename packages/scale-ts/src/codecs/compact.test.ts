import { compact } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(compact)

describe("compact", () => {
  it("unsigned interger 0", () => {
    tester(0, "0x00")
  })

  it("unsigned interger 1", () => {
    tester(1, "0x04")
  })

  it("unsigned interger 42", () => {
    tester(42, "0xa8")
  })

  it("unsigned interger 69", () => {
    tester(69, "0x1501")
  })

  it("decodes 65535 [four-byte mode]", (): void => {
    tester(65535, "0xfeff0300")
  })

  it("BigInt 100000000000000 [big integer mode]", (): void => {
    tester(BigInt(100000000000000), "0x0b00407a10f35a")
  })

  it("throws when trying to encode a negative number", () => {
    const [encoder] = compact
    expect(() => encoder(-1)).toThrow()
  })
})
