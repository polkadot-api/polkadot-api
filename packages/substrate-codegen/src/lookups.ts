import type { StringRecord, V14Lookup } from "@unstoppablejs/substrate-codecs"

export type PrimitiveVar = { type: "primitive"; value: string }
export type CompactVar = { type: "compact"; isBig: boolean }
export type BitSequenceVar = { type: "bitSequence" }
export type TerminalVar = PrimitiveVar | CompactVar | BitSequenceVar

export type TupleVar = { type: "tuple"; value: LookupEntry[] }
export type StructVar = { type: "struct"; value: StringRecord<LookupEntry> }
export type EnumVar = {
  type: "enum"
  value: StringRecord<
    (
      | TupleVar
      | StructVar
      | { type: "_void" }
      | { type: "codecEntry"; value: LookupEntry }
    ) & { idx: number }
  >
}
export type SequenceVar = { type: "sequence"; value: LookupEntry }
export type ArrayVar = { type: "array"; value: LookupEntry; len: number }

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

const toCamelCase = (...parts: string[]): string =>
  parts[0] +
  parts
    .slice(1)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")

export const getLookupFns = (lookupData: V14Lookup) => {
  const codecs = new Map<number, LookupEntry>()
  const from = new Set<number>()

  const getVarName = (idx: number, isCircular = false): string => {
    const {
      type: { path },
    } = lookupData[idx]
    const parts: string[] = path.length === 0 ? ["cdc" + idx] : ["c", ...path]

    if (isCircular) parts.unshift("circular")

    return toCamelCase(...parts)
  }

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

  const getLookupEntry = withCache((id): Var => {
    const {
      type: { def },
    } = lookupData[id]

    if (def.tag === "composite") {
      if (def.value.length === 0) return { type: "primitive", value: "_void" }

      // used to be a "pointer"
      if (def.value.length === 1)
        return getLookupEntry(def.value[0].type as number)

      let allKey = true
      const innerComp = def.value.map((x) => {
        const key = x.name
        allKey = allKey && !!key
        return { key, value: getLookupEntry(x.type as number) }
      })

      return allKey
        ? {
            type: "struct",
            value: Object.fromEntries(innerComp.map((x) => [x.key, x.value])),
          }
        : {
            type: "tuple",
            value: innerComp.map((x) => x.value),
          }
    }

    if (def.tag === "variant") {
      if (def.value.length === 0) return { type: "primitive", value: "_void" }

      const parts = def.value.map(
        (x): [string, EnumVar["value"][keyof EnumVar["value"]]] => {
          const key = x.name
          if (x.fields.length === 0) {
            return [key, { type: "_void", idx: x.index }]
          }

          if (x.fields.length === 1)
            return [
              key,
              {
                type: "codecEntry",
                value: getLookupEntry(x.fields[0].type as number),
                idx: x.index,
              },
            ]

          let allKey = true
          const inner = x.fields.map((x) => {
            const key = x.name
            allKey = allKey && !!key
            return { key, value: getLookupEntry(x.type as number) }
          })

          if (allKey) {
            return [
              key,
              {
                type: "struct",
                value: Object.fromEntries(inner.map((x) => [x.key, x.value])),
                idx: x.index,
              },
            ]
          }

          return [
            key,
            { type: "tuple", value: inner.map((x) => x.value), idx: x.index },
          ]
        },
      )

      return {
        type: "enum",
        value: Object.fromEntries(parts) as StringRecord<
          EnumVar["value"][keyof EnumVar["value"]]
        >,
      }
    }

    if (def.tag === "sequence") {
      return {
        type: "sequence",
        value: getLookupEntry(def.value as number),
      }
    }

    if (def.tag === "array") {
      return {
        type: "array",
        value: getLookupEntry(def.value.type as number),
        len: def.value.len,
      }
    }

    if (def.tag === "tuple") {
      if (def.value.length === 0) {
        return { type: "primitive", value: "_void" }
      }

      // use to be a "pointer"
      if (def.value.length === 1) return getLookupEntry(def.value[0] as number)

      return {
        type: "tuple",
        value: def.value.map((x) => getLookupEntry(x as number)),
      }
    }

    if (def.tag === "primitive") {
      return { type: "primitive", value: def.value.tag }
    }

    if (def.tag === "compact") {
      const translated = getLookupEntry(def.value as number) as PrimitiveVar
      const isBig = Number(translated.value.slice(1)) > 32

      return { type: "compact", isBig }
    }

    if (def.tag === "bitSequence") {
      return { type: "bitSequence" }
    }
    // historicMetaCompat
    return { type: "primitive", value: def.value }
  })

  return { getLookupEntry, getVarName }
}
