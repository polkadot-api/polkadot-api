import ksm from "./ksm.json"
import { V14Lookup, V15 } from "@polkadot-api/substrate-bindings"
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

  it("gives the same result regardless of entry point", () => {
    const referenceBuilder = getChecksumBuilder(ksm as V15)
    ksm.lookup.map((x) => x.id).forEach(referenceBuilder.buildDefinition)

    ksm.lookup.forEach((x) => {
      const secondBuilder = getChecksumBuilder(ksm as V15)
      const referenceResult = referenceBuilder.buildDefinition(x.id)
      const secondResult = secondBuilder.buildDefinition(x.id)

      expect(referenceResult).toEqual(secondResult)
    })
  })

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

  it("gives the same checksum when there are circular references", () => {
    const aId = lookupPush({
      tag: "composite",
      value: [
        createCompositeEntry({
          name: "id",
          type: knownIds.u32,
        }),
        createCompositeEntry({
          name: "nextA",
          type: 0,
        }),
      ],
    })
    const optionId = lookupPush({
      tag: "variant",
      value: [
        {
          docs: [],
          index: 0,
          name: "Some",
          fields: [
            createCompositeEntry({
              type: aId,
            }),
          ],
        },
        {
          docs: [],
          index: 1,
          name: "None",
          fields: [],
        },
      ],
    })
    const aDef = lookup[aId].def
    if (aDef.tag === "composite") {
      aDef.value[1].type = optionId
    }

    const secondBuilder = getChecksumBuilder({ lookup } as any)

    const aChecksum = builder.buildDefinition(aId)
    const optionChecksum = builder.buildDefinition(optionId)

    const secondOptionChecksum = secondBuilder.buildDefinition(optionId)
    const secondAChecksum = secondBuilder.buildDefinition(aId)

    expect(aChecksum).toEqual(secondAChecksum)
    expect(optionChecksum).toEqual(secondOptionChecksum)
    expect(aChecksum).not.toEqual(optionChecksum)
  })

  it("gives the same checksum when there are circular references after multiple levels", () => {
    const aId = lookupPush({
      tag: "sequence",
      value: 0,
    })
    const bId = lookupPush({
      tag: "sequence",
      value: 0,
    })
    const cId = lookupPush({
      tag: "composite",
      value: [
        createCompositeEntry({
          name: "foo",
          type: 0,
        }),
        createCompositeEntry({
          name: "a",
          type: aId,
        }),
      ],
    })
    const dId = lookupPush({
      tag: "sequence",
      value: aId,
    })
    lookup[aId].def.value = bId
    lookup[bId].def.value = cId
    function perms(xs: number[]): number[][] {
      if (!xs.length) return [[]]
      return xs.flatMap((x) => {
        return perms(xs.filter((v) => v !== x)).map((vs) => [x, ...vs])
      })
    }

    const orderings = perms([aId, bId, cId, dId])
    const runOrdering = (ordering: number[]) => {
      const builder = getChecksumBuilder({ lookup } as any)
      return ordering
        .map((id) => [id, builder.buildDefinition(id)] as const)
        .sort(([a], [b]) => a - b)
    }

    const reference = runOrdering(orderings[0])

    orderings
      .slice(1)
      .forEach((ordering, i) =>
        expect(
          runOrdering(ordering),
          `checksum mismatch on case ${orderings[i + 1]}`,
        ).toEqual(reference),
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
