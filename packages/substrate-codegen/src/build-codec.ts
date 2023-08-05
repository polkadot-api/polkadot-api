import type { Codec, StringRecord } from "@unstoppablejs/substrate-bindings"
import type { LookupEntry } from "./lookups"
import * as scale from "@unstoppablejs/substrate-bindings"
import { fromHex, toHex } from "@unstoppablejs/utils"

const hexEnhacer = (input: Codec<Uint8Array>): Codec<string> =>
  scale.enhanceCodec(input, fromHex, toHex)
const _bytes = hexEnhacer(scale.Bytes())

const _buildCodec = (
  input: LookupEntry,
  stack: Set<LookupEntry>,
  circularCodecs: Map<LookupEntry, Codec<any>>,
): Codec<any> => {
  if (input.type === "primitive") return scale[input.value]
  if (input.type === "compact") return scale.compact
  if (input.type === "bitSequence") return scale.bitSequence

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  ) {
    return _bytes
  }

  const buildNextCodec = (nextInput: LookupEntry): Codec<any> => {
    if (!stack.has(nextInput)) {
      const nextStack = new Set(stack)
      nextStack.add(input)
      const result = _buildCodec(nextInput, nextStack, circularCodecs)
      if (circularCodecs.has(input)) circularCodecs.set(input, result)
      return result
    }

    circularCodecs.set(input, scale._void)

    return scale.Self(() => circularCodecs.get(input)!)
  }

  const buildVector = (inner: LookupEntry, len?: number) => {
    const innerCodec = buildNextCodec(inner)
    return len ? scale.Vector(innerCodec, len) : scale.Vector(innerCodec)
  }

  const buildTuple = (value: LookupEntry[]) => {
    return scale.Tuple(...value.map(buildNextCodec))
  }

  const buildStruct = (value: StringRecord<LookupEntry>) => {
    const inner = Object.fromEntries(
      Object.entries(value).map(([key, value]) => [key, buildNextCodec(value)]),
    ) as StringRecord<Codec<any>>
    return scale.Struct(inner)
  }

  if (input.type === "array") {
    // Bytes case
    if (input.value.type === "primitive" && input.value.value === "u8")
      return hexEnhacer(scale.Bytes(input.len))

    return buildVector(input.value, input.len)
  }

  if (input.type === "sequence") return buildVector(input.value)
  if (input.type === "tuple") return buildTuple(input.value)
  if (input.type === "struct") return buildStruct(input.value)

  // it has to be an enum by now
  const dependencies = Object.values(input.value).map((value) => {
    if (value.type === "_void") {
      return scale._void
    }

    if (value.type === "codecEntry") return buildNextCodec(value.value)

    if (value.type === "tuple") {
      return buildTuple(value.value)
    }
    return buildStruct(value.value)
  })

  const inner = Object.fromEntries(
    Object.keys(input.value).map((key, idx) => {
      return [key, dependencies[idx]]
    }),
  ) as StringRecord<Codec<any>>

  const indexes = Object.values(input.value).map((x) => x.idx)
  const areIndexesSorted = indexes.every((idx, i) => idx === i)

  return areIndexesSorted
    ? scale.Enum(inner)
    : scale.Enum(inner, indexes as any)
}

export const buildCodec = (input: LookupEntry): Codec<any> =>
  _buildCodec(input, new Set(), new Map())
