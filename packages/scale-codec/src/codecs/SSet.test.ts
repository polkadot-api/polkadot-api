import { Str, SSetDec, SSetEnc } from "../"
import { testCodec } from "../test-utils"
import { createCodec } from "../utils"

const tester = testCodec(createCodec(SSetEnc(Str.enc), SSetDec(Str.dec)))

describe("SSet", () => {
  it("works", () => {
    tester(new Set(["foo1", "foo2"]), "0x0810666f6f3110666f6f32")
  })
})
