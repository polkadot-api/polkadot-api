import type { StringRecord, V14Lookup } from "@polkadot-api/substrate-bindings"

export type VoidVar = { type: "primitive"; value: "_void" }
const voidVar: VoidVar = { type: "primitive", value: "_void" }

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

export type PrimitiveVar =
  | {
      type: "primitive"
      value: MetadataPrimitives
    }
  | VoidVar

export type CompactVar = { type: "compact"; isBig: boolean }
export type BitSequenceVar = { type: "bitSequence" }
export type TerminalVar = PrimitiveVar | CompactVar | BitSequenceVar

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
  value: StringRecord<(TupleVar | StructVar | VoidVar) & { idx: number }>
  innerDocs: StringRecord<string[]>
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

export const getLookupFn = (lookupData: V14Lookup) => {
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

  const getLookupEntryDef = withCache((id): Var => {
    const { def, path, params } = lookupData[id]

    if (def.tag === "composite") {
      if (def.value.length === 0) return voidVar

      // used to be a "pointer"
      if (def.value.length === 1)
        return getLookupEntryDef(def.value[0].type as number)

      let allKey = true

      const values: Record<string | number, LookupEntry> = {}
      const innerDocs: Record<string | number, string[]> = {}
      def.value.forEach((x, idx) => {
        allKey = allKey && !!x.name
        const key = x.name || idx
        values[key] = getLookupEntryDef(x.type)
        innerDocs[key] = x.docs
      })

      return allKey
        ? {
            type: "struct",
            value: values as StringRecord<LookupEntry>,
            innerDocs: innerDocs as StringRecord<string[]>,
          }
        : {
            type: "tuple",
            value: Object.values(values),
            innerDocs: Object.values(innerDocs),
          }
    }

    if (def.tag === "variant") {
      if (
        path.length === 1 &&
        path[0] === "Option" &&
        params.length === 1 &&
        params[0].name === "T"
      ) {
        return {
          type: "option",
          value: getLookupEntryDef(params[0].type as number),
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
      if (def.value.length === 0) return voidVar

      const enumValue: StringRecord<EnumVar["value"][keyof EnumVar["value"]]> =
        {}
      const enumDocs: StringRecord<string[]> = {}

      def.value.forEach((x) => {
        const key = x.name
        enumDocs[key] = x.docs

        if (x.fields.length === 0) {
          enumValue[key] = { ...voidVar, idx: x.index }
          return
        }

        let allKey = true

        const values: Record<string | number, LookupEntry> = {}
        const innerDocs: Record<string | number, string[]> = {}

        x.fields.forEach((x, idx) => {
          allKey = allKey && !!x.name
          const key = x.name || idx
          values[key] = getLookupEntryDef(x.type as number)
          innerDocs[key] = x.docs
        })

        enumValue[key] = allKey
          ? {
              type: "struct",
              value: values as StringRecord<LookupEntry>,
              innerDocs: innerDocs as StringRecord<string[]>,
              idx: x.index,
            }
          : {
              type: "tuple",
              value: Object.values(values),
              innerDocs: Object.values(innerDocs),
              idx: x.index,
            }
      })

      return {
        type: "enum",
        value: enumValue,
        innerDocs: enumDocs,
      }
    }

    if (def.tag === "sequence") {
      const value = getLookupEntryDef(def.value as number)
      return {
        type: "sequence",
        value,
      }
    }

    if (def.tag === "array") {
      const value = getLookupEntryDef(def.value.type as number)
      return {
        type: "array",
        value,
        len: def.value.len,
      }
    }

    if (def.tag === "tuple") {
      if (def.value.length === 0) return voidVar

      // use to be a "pointer"
      if (def.value.length === 1)
        return getLookupEntryDef(def.value[0] as number)

      const value = def.value.map((x) => getLookupEntryDef(x as number))
      const innerDocs = def.value.map((x) => lookupData[x].docs)

      return {
        type: "tuple",
        value,
        innerDocs,
      }
    }

    if (def.tag === "primitive") {
      return {
        type: "primitive",
        value: def.value.tag,
      }
    }

    if (def.tag === "compact") {
      const translated = getLookupEntryDef(def.value as number) as PrimitiveVar
      const isBig = Number(translated.value.slice(1)) > 32

      return {
        type: "compact",
        isBig,
      }
    }

    if (def.tag === "bitSequence") {
      return { type: "bitSequence" }
    }

    // historicMetaCompat
    const value = def.value as any
    return {
      type: "primitive",
      value,
    }
  })

  return getLookupEntryDef
}
