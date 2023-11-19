import { Codec, V14 } from "@polkadot-api/substrate-bindings"
import { Observable } from "rxjs"
import { map } from "rxjs"
import { shareLatest } from "./utils"
import {
  getChecksumBuilder,
  getDynamicBuilder,
} from "@polkadot-api/substrate-codegen"

const getCodecsAndChecksumCreator = (metadata: V14) => {
  const dynamicBuilder = getDynamicBuilder(metadata)
  const checksumBuilder = getChecksumBuilder(metadata)

  const cache: Record<
    string,
    | Record<
        "stg" | "tx" | "ev" | "err" | "cons",
        Record<string, [string | null, any] | undefined> | undefined
      >
    | undefined
  > = {}

  const getCodecsAndChecksum = <
    Type extends "stg" | "tx" | "ev" | "err" | "cons",
  >(
    type: Type,
    pallet: string,
    name: string,
  ): Type extends "stg"
    ? [string | null, ReturnType<typeof dynamicBuilder.buildStorage>]
    : [string | null, Codec<any>] => {
    const cached = cache[pallet]?.[type]?.[name]
    if (cached) return cached

    cache[pallet] ||= { stg: {}, tx: {}, err: {}, ev: {}, cons: {} }
    cache[pallet]![type] ||= {}

    switch (type) {
      case "stg": {
        const checksum = checksumBuilder.buildStorage(pallet, name)
        const codecs = dynamicBuilder.buildStorage(pallet, name)
        cache[pallet]!.stg![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
      case "tx": {
        const checksum = checksumBuilder.buildCall(pallet, name)
        const codecs = dynamicBuilder.buildCall(pallet, name)
        cache[pallet]!.tx![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
      case "ev": {
        const checksum = checksumBuilder.buildEvent(pallet, name)
        const codecs = dynamicBuilder.buildEvent(pallet, name)
        cache[pallet]!.ev![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
      case "err": {
        const checksum = checksumBuilder.buildError(pallet, name)
        const codecs = dynamicBuilder.buildError(pallet, name)
        cache[pallet]!.err![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
      default: {
        const checksum = checksumBuilder.buildConstant(pallet, name)
        const codecs = dynamicBuilder.buildConstant(pallet, name)
        cache[pallet]!.cons![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
    }
  }

  return getCodecsAndChecksum
}

export const getCodecs$ = (metadata$: Observable<V14 | null>) =>
  metadata$.pipe(
    map((value) => (value ? getCodecsAndChecksumCreator(value) : value)),
    shareLatest,
  )
