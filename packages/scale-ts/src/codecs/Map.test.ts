import { MapCodec, str, Vector } from "../"
import { testCodec } from "../test-utils"

const tester = testCodec(MapCodec(str, Vector(str)))

describe("MapCodec", () => {
  it("works", () => {
    tester(
      new Map([["foo", ["foo1", "foo2"]]]),
      "0x040c666f6f0810666f6f3110666f6f32",
    )
  })
})
