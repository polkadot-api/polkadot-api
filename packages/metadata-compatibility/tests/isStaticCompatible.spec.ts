import {
  CompatibilityLevel,
  isStaticCompatible,
  mapLookupToTypedef,
} from "@/index"
import { Change } from "@/isStaticCompatible"
import { LookupEntry, Var } from "@polkadot-api/metadata-builders"
import { describe, expect, it } from "vitest"

describe("isStaticCompatible", () => {
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

  describe("level", () => {
    it("marks an enum as partially compatible if one of the variants became incompatible", () => {
      expect(
        isStaticCompatible(
          mapLookupToTypedef(originalEnum),
          getNode,
          mapLookupToTypedef(modifiedEnum),
          getNode,
          new Map(),
        ).level,
      ).toBe(CompatibilityLevel.Partial)
    })

    it("marks an enum as compatible if it didn't change", () => {
      expect(
        isStaticCompatible(
          mapLookupToTypedef(originalEnum),
          getNode,
          mapLookupToTypedef(originalEnum),
          getNode,
          new Map(),
        ).level,
      ).toBe(CompatibilityLevel.Identical)
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
        ).level,
      ).toBe(CompatibilityLevel.Incompatible)
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
        ).level,
      ).toBe(CompatibilityLevel.Incompatible)
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
        ).level,
      ).toBe(CompatibilityLevel.Partial)
    })

    it("marks a struct as backwards compatible if a property was removed", () => {
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
        ).level,
      ).toBe(CompatibilityLevel.BackwardsCompatible)
    })
  })

  describe("changes", () => {
    it("enum with everything incompatible", () => {
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
        changesToMap(
          isStaticCompatible(
            mapLookupToTypedef(originalEnum),
            getNode,
            mapLookupToTypedef(modifiedEnum),
            getNode,
            new Map(),
          ).changes,
        ),
      ).toEqual({
        changed: {
          id: [u32Value.id, u128Value.id],
          level: CompatibilityLevel.Incompatible,
        },
        unchanged: {
          id: [structValue.id, null],
          level: CompatibilityLevel.Incompatible,
        },
      })
    })

    it("struct with a new property", () => {
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
        changesToMap(
          isStaticCompatible(
            mapLookupToTypedef(structValue),
            getNode,
            mapLookupToTypedef(modifiedStruct),
            getNode,
            new Map(),
          ).changes,
        ),
      ).toEqual({
        newProp: {
          id: [null, u128Value.id],
          level: CompatibilityLevel.Incompatible,
        },
      })
    })

    it("option of incompatible gives Partial as outer but Incompatible as inner", () => {
      const newOption = addEntry({
        type: "option",
        value: u128Value,
      })

      const result = isStaticCompatible(
        mapLookupToTypedef(optionalValue),
        getNode,
        mapLookupToTypedef(newOption),
        getNode,
        new Map(),
      )

      expect(result.level).toBe(CompatibilityLevel.Partial)
      expect(changesToMap(result.changes)).toEqual({
        some: {
          id: [strValue.id, u128Value.id],
          level: CompatibilityLevel.Incompatible,
        },
      })
    })
  })

  describe("deep", () => {
    it("returns every change even if it wouldn't be needed to get the compatibility level", () => {
      const newInnerStruct = addEntry({
        type: "struct",
        innerDocs: {},
        value: {
          foo: strValue,
          // partial change here
          optional: strValue,
        },
      })
      const oldStruct = addEntry({
        type: "struct",
        innerDocs: {},
        value: {
          incompatible: u32Value,
          partial: structValue,
        },
      })
      const newStruct = addEntry({
        type: "struct",
        innerDocs: {},
        value: {
          incompatible: u128Value,
          partial: newInnerStruct,
        },
      })
      const caché = new Map()
      const result = isStaticCompatible(
        mapLookupToTypedef(oldStruct),
        getNode,
        mapLookupToTypedef(newStruct),
        getNode,
        caché,
        true,
      )

      expect(result.level).toBe(CompatibilityLevel.Incompatible)
      expect(changesToMap(result.changes)).toEqual({
        incompatible: {
          id: [u32Value.id, u128Value.id],
          level: CompatibilityLevel.Incompatible,
        },
        partial: {
          id: [structValue.id, newInnerStruct.id],
          level: CompatibilityLevel.Partial,
        },
      })

      // And now we can look inside partial to see what has
      const partialResult = isStaticCompatible(
        mapLookupToTypedef(structValue),
        getNode,
        mapLookupToTypedef(newInnerStruct),
        getNode,
        caché,
        true,
      )
      expect(partialResult.level).toBe(CompatibilityLevel.Partial)
      expect(changesToMap(partialResult.changes)).toEqual({
        optional: {
          id: [optionalValue.id, strValue.id],
          level: CompatibilityLevel.Partial,
        },
      })
    })
  })
})

const changesToMap = (changes: Array<Change>) =>
  Object.fromEntries(changes.map(({ path, ...rest }) => [path, rest]))
