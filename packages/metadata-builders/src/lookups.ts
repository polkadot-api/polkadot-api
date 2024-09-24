import type {
  StringRecord,
  V14,
  V14Lookup,
  V15,
} from "@polkadot-api/substrate-bindings"

export type MetadataPrimitives =
  | "bool"
  | "char"
  | "str"
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "u128"
  | "u256"
  | "i8"
  | "i16"
  | "i32"
  | "i64"
  | "i128"
  | "i256"

export type PrimitiveVar = {
  type: "primitive"
  value: MetadataPrimitives
}

export type VoidVar = { type: "void" }
export type CompactVar = { type: "compact"; isBig: boolean | null }
export type BitSequenceVar = { type: "bitSequence" }
export type AccountId32 = { type: "AccountId32" }
export type AccountId20 = { type: "AccountId20" }
export type TerminalVar =
  | PrimitiveVar
  | VoidVar
  | CompactVar
  | BitSequenceVar
  | AccountId32
  | AccountId20

/* Array-like vars:
 * - TupleVar: Mixed types, fixed length
 * - Sequence: One type, arbitrary length
 * - Array: One type, fixed length
 */
export type TupleVar = {
  type: "tuple"
  value: LookupEntry[]
  innerDocs: Array<string[]>
}
export type StructVar = {
  type: "struct"
  value: StringRecord<LookupEntry>
  innerDocs: StringRecord<string[]>
}
export type EnumVar = {
  type: "enum"
  value: StringRecord<
    (
      | { type: "lookupEntry"; value: LookupEntry }
      | VoidVar
      | TupleVar
      | StructVar
      | ArrayVar
    ) & { idx: number }
  >
  innerDocs: StringRecord<string[]>
  byteLength?: number
}
export type OptionVar = {
  type: "option"
  value: LookupEntry
}
export type ResultVar = {
  type: "result"
  value: { ok: LookupEntry; ko: LookupEntry }
}
export type SequenceVar = {
  type: "sequence"
  value: LookupEntry
}
export type ArrayVar = {
  type: "array"
  value: LookupEntry
  len: number
}

export type ComposedVar =
  | TupleVar
  | StructVar
  | SequenceVar
  | ArrayVar
  | OptionVar
  | ResultVar
  | EnumVar

export type Var = TerminalVar | ComposedVar

export type LookupEntry = {
  id: number
} & Var

const isBytes = (value: LookupEntry, nBytes: number) =>
  value.type === "array" &&
  value.len === nBytes &&
  value.value.type === "primitive" &&
  value.value.value === "u8"

const _void: VoidVar = { type: "void" }

export interface MetadataLookup {
  (id: number): LookupEntry
  metadata: V14 | V15
  call: number | null
}

const _denormalizeLookup = (
  lookupData: V14Lookup,
  customMap: (value: V14Lookup[number]) => Var | null = () => null,
): ((id: number) => LookupEntry) => {
  const lookups = new Map<number, LookupEntry>()
  const from = new Set<number>()

  const withCache = (
    fn: (id: number) => Var,
  ): ((id: number) => LookupEntry) => {
    return (id) => {
      let entry = lookups.get(id)

      if (entry) return entry

      if (from.has(id)) {
        const entry = {
          id,
        } as LookupEntry

        lookups.set(id, entry)
        return entry
      }

      from.add(id)
      const value = fn(id)
      entry = lookups.get(id)

      if (entry) {
        Object.assign(entry, value)
      } else {
        entry = {
          id,
          ...value,
        }
        lookups.set(id, entry!)
      }
      from.delete(id)
      return entry
    }
  }

  let isAccountId32SearchOn = true
  let isAccountId20SearchOn = true
  const getLookupEntryDef = withCache((id): Var => {
    const custom = customMap(lookupData[id])
    if (custom) return custom

    const { def, path, params } = lookupData[id]

    if (def.tag === "composite") {
      if (def.value.length === 0) return _void

      // used to be a "pointer"
      if (def.value.length === 1) {
        const inner = getLookupEntryDef(def.value[0].type as number)

        if (
          isAccountId32SearchOn &&
          path.at(-1) === "AccountId32" &&
          isBytes(inner, 32)
        ) {
          isAccountId32SearchOn = false
          return { type: "AccountId32" }
        }

        if (
          isAccountId20SearchOn &&
          path.at(-1) === "AccountId20" &&
          isBytes(inner, 20)
        ) {
          isAccountId20SearchOn = false
          return { type: "AccountId20" }
        }

        return inner
      }

      return getComplexVar(def.value)
    }

    if (def.tag === "variant") {
      if (
        path.length === 1 &&
        path[0] === "Option" &&
        params.length === 1 &&
        params[0].name === "T"
      ) {
        const value = getLookupEntryDef(params[0].type!)
        return value.type === "void"
          ? // Option<void> would return a Codec<undefined> which makes no sense
            // Therefore, we better treat it as a bool
            { type: "primitive", value: "bool" }
          : {
              type: "option",
              value,
            }
      }

      if (
        path.length === 1 &&
        path[0] === "Result" &&
        params.length === 2 &&
        params[0].name === "T" &&
        params[1].name === "E"
      ) {
        return {
          type: "result",
          value: {
            ok: getLookupEntryDef(params[0].type as number),
            ko: getLookupEntryDef(params[1].type as number),
          },
        }
      }
      if (def.value.length === 0) return _void

      const enumValue: StringRecord<EnumVar["value"][keyof EnumVar["value"]]> =
        {}
      const enumDocs: StringRecord<string[]> = {}

      def.value.forEach((x) => {
        const key = x.name
        enumDocs[key] = x.docs

        if (x.fields.length === 0) {
          enumValue[key] = { ..._void, idx: x.index }
          return
        }

        if (x.fields.length === 1 && !x.fields[0].name) {
          enumValue[key] = {
            type: "lookupEntry",
            value: getLookupEntryDef(x.fields[0].type),
            idx: x.index,
          }
          return
        }

        enumValue[key] = { ...getComplexVar(x.fields), idx: x.index }
      })

      return {
        type: "enum",
        value: enumValue,
        innerDocs: enumDocs,
      }
    }

    if (def.tag === "sequence")
      return {
        type: "sequence",
        value: getLookupEntryDef(def.value as number),
      }

    if (def.tag === "array") {
      const { len } = def.value
      const value = getLookupEntryDef(def.value.type)

      return !len || value.type === "void"
        ? _void
        : len > 1
          ? {
              type: "array",
              value,
              len: def.value.len,
            }
          : value
    }

    if (def.tag === "tuple") {
      if (def.value.length === 0) return _void

      return def.value.length > 1
        ? getArrayOrTuple(
            def.value.map((x) => getLookupEntryDef(x as number)),
            def.value.map((x) => lookupData[x].docs),
          )
        : getLookupEntryDef(def.value[0] as number) // use to be a "pointer"
    }

    if (def.tag === "primitive") {
      return {
        type: "primitive",
        value: def.value.tag,
      }
    }

    if (def.tag === "compact") {
      const translated = getLookupEntryDef(def.value) as PrimitiveVar | VoidVar
      if (translated.type === "void") return { type: "compact", isBig: null }

      const isBig = Number(translated.value.slice(1)) > 32

      return {
        type: "compact",
        isBig,
      }
    }

    // bitSequence
    return {
      type: def.tag,
    }
  })

  const getComplexVar = (
    input: Array<{ type: number; name?: string; docs: string[] }>,
  ): TupleVar | StructVar | ArrayVar | VoidVar => {
    let allKey = true

    const values: Record<string | number, LookupEntry> = {}
    const innerDocs: Record<string | number, string[]> = {}

    input.forEach((x, idx) => {
      allKey = allKey && !!x.name
      const key = x.name || idx
      const value = getLookupEntryDef(x.type as number)
      if (value.type !== "void") {
        values[key] = value
        innerDocs[key] = x.docs
      }
    })
    return allKey
      ? {
          type: "struct",
          value: values as StringRecord<LookupEntry>,
          innerDocs: innerDocs as StringRecord<string[]>,
        }
      : getArrayOrTuple(Object.values(values), Object.values(innerDocs))
  }

  const getArrayOrTuple = (
    values: Array<LookupEntry>,
    innerDocs: Array<string[]>,
  ): TupleVar | ArrayVar | VoidVar => {
    if (
      values.every((v) => v.id === values[0].id) &&
      innerDocs.every((doc) => !doc.length)
    ) {
      const [value] = values
      return value.type === "void"
        ? _void
        : {
            type: "array",
            value: values[0],
            len: values.length,
          }
    }
    return {
      type: "tuple",
      value: values,
      innerDocs: innerDocs,
    }
  }

  return getLookupEntryDef
}

export const denormalizeLookup = (lookupData: V14Lookup) =>
  _denormalizeLookup(lookupData)

export const getLookupFn = (metadata: V14 | V15): MetadataLookup => {
  const getLookupEntryDef = _denormalizeLookup(metadata.lookup, ({ def }) => {
    if (def.tag === "composite") {
      const moduleErrorLength = getModuleErrorLength(def)
      if (moduleErrorLength) {
        return {
          type: "enum",
          innerDocs: {},
          value: Object.fromEntries(
            metadata.pallets.map((p) => [
              p.name,
              p.errors == null
                ? { ..._void, idx: p.index }
                : {
                    type: "lookupEntry" as const,
                    value: getLookupEntryDef(p.errors),
                    idx: p.index,
                  },
            ]),
          ) as StringRecord<
            (
              | VoidVar
              | {
                  type: "lookupEntry"
                  value: LookupEntry
                }
            ) & { idx: number }
          >,
          byteLength: moduleErrorLength,
        }
      }
    }
    return null
  })

  function getModuleErrorLength(def: {
    tag: "composite"
    value: {
      name: string | undefined
      type: number
      typeName: string | undefined
      docs: string[]
    }[]
  }) {
    const preChecks =
      def.value.length === 2 &&
      def.value[0].name === "index" &&
      def.value[1].name === "error"
    if (!preChecks) return null

    const index = getLookupEntryDef(def.value[0].type)
    const error = getLookupEntryDef(def.value[1].type)

    return index.type === "primitive" &&
      index.value === "u8" &&
      error.type === "array" &&
      error.value.type === "primitive" &&
      error.value.value === "u8"
      ? 1 + error.len
      : null
  }

  const getCall = () => {
    if ("outerEnums" in metadata) {
      return metadata.outerEnums.call
    }

    const extrinsic = metadata.lookup[metadata.extrinsic?.type]
    const call = extrinsic?.params.find((p) => p.name === "Call")

    return call?.type ?? null
  }

  return Object.assign(getLookupEntryDef, { metadata, call: getCall() })
}
