import type { StringRecord, V15 } from "@polkadot-api/substrate-bindings"
import { h64 } from "@polkadot-api/substrate-bindings"
import {
  EnumVar,
  LookupEntry,
  MetadataPrimitives,
  getLookupFn,
} from "./lookups"
import { withCache } from "./with-cache"

const textEncoder = new TextEncoder()
const encodeText = textEncoder.encode.bind(textEncoder)

const getChecksum = (values: Array<bigint>, shape?: string) => {
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
  MetadataPrimitives | "_void" | "compactb" | "compacts" | "bitSequence",
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
}

const bytesChecksum = 14n

const _buildChecksum = (
  input: LookupEntry,
  cache: Map<number, bigint>,
  stack: Set<number>,
): bigint => {
  if (cache.has(input.id)) return cache.get(input.id)!

  if (input.type === "primitive") return primitiveChecksums[input.value]
  if (input.type === "compact")
    return primitiveChecksums[input.isBig ? "compactb" : "compacts"]
  if (input.type === "bitSequence") return primitiveChecksums.bitSequence

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  ) {
    return bytesChecksum
  }

  const buildNextChecksum = (nextInput: LookupEntry): bigint =>
    buildChecksum(nextInput, cache, stack)

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

  if (input.type === "array") return buildVector(input.value, input.len)
  if (input.type === "sequence") return buildVector(input.value)
  if (input.type === "tuple") return buildTuple(input.value)
  if (input.type === "struct") return buildStruct(input.value)

  if (input.type === "option")
    return getChecksum([buildNextChecksum(input.value)], "Option()")

  if (input.type === "result")
    return getChecksum(
      [input.value.ok, input.value.ko].map(buildNextChecksum),
      "Result()",
    )

  if (input.type === "AccountId32") {
    return getChecksum([primitiveChecksums.u8, 32n], "AccountId32")
  }

  // it has to be an enum by now
  const dependencies = Object.values(input.value).map((v) => {
    if (v.type === "primitive") return 0n
    return v.type === "tuple" ? buildTuple(v.value) : buildStruct(v.value)
  })
  const keys = Object.keys(input.value)
  keys.push("Enum")
  return getChecksum(dependencies, JSON.stringify({ Enum: keys }))
}
const buildChecksum = withCache(
  _buildChecksum,
  () => 0n,
  (result) => result,
)

export const getChecksumBuilder = (metadata: V15) => {
  const lookupData = metadata.lookup
  const getLookupEntryDef = getLookupFn(lookupData)

  const cache = new Map<number, bigint>()

  const buildDefinition = (id: number): bigint =>
    buildChecksum(getLookupEntryDef(id), cache, new Set())

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

  const buildRuntimeCall = (api: string, method: string): bigint | null => {
    try {
      const entry = metadata.apis
        .find((x) => x.name === api)
        ?.methods.find((x) => x.name === method)
      if (!entry) throw null

      const args = getChecksum(
        entry.inputs.map((x) => buildDefinition(x.type)),
        `(${entry.inputs.map((x) => x.name).join(",")})`,
      )
      return getChecksum([args, buildDefinition(entry.output)])
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

  const buildVariant =
    (variantType: "errors" | "events" | "calls") =>
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

  const toStringEnhancer =
    <Args extends Array<any>>(
      fn: (...args: Args) => bigint | null,
    ): ((...args: Args) => string | null) =>
    (...args) =>
      fn(...args)?.toString(32) ?? null

  return {
    buildDefinition: toStringEnhancer(buildDefinition),
    buildRuntimeCall: toStringEnhancer(buildRuntimeCall),
    buildStorage: toStringEnhancer(buildStorage),
    buildCall: toStringEnhancer(buildVariant("calls")),
    buildEvent: toStringEnhancer(buildVariant("events")),
    buildError: toStringEnhancer(buildVariant("errors")),
    buildConstant: toStringEnhancer(buildConstant),
  }
}
