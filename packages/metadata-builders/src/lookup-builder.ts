import type { Codec, StringRecord } from "@polkadot-api/substrate-bindings"
import * as scale from "@polkadot-api/substrate-bindings"
import type { LookupEntry } from "./lookups"
import { withCache } from "./with-cache"

const _bytes = scale.Bin()

const bigCompact = scale.createCodec(
  scale.compact[0],
  scale.enhanceDecoder(scale.compact[1], BigInt),
)

const _buildCodec = (
  input: LookupEntry,
  cache: Map<number, Codec<any>>,
  stack: Set<number>,
  _accountId: Codec<scale.SS58String>,
): Codec<any> => {
  if (input.type === "primitive") return scale[input.value]
  if (input.type === "void") return scale._void
  if (input.type === "AccountId32") return _accountId
  if (input.type === "AccountId20") return scale.ethAccount
  if (input.type === "compact") return input.isBig ? bigCompact : scale.compact
  if (input.type === "bitSequence") return scale.bitSequence

  const buildNextCodec = (nextInput: LookupEntry): Codec<any> =>
    buildCodec(nextInput, cache, stack, _accountId)

  const buildVector = (inner: LookupEntry, len?: number) => {
    const innerCodec = buildNextCodec(inner)
    return len ? scale.Vector(innerCodec, len) : scale.Vector(innerCodec)
  }

  const buildTuple = (value: LookupEntry[]) =>
    scale.Tuple(...value.map(buildNextCodec))

  const buildStruct = (value: StringRecord<LookupEntry>) => {
    const inner = Object.fromEntries(
      Object.entries(value).map(([key, value]) => [key, buildNextCodec(value)]),
    ) as StringRecord<Codec<any>>
    return scale.Struct(inner)
  }

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  ) {
    return _bytes
  }

  if (input.type === "array") {
    // Bytes case
    if (input.value.type === "primitive" && input.value.value === "u8")
      return scale.Bin(input.len)

    return buildVector(input.value, input.len)
  }

  if (input.type === "sequence") return buildVector(input.value)
  if (input.type === "tuple") return buildTuple(input.value)
  if (input.type === "struct") return buildStruct(input.value)

  if (input.type === "option") return scale.Option(buildNextCodec(input.value))

  if (input.type === "result")
    return scale.Result(
      buildNextCodec(input.value.ok),
      buildNextCodec(input.value.ko),
    )

  // it has to be an enum by now
  const dependencies = Object.values(input.value).map((v) => {
    switch (v.type) {
      case "void":
        return scale._void
      case "lookupEntry":
        return buildNextCodec(v.value)
      case "tuple":
        return buildTuple(v.value)
      case "struct":
        return buildStruct(v.value)
      case "array":
        return buildVector(v.value, v.len)
    }
  })

  const inner = Object.fromEntries(
    Object.keys(input.value).map((key, idx) => {
      return [key, dependencies[idx]]
    }),
  ) as StringRecord<Codec<any>>

  const indexes = Object.values(input.value).map((x) => x.idx)
  const areIndexesSorted = indexes.every((idx, i) => idx === i)

  const variantCodec = areIndexesSorted
    ? scale.Variant(inner)
    : scale.Variant(inner, indexes as any)
  return input.byteLength
    ? fixedSizeCodec(variantCodec, input.byteLength)
    : variantCodec
}
const buildCodec = withCache(_buildCodec, scale.Self, (res) => res)

export const getLookupBuilder = (
  lookup: (id: number) => LookupEntry,
  accountId = scale.AccountId(),
) => {
  const cache = new Map()
  const buildDefinition = (id: number) =>
    buildCodec(lookup(id), cache, new Set(), accountId)

  return (id: number) => buildDefinition(id)
}

const fixedSizeCodec = <T>(codec: Codec<T>, size: number): Codec<T> => {
  const allBytes = scale.Bytes(size)
  return scale.createCodec<T>(
    (value: T) => allBytes.enc(codec.enc(value)),
    (data) => codec.dec(allBytes.dec(data)),
  )
}
