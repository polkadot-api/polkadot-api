import { SMapEnc, SMapDec, Str, VectorEnc, VectorDec } from "../"
import { testCodec } from "../test-utils"
import { createCodec } from "../utils"

const tester = testCodec(
  createCodec(
    SMapEnc(Str.enc, VectorEnc(Str.enc)),
    SMapDec(Str.dec, VectorDec(Str.dec)),
  ),
)

describe("SMap", () => {
  it("works", () => {
    tester(
      new Map([["foo", ["foo1", "foo2"]]]),
      "0x040c666f6f0810666f6f3110666f6f32",
    )
  })
})
