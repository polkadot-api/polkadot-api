import { string, SetCodec } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(SetCodec(string))

describe("SetCodec", () => {
  it("works", () => {
    tester(new Set(["foo1", "foo2"]), "0x0810666f6f3110666f6f32")
  })
})
