import { isCompatible, mapLookupToTypedef } from "@/index"
import { LookupEntry, Var } from "@polkadot-api/metadata-builders"
import { describe, expect, it } from "vitest"

describe("isCompatible", () => {
  const lookup: LookupEntry[] = []
  const addEntry = (entry: Var) => {
    const id = lookup.length
    const result: LookupEntry = {
      ...entry,
      id,
    }
    lookup.push(result)
    return result
  }
  const strValue = addEntry({
    type: "primitive",
    value: "str",
  })
  const u32Value = addEntry({
    type: "primitive",
    value: "u32",
  })
  const optionalValue = addEntry({
    type: "option",
    value: strValue,
  })
  const unchangedValue = addEntry({
    innerDocs: {},
    type: "struct",
    value: {
      foo: strValue,
      optional: optionalValue,
    },
  })
  const changedEnum = addEntry({
    innerDocs: {},
    type: "enum",
    value: {
      unchanged: {
        type: "lookupEntry",
        idx: 0,
        value: unchangedValue,
      },
      // Imagine previously this was changed: u128
      changed: {
        type: "lookupEntry",
        idx: 1,
        value: u32Value,
      },
    },
  })

  it("marks an enum as compatible if the value of the variant is compatible", () => {
    const value = {
      type: "unchanged",
      value: {
        foo: "foo",
      },
    }

    expect(
      isCompatible(value, mapLookupToTypedef(changedEnum), (id) =>
        mapLookupToTypedef(lookup[id]),
      ),
    ).toBe(true)
  })

  it("marks an enum as incompatible if the value of the variant has changed", () => {
    const value = {
      type: "changed",
      value: 123n,
    }

    expect(
      isCompatible(value, mapLookupToTypedef(changedEnum), (id) =>
        mapLookupToTypedef(lookup[id]),
      ),
    ).toBe(false)
  })

  it("marks an enum as incompatible if the variant was removed", () => {
    const value = {
      type: "removed",
      value: 123n,
    }

    expect(
      isCompatible(value, mapLookupToTypedef(changedEnum), (id) =>
        mapLookupToTypedef(lookup[id]),
      ),
    ).toBe(false)
  })

  it("marks a struct as compatible if an optional element was added", () => {
    const value = {
      foo: "foo",
    }

    expect(
      isCompatible(value, mapLookupToTypedef(unchangedValue), (id) =>
        mapLookupToTypedef(lookup[id]),
      ),
    ).toBe(true)
  })

  it("marks a struct as compatible if an element was removed", () => {
    const value = {
      foo: "foo",
      removed: 123,
    }

    expect(
      isCompatible(value, mapLookupToTypedef(unchangedValue), (id) =>
        mapLookupToTypedef(lookup[id]),
      ),
    ).toBe(true)
  })

  it("marks a struct as incompatible if a mandatory element was added", () => {
    const value = {
      removed: 123,
    }

    expect(
      isCompatible(value, mapLookupToTypedef(unchangedValue), (id) =>
        mapLookupToTypedef(lookup[id]),
      ),
    ).toBe(false)
  })
})
