import type { StringRecord, V14Lookup } from "@unstoppablejs/substrate-bindings"

export type VoidVar = { type: "primitive"; value: "_void"; shape: "_void" }
const voidVar: VoidVar = { type: "primitive", value: "_void", shape: "_void" }

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
      shape: MetadataPrimitives
    }
  | VoidVar

export type CompactVar = { type: "compact"; isBig: boolean; shape: string }
export type BitSequenceVar = { type: "bitSequence"; shape: string }
export type TerminalVar = PrimitiveVar | CompactVar | BitSequenceVar

export type TupleVar = { type: "tuple"; value: LookupEntry[]; shape: string }
export type StructVar = {
  type: "struct"
  value: StringRecord<LookupEntry>
  shape: string
}
export type EnumVar = {
  type: "enum"
  value: StringRecord<(TupleVar | StructVar | VoidVar) & { idx: number }>
  shape: string
}
export type SequenceVar = {
  type: "sequence"
  value: LookupEntry
  shape: string
}
export type ArrayVar = {
  type: "array"
  value: LookupEntry
  len: number
  shape: string
}

export type ComposedVar =
  | TupleVar
  | StructVar
  | SequenceVar
  | ArrayVar
  | EnumVar

export type Var = TerminalVar | ComposedVar

export type LookupEntry = {
  id: number
} & Var

export const getLookupFn = (lookupData: V14Lookup) => {
  const codecs = new Map<number, LookupEntry>()
  const from = new Set<number>()

  const withCache = (
    fn: (id: number) => Var,
  ): ((id: number) => LookupEntry) => {
    return (id) => {
      let entry = codecs.get(id)

      if (entry) return entry

      if (from.has(id)) {
        const entry = {
          id,
        } as LookupEntry

        codecs.set(id, entry)
        return entry
      }

      from.add(id)
      const value = fn(id)
      entry = codecs.get(id)

      if (entry) {
        Object.assign(entry, value)
      } else {
        entry = {
          id,
          ...value,
        }
        codecs.set(id, entry!)
      }
      from.delete(id)
      return entry
    }
  }

  const getLookupEntryDef = withCache((id): Var => {
    const { def } = lookupData[id]

    if (def.tag === "composite") {
      if (def.value.length === 0) return voidVar

      // used to be a "pointer"
      if (def.value.length === 1)
        return getLookupEntryDef(def.value[0].type as number)

      let allKey = true
      const innerComp = def.value.map((x) => {
        const key = x.name
        allKey = allKey && !!key
        return { key, value: getLookupEntryDef(x.type as number) }
      })

      const innerValues = innerComp.map((x) => x.value)
      const innerShapes = innerComp.map((x) => x.value.shape)

      return allKey
        ? {
            type: "struct",
            value: Object.fromEntries(
              innerValues.map((value, idx) => [innerComp[idx].key, value]),
            ),
            shape: JSON.stringify(
              Object.fromEntries(
                innerShapes.map((shape, idx) => [innerComp[idx].key, shape]),
              ),
            ),
          }
        : {
            type: "tuple",
            value: innerValues,
            shape: JSON.stringify(innerShapes),
          }
    }

    if (def.tag === "variant") {
      if (def.value.length === 0) return voidVar

      const parts = def.value.map(
        (x): [string, EnumVar["value"][keyof EnumVar["value"]]] => {
          const key = x.name
          if (x.fields.length === 0) {
            return [key, { ...voidVar, idx: x.index }]
          }

          let allKey = true
          const inner = x.fields.map((x) => {
            const key = x.name
            allKey = allKey && !!key
            return { key, value: getLookupEntryDef(x.type as number) }
          })

          if (allKey) {
            return [
              key,
              {
                type: "struct",
                value: Object.fromEntries(inner.map((x) => [x.key, x.value])),
                idx: x.index,
                shape: JSON.stringify(
                  Object.fromEntries(inner.map((x) => [x.key, x.value.shape])),
                ),
              },
            ]
          }

          return [
            key,
            {
              type: "tuple",
              value: inner.map((x) => x.value),
              idx: x.index,
              shape: JSON.stringify(inner.map((x) => x.value.shape)),
            },
          ]
        },
      )

      return {
        type: "enum",
        value: Object.fromEntries(parts) as StringRecord<
          EnumVar["value"][keyof EnumVar["value"]]
        >,
        shape: JSON.stringify(
          Object.fromEntries(parts.map(([key, val]) => [key, val.shape])),
        ),
      }
    }

    if (def.tag === "sequence") {
      const value = getLookupEntryDef(def.value as number)
      return {
        type: "sequence",
        value,
        shape: `Vector(${value.shape})`,
      }
    }

    if (def.tag === "array") {
      const value = getLookupEntryDef(def.value.type as number)
      return {
        type: "array",
        value,
        len: def.value.len,
        shape: `Vector(${(value.shape, def.value.len)})`,
      }
    }

    if (def.tag === "tuple") {
      if (def.value.length === 0) return voidVar

      // use to be a "pointer"
      if (def.value.length === 1)
        return getLookupEntryDef(def.value[0] as number)

      const value = def.value.map((x) => getLookupEntryDef(x as number))
      return {
        type: "tuple",
        value,
        shape: JSON.stringify(value.map((v) => v.shape)),
      }
    }

    if (def.tag === "primitive") {
      return { type: "primitive", value: def.value.tag, shape: def.value.tag }
    }

    if (def.tag === "compact") {
      const translated = getLookupEntryDef(def.value as number) as PrimitiveVar
      const isBig = Number(translated.value.slice(1)) > 32

      return { type: "compact", isBig, shape: `compact(${translated.shape})` }
    }

    if (def.tag === "bitSequence") {
      return { type: "bitSequence", shape: "bitSequence" }
    }

    // historicMetaCompat
    const value = def.value as any
    return { type: "primitive", value, shape: value }
  })

  return getLookupEntryDef
}
