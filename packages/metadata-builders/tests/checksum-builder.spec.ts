import ksm from "./ksm.json"
import { V14Lookup } from "@polkadot-api/substrate-bindings"
import { expect, describe, it } from "vitest"
import { getChecksumBuilder } from "@/."

describe("getChecksumBuilder snapshots", () => {
  const builder = getChecksumBuilder(ksm as any)
  it("batched call", () => {
    const result = builder.buildCall("Utility", "batch")
    expect(result).toMatchSnapshot()
  })

  it("felloship referenda submit", () => {
    const result = builder.buildCall("FellowshipReferenda", "submit")
    expect(result).toMatchSnapshot()
  })
})

describe("buildDefinition properties", () => {
  const builder = getChecksumBuilder({ lookup } as any)

  const expectEqual = (
    a: V14Lookup[number]["def"],
    b: V14Lookup[number]["def"],
  ) => {
    const aId = lookupPush(a)
    const bId = lookupPush(b)
    expect(builder.buildDefinition(aId)).toEqual(builder.buildDefinition(bId))
  }
  const expectNotEqual = (
    a: V14Lookup[number]["def"],
    b: V14Lookup[number]["def"],
  ) => {
    const aId = lookupPush(a)
    const bId = lookupPush(b)
    expect(builder.buildDefinition(aId)).not.toEqual(
      builder.buildDefinition(bId),
    )
  }

  it("generates the same checksum if the runtime type is equal", () => {
    expect(builder.buildDefinition(knownIds.u8)).toEqual(
      builder.buildDefinition(knownIds.u32),
    )

    const compactId = lookupPush({ tag: "compact", value: knownIds.u8 })
    expect(builder.buildDefinition(compactId)).toEqual(
      builder.buildDefinition(knownIds.u32),
    )
  })

  it("generates a different checksum if the runtime type is different, for a numeric primitive", () => {
    expect(builder.buildDefinition(knownIds.u32)).not.toEqual(
      builder.buildDefinition(knownIds.u64),
    )

    const compactId = lookupPush({ tag: "compact", value: knownIds.u64 })
    expect(builder.buildDefinition(knownIds.u32)).not.toEqual(
      builder.buildDefinition(compactId),
    )
  })

  it("distinguishes between sequence and arrays", () => {
    expectNotEqual(
      { tag: "sequence", value: 0 },
      { tag: "array", value: { len: 3, type: 0 } },
    )
  })

  it("distinguishes between arrays of different length", () => {
    expectNotEqual(
      { tag: "array", value: { len: 3, type: 0 } },
      { tag: "array", value: { len: 5, type: 0 } },
    )
  })

  it("distinguishes between arrays of different type", () => {
    expectNotEqual(
      { tag: "array", value: { len: 3, type: 0 } },
      { tag: "array", value: { len: 3, type: 2 } },
    )
  })

  it("gives the same checksum for flipped tuple parameters if they have the same type", () => {
    expectEqual(
      { tag: "tuple", value: [0, 1, 2] },
      { tag: "tuple", value: [1, 0, 2] },
    )
  })

  it("distinguishes flipped tuple parameters across multiple types", () => {
    expectNotEqual(
      { tag: "tuple", value: [0, 1, 2] },
      { tag: "tuple", value: [0, 2, 1] },
    )
  })

  it("gives the same checksum for reordered struct types", () => {
    expectEqual(
      {
        tag: "composite",
        value: [
          createCompositeEntry({
            name: "foo",
            type: knownIds.u8,
          }),
          createCompositeEntry({
            name: "bar",
            type: knownIds.u64,
          }),
        ],
      },
      {
        tag: "composite",
        value: [
          createCompositeEntry({
            name: "bar",
            type: knownIds.u64,
          }),
          createCompositeEntry({
            name: "foo",
            type: knownIds.u8,
          }),
        ],
      },
    )
  })

  it.skip("gives a different checksum for reordered mixed tuple-struct types", () => {
    expectNotEqual(
      {
        tag: "composite",
        value: [
          createCompositeEntry({
            type: knownIds.u8,
          }),
          createCompositeEntry({
            name: "bar",
            type: knownIds.u64,
          }),
        ],
      },
      {
        tag: "composite",
        value: [
          createCompositeEntry({
            name: "bar",
            type: knownIds.u64,
          }),
          createCompositeEntry({
            type: knownIds.u8,
          }),
        ],
      },
    )
  })

  it("gives a different checksum for reordered tuple types", () => {
    expectNotEqual(
      {
        tag: "composite",
        value: [
          createCompositeEntry({
            type: knownIds.u8,
          }),
          createCompositeEntry({
            type: knownIds.u64,
          }),
        ],
      },
      {
        tag: "composite",
        value: [
          createCompositeEntry({
            type: knownIds.u64,
          }),
          createCompositeEntry({
            type: knownIds.u8,
          }),
        ],
      },
    )
  })
})

const createEntry = (
  id: number,
  def: V14Lookup[number]["def"],
): V14Lookup[number] => ({
  id,
  docs: [],
  path: [],
  params: [],
  def,
})

const knownIds = {
  u8: 0,
  u32: 1,
  u64: 2,
}

const lookup: V14Lookup = [
  createEntry(knownIds.u8, {
    tag: "primitive",
    value: { tag: "u8", value: undefined },
  }),
  createEntry(knownIds.u32, {
    tag: "primitive",
    value: { tag: "u32", value: undefined },
  }),
  createEntry(knownIds.u64, {
    tag: "primitive",
    value: { tag: "u64", value: undefined },
  }),
]

const lookupPush = (def: V14Lookup[number]["def"]) => {
  const id = lookup.length
  lookup.push(createEntry(id, def))
  return id
}

const createCompositeEntry = <
  T extends Partial<{
    name: string | undefined
    type: number
    typeName: string | undefined
    docs: string[]
  }>,
>(
  value: T,
) => ({
  docs: [],
  typeName: "",
  name: undefined,
  ...value,
})
