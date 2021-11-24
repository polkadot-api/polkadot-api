import { Struct, boolean, string, u32, Vector, Enum } from "../"
import { testCodec } from "../test-utils"

describe("Struct", () => {
  it("encodes and decodes complex Objects", () => {
    const tester = testCodec(
      Struct({
        id: u32,
        name: string,
        friendIds: Vector(u32),
        event: Enum({
          one: string,
          many: Vector(string),
          allOrNothing: boolean,
        }),
      }),
    )

    tester(
      {
        id: 100,
        name: "Some name",
        friendIds: [1, 2, 3],
        event: { tag: "allOrNothing" as const, value: true },
      },
      "0x6400000024536f6d65206e616d650c0100000002000000030000000201",
    )
  })

  it("encodes Objects correctly, even when the key order is different", () => {
    const decoder = Struct({
      id: u32,
      name: string,
      friendIds: Vector(u32),
      event: Enum({
        one: string,
        many: Vector(string),
        allOrNothing: boolean,
      }),
    })

    const tester = testCodec(decoder)

    tester(
      {
        event: { tag: "allOrNothing" as const, value: true },
        friendIds: [1, 2, 3],
        name: "Some name",
        id: 100,
      },
      "0x6400000024536f6d65206e616d650c0100000002000000030000000201",
    )
  })
})
