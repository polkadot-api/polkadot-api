import type { StringRecord, V14 } from "@polkadot-api/substrate-bindings"
import { h64 } from "@polkadot-api/substrate-bindings"
import {
  EnumVar,
  LookupEntry,
  MetadataPrimitives,
  getLookupFn,
} from "./lookups"

const textEncoder = new TextEncoder()
const encodeText = textEncoder.encode.bind(textEncoder)

export const getChecksum = (values: Array<bigint>, shape?: string) => {
  const hasShape = typeof shape === "string"
  const res = new Uint8Array((values.length + (hasShape ? 1 : 0)) * 8)
  const dv = new DataView(res.buffer)

  let offset = 0
  if (hasShape) {
    dv.setBigUint64(offset, h64(encodeText(shape)))
    offset += 8
  }

  for (let i = 0; i < values.length; i++, offset += 8)
    dv.setBigUint64(offset, values[i])

  return h64(res)
}

const primitiveChecksums: Record<
  | MetadataPrimitives
  | "_void"
  | "compactb"
  | "compacts"
  | "bitSequence"
  | "historicMetaCompat",
  bigint
> = {
  _void: 0n,
  bool: 1n,
  char: 2n,
  str: 3n,
  u8: 4n,
  u16: 5n,
  u32: 6n,
  u64: 7n,
  u128: 8n,
  u256: 9n,
  i8: 5n,
  i16: 5n,
  i32: 6n,
  i64: 7n,
  i128: 8n,
  i256: 9n,
  compacts: 10n,
  compactb: 11n,
  bitSequence: 12n,
  historicMetaCompat: 13n,
}

const bytesChecksum = 14n

const _buildChecksum = (
  input: LookupEntry,
  stack: Set<LookupEntry>,
  circularChecksums: Map<LookupEntry, bigint>,
  cache: Map<number, bigint>,
): bigint => {
  if (cache.has(input.id)) return cache.get(input.id)!
  const cached = (result: bigint) => {
    cache.set(input.id, result)
    return result
  }

  if (input.type === "primitive") return cached(primitiveChecksums[input.value])
  if (input.type === "compact")
    return cached(primitiveChecksums[input.isBig ? "compactb" : "compacts"])
  if (input.type === "bitSequence")
    return cached(primitiveChecksums.bitSequence)

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  ) {
    return cached(bytesChecksum)
  }

  const buildNextChecksum = (nextInput: LookupEntry): bigint => {
    if (!stack.has(nextInput)) {
      const nextStack = new Set(stack)
      nextStack.add(input)
      const result = _buildChecksum(
        nextInput,
        nextStack,
        circularChecksums,
        cache,
      )
      if (circularChecksums.has(input)) circularChecksums.set(input, result)
      return result
    }

    circularChecksums.set(input, 0n)
    return 0n
  }

  const buildVector = (inner: LookupEntry, len?: number) => {
    const innerChecksum = buildNextChecksum(inner)
    return len
      ? getChecksum([innerChecksum, BigInt(len)], "Vector(,)")
      : getChecksum([innerChecksum], "Vector()")
  }

  const buildTuple = (value: LookupEntry[]) =>
    getChecksum(value.map(buildNextChecksum))

  const buildStruct = (value: StringRecord<LookupEntry>) => {
    return getChecksum(
      Object.values(value).map(buildNextChecksum),
      JSON.stringify(Object.keys(value)),
    )
  }

  if (input.type === "array") return cached(buildVector(input.value, input.len))
  if (input.type === "sequence") return cached(buildVector(input.value))
  if (input.type === "tuple") return cached(buildTuple(input.value))
  if (input.type === "struct") return cached(buildStruct(input.value))

  // it has to be an enum by now
  const dependencies = Object.values(input.value).map((v) => {
    if (v.type === "primitive") return 0n
    return v.type === "tuple" ? buildTuple(v.value) : buildStruct(v.value)
  })
  const keys = Object.keys(input.value)
  keys.push("Enum")
  return cached(getChecksum(dependencies, JSON.stringify({ Enum: keys })))
}

export const getChecksumBuilder = (metadata: V14) => {
  const lookupData = metadata.lookup
  const getLookupEntryDef = getLookupFn(lookupData)

  const cache = new Map<number, bigint>()

  const buildDefinition = (id: number): bigint =>
    _buildChecksum(getLookupEntryDef(id), new Set(), new Map(), cache)

  const buildStorage = (pallet: string, entry: string): bigint | null => {
    try {
      const storageEntry = metadata.pallets
        .find((x) => x.name === pallet)!
        .storage!.items.find((s) => s.name === entry)!

      if (storageEntry.type.tag === "plain")
        return getChecksum([buildDefinition(storageEntry.type.value)])

      const { key, value } = storageEntry.type.value
      const val = buildDefinition(value)
      const returnKey =
        storageEntry.type.value.hashers.length === 1
          ? getChecksum([buildDefinition(key)])
          : buildDefinition(key)
      return getChecksum([val, returnKey])
    } catch (_) {
      return null
    }
  }

  const buildEnumEntry = (
    entry: EnumVar["value"][keyof EnumVar["value"]],
  ): bigint => {
    if (entry.type === "primitive") return 0n

    const values = Object.values(entry.value).map((l) => buildDefinition(l.id))

    return entry.type === "tuple"
      ? getChecksum(values)
      : getChecksum(values, JSON.stringify(Object.keys(entry.value)))
  }

  const buildCall = (pallet: string, callName: string): bigint | null => {
    try {
      const palletEntry = metadata.pallets.find((x) => x.name === pallet)!
      const callsLookup = getLookupEntryDef(palletEntry.calls! as number)

      if (callsLookup.type !== "enum") throw null
      return buildEnumEntry(callsLookup.value[callName])
    } catch (_) {
      return null
    }
  }

  const buildVariant =
    (variantType: "errors" | "events") =>
    (pallet: string, name: string): bigint | null => {
      try {
        const palletEntry = metadata.pallets.find((x) => x.name === pallet)!
        const callsLookup = getLookupEntryDef(
          palletEntry[variantType]! as number,
        )

        if (callsLookup.type !== "enum") throw null
        return buildEnumEntry(callsLookup.value[name])
      } catch (_) {
        return null
      }
    }

  const buildConstant = (
    pallet: string,
    constantName: string,
  ): bigint | null => {
    try {
      const storageEntry = metadata.pallets
        .find((x) => x.name === pallet)!
        .constants!.find((s) => s.name === constantName)!

      return buildDefinition(storageEntry.type as number)
    } catch (_) {
      return null
    }
  }

  return {
    buildDefinition,
    buildStorage,
    buildCall,
    buildEvent: buildVariant("events"),
    buildError: buildVariant("errors"),
    buildConstant,
  }
}
