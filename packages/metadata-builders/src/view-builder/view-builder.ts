import { mapObject, mapStringRecord } from "@polkadot-api/utils"
import {
  Decoder,
  type StringRecord,
  type V14,
  createDecoder,
  u8,
  HexString,
  enhanceDecoder,
} from "@polkadot-api/substrate-bindings"
import type { EnumVar, LookupEntry } from "@/lookups"
import { getLookupFn } from "@/lookups"
import {
  primitives,
  complex,
  WithShapeWithoutExtra,
  ShapedDecoder,
  selfDecoder,
  AccountIdShaped,
  WithoutExtra,
} from "./shaped-decoders"
import {
  AccountIdDecoded,
  Decoded,
  DecodedCall,
  GetViewBuilder,
  PrimitiveDecoded,
  UnshapedDecoder,
} from "./types"
import { withCache } from "@/with-cache"

const emptyTuple = complex.Tuple()

const toUnshapedDecoder =
  <A extends Array<any>>(
    fn: (...args: A) => ShapedDecoder,
  ): ((...args: A) => UnshapedDecoder) =>
  (...args) => {
    const value = fn(...args)
    return {
      shape: value.shape,
      decoder: value as Decoder<Decoded>,
    }
  }

type WithProp<
  T extends Decoder<any> & { shape: any },
  PropName extends string,
  PropValue,
> = T extends Decoder<infer D> & { shape: infer S }
  ? Decoder<
      D extends WithoutExtra<PrimitiveDecoded>
        ? PrimitiveDecoded
        : D & { [P in PropName]: PropValue }
    > & { shape: S }
  : T

const withProp = <PropName extends string, PropValue>(
  input: ShapedDecoder,
  propName: PropName,
  propValue: PropValue,
): WithProp<ShapedDecoder, PropName, PropValue> => {
  const decoder = enhanceDecoder(input as Decoder<{}>, (x) => ({
    ...x,
    [propName]: propValue,
  })) as WithProp<ShapedDecoder, PropName, PropValue>
  decoder.shape = input.shape
  return decoder
}

const addPath =
  <Other extends Array<any>>(
    fn: (
      input: LookupEntry,
      cache: Map<number, ShapedDecoder>,
      stack: Set<number>,
      lookupData: V14["lookup"],
      ...rest: Other
    ) => ShapedDecoder,
  ): ((
    input: LookupEntry,
    cache: Map<number, ShapedDecoder>,
    stack: Set<number>,
    lookupData: V14["lookup"],
    ...rest: Other
  ) => ShapedDecoder | WithProp<ShapedDecoder, "path", string[]>) =>
  (input, cache, stack, lookupData, ...rest) => {
    const { path } = lookupData[input.id]
    const base = fn(input, cache, stack, lookupData, ...rest)
    return path.length ? withProp(base, "path", path) : base
  }

const _buildShapedDecoder = (
  input: LookupEntry,
  cache: Map<number, ShapedDecoder>,
  stack: Set<number>,
  lookupData: V14["lookup"],
  _accountId: WithShapeWithoutExtra<AccountIdDecoded>,
): ShapedDecoder => {
  if (input.type === "primitive") return primitives[input.value]
  if (input.type === "compact")
    return input.isBig ? primitives.compactBn : primitives.compactNumber
  if (input.type === "bitSequence") return primitives.bitSequence

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  ) {
    return primitives.Bytes
  }

  const buildNext = (nextInput: LookupEntry): ShapedDecoder =>
    buildShapedDecoder(nextInput, cache, stack, lookupData, _accountId)

  const buildVector = (inner: LookupEntry, len?: number) => {
    const _inner = buildNext(inner)
    return len ? complex.Array(_inner, len) : complex.Sequence(_inner)
  }

  const buildTuple = (value: LookupEntry[], innerDocs: string[][]) =>
    withProp(complex.Tuple(...value.map(buildNext)), "innerDocs", innerDocs)

  const buildStruct = (
    value: StringRecord<LookupEntry>,
    innerDocs: StringRecord<string[]>,
  ) =>
    withProp(
      complex.Struct(mapStringRecord(value, buildNext)),
      "innerDocs",
      innerDocs,
    )

  if (input.type === "array") {
    // Bytes case
    if (input.value.type === "primitive" && input.value.value === "u8") {
      return input.len === 32 && (input.id === 0 || input.id === 1)
        ? _accountId
        : primitives.BytesArray(input.len)
    }

    return buildVector(input.value, input.len)
  }

  if (input.type === "sequence") return buildVector(input.value)
  if (input.type === "tuple") return buildTuple(input.value, input.innerDocs)
  if (input.type === "struct") return buildStruct(input.value, input.innerDocs)

  // it has to be an enum by now
  const dependencies = Object.values(input.value).map((v) => {
    if (v.type === "primitive") return primitives._void
    if (v.type === "tuple" && v.value.length === 1) {
      return buildNext(v.value[0])
    }
    return v.type === "tuple"
      ? buildTuple(v.value, v.innerDocs)
      : buildStruct(v.value, v.innerDocs)
  })

  const inner = Object.fromEntries(
    Object.keys(input.value).map((key, idx) => [key, dependencies[idx]]),
  ) as StringRecord<ShapedDecoder>

  const indexes = Object.values(input.value).map((x) => x.idx)
  const areIndexesSorted = indexes.every((idx, i) => idx === i)

  const withoutDocs = areIndexesSorted
    ? complex.Enum(inner)
    : complex.Enum(inner, indexes as any)

  const withDocs = enhanceDecoder(withoutDocs, (val) => {
    const docs = input.innerDocs[val.value.tag]
    return {
      ...val,
      docs,
    }
  }) as unknown as typeof withoutDocs
  withDocs.shape = withoutDocs.shape
  return withDocs
}

const withPath = addPath(_buildShapedDecoder)
const buildShapedDecoder = withCache(withPath, selfDecoder, (outter, inner) => {
  inner.shape = outter.shape
  return outter
})

const hexStrFromByte = (input: number) =>
  `0x${input.toString(16).padEnd(2, "0")}` as HexString

export const getViewBuilder: GetViewBuilder = (metadata: V14) => {
  const lookupData = metadata.lookup
  const cache = new Map<number, ShapedDecoder>()

  const getDecoder = (id: number) =>
    buildShapedDecoder(
      getLookupEntryDef(id),
      cache,
      new Set(),
      lookupData,
      _accountId,
    )

  const getLookupEntryDef = getLookupFn(lookupData)

  let _accountId: WithShapeWithoutExtra<AccountIdDecoded> = primitives.AccountId

  const prefix = metadata.pallets
    .find((x) => x.name === "System")
    ?.constants.find((x) => x.name === "SS58Prefix")
  if (prefix) {
    try {
      const prefixVal = getDecoder(prefix.type)(prefix.value).value

      if (typeof prefixVal === "number") _accountId = AccountIdShaped(prefixVal)
    } catch (_) {}
  }

  const buildDefinition = toUnshapedDecoder(getDecoder)

  const callDecoder: Decoder<DecodedCall> = createDecoder((bytes) => {
    const palletIdx = u8.dec(bytes)

    const palletEntry = metadata.pallets.find((x) => x.index === palletIdx)
    if (!palletEntry) throw new Error("Invalid Pallet")

    const pallet = {
      value: {
        name: palletEntry.name,
        idx: palletIdx,
      },
      input: hexStrFromByte(bytes[0]),
    }

    const callsDecoder = getDecoder(palletEntry.calls!)

    const decoded = callsDecoder(bytes)

    if (decoded.codec !== "Enum") throw null

    const call = {
      value: {
        name: decoded.value.tag,
        idx: bytes[1],
      },
      input: hexStrFromByte(bytes[1]),
      docs: (decoded as any).docs as string[],
    }

    return {
      pallet,
      call,
      args: { value: decoded.value.value as any, shape: callsDecoder.shape },
    }
  })

  const buildEnumEntry = toUnshapedDecoder(
    (
      entry: EnumVar["value"][keyof EnumVar["value"]],
      forceTuple = false,
    ): ShapedDecoder => {
      if (entry.type === "primitive")
        return forceTuple ? emptyTuple : primitives._void

      return entry.type === "tuple"
        ? complex.Tuple(
            ...Object.values(entry.value).map((l) => getDecoder(l.id)),
          )
        : complex.Struct(
            mapObject(entry.value, (x) =>
              getDecoder(x.id),
            ) as StringRecord<ShapedDecoder>,
          )
    },
  )

  const buildVariant =
    (type: "errors" | "events" | "calls") =>
    (
      pallet: string,
      name: string,
    ): {
      view: UnshapedDecoder
      location: [number, number]
    } => {
      const palletEntry = metadata.pallets.find((x) => x.name === pallet)!

      const lookup = getLookupEntryDef(palletEntry[type]!)
      if (lookup.type !== "enum") throw null

      const event = lookup.value[name]

      return {
        location: [palletEntry.index, event.idx],
        view: buildEnumEntry(event, type === "calls"),
      }
    }

  const buildConstant = (pallet: string, constantName: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .constants!.find((s) => s.name === constantName)!

    return buildDefinition(storageEntry.type as number)
  }

  return {
    buildDefinition,
    callDecoder,

    buildEvent: buildVariant("events"),
    buildError: buildVariant("errors"),
    buildCall: buildVariant("calls"),
    buildConstant,
  }
}
