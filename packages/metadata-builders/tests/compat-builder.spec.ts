import {
  isCompatible,
  isStaticCompatible,
  mapLookupToTypedef,
} from "@/compat-builder"
import { LookupEntry, Var } from "@/lookups"
import { describe, it, expect } from "vitest"

describe("Compat builder isCompatible", () => {
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

describe("Compat builder isStaticCompatible", () => {
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
  const u128Value = addEntry({
    type: "primitive",
    value: "u128",
  })
  const optionalValue = addEntry({
    type: "option",
    value: strValue,
  })
  const structValue = addEntry({
    innerDocs: {},
    type: "struct",
    value: {
      foo: strValue,
      optional: optionalValue,
    },
  })
  const originalEnum = addEntry({
    innerDocs: {},
    type: "enum",
    value: {
      unchanged: {
        type: "lookupEntry",
        idx: 0,
        value: structValue,
      },
      changed: {
        type: "lookupEntry",
        idx: 1,
        value: u32Value,
      },
    },
  })
  const modifiedEnum = addEntry({
    innerDocs: {},
    type: "enum",
    value: {
      unchanged: {
        type: "lookupEntry",
        idx: 0,
        value: structValue,
      },
      changed: {
        type: "lookupEntry",
        idx: 1,
        value: u128Value,
      },
      added: {
        type: "array",
        idx: 2,
        len: 3,
        value: u32Value,
      },
    },
  })
  const getNode = (id: number) => mapLookupToTypedef(lookup[id])

  it("marks an enum as partially compatible if one of the variants became incompatible", () => {
    expect(
      isStaticCompatible(
        mapLookupToTypedef(originalEnum),
        getNode,
        mapLookupToTypedef(modifiedEnum),
        getNode,
        new Map(),
      ),
    ).toBe("partially")
  })

  it("marks an enum as compatible if it didn't change", () => {
    expect(
      isStaticCompatible(
        mapLookupToTypedef(originalEnum),
        getNode,
        mapLookupToTypedef(originalEnum),
        getNode,
        new Map(),
      ),
    ).toBe(true)
  })

  it("marks an enum as incompatible if all of the branches are incompatible", () => {
    const modifiedEnum = addEntry({
      type: "enum",
      value: {
        changed: {
          type: "lookupEntry",
          idx: 1,
          value: u128Value,
        },
      },
      innerDocs: {},
    })
    expect(
      isStaticCompatible(
        mapLookupToTypedef(originalEnum),
        getNode,
        mapLookupToTypedef(modifiedEnum),
        getNode,
        new Map(),
      ),
    ).toBe(false)
  })

  it("marks a struct as incompatible if a new property was added", () => {
    const modifiedStruct = addEntry({
      innerDocs: {},
      type: "struct",
      value: {
        foo: strValue,
        optional: optionalValue,
        newProp: u128Value,
      },
    })
    expect(
      isStaticCompatible(
        mapLookupToTypedef(structValue),
        getNode,
        mapLookupToTypedef(modifiedStruct),
        getNode,
        new Map(),
      ),
    ).toBe(false)
  })

  it("marks a struct as partially compatible if an optional property was made mandatory", () => {
    const modifiedStruct = addEntry({
      innerDocs: {},
      type: "struct",
      value: {
        foo: strValue,
        optional: strValue,
      },
    })
    expect(
      isStaticCompatible(
        mapLookupToTypedef(structValue),
        getNode,
        mapLookupToTypedef(modifiedStruct),
        getNode,
        new Map(),
      ),
    ).toBe("partially")
  })

  it("marks a struct as compatible if a property was removed", () => {
    const modifiedStruct = addEntry({
      innerDocs: {},
      type: "struct",
      value: {
        optional: optionalValue,
      },
    })
    expect(
      isStaticCompatible(
        mapLookupToTypedef(structValue),
        getNode,
        mapLookupToTypedef(modifiedStruct),
        getNode,
        new Map(),
      ),
    ).toBe(true)
  })
})
