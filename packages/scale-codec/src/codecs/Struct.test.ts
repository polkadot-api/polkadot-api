import {
  Struct,
  StructEnc,
  StructDec,
  Enum,
  Bool,
  Str,
  U32,
  Vector,
  VectorEnc,
  VectorDec,
  EnumDec,
  EnumEnc,
  createCodec,
} from "../"
import { testCodec } from "../test-utils"

describe("Struct", () => {
  it("encodes and decodes complex Objects", () => {
    const encoder = StructEnc({
      id: U32.enc,
      name: Str.enc,
      friendIds: VectorEnc(U32.enc),
      event: EnumEnc({
        one: Str.enc,
        many: VectorEnc(Str.enc),
        allOrNothing: Bool.enc,
      }),
    })

    const decoder = StructDec({
      id: U32.dec,
      name: Str.dec,
      friendIds: VectorDec(U32.dec),
      event: EnumDec({
        one: Str.dec,
        many: VectorDec(Str.dec),
        allOrNothing: Bool.dec,
      }),
    })

    const tester = testCodec(createCodec(encoder, decoder))

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
      id: U32,
      name: Str,
      friendIds: Vector(U32),
      event: Enum({
        one: Str,
        many: Vector(Str),
        allOrNothing: Bool,
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
