import type { Codec, StringRecord } from "@polkadot-api/substrate-bindings"
import * as scale from "@polkadot-api/substrate-bindings"
import { mapObject } from "@polkadot-api/utils"
import type { EnumVar, MetadataLookup } from "./lookups"
import { getLookupBuilder } from "./lookup-builder"

export const getDynamicBuilder = (getLookupEntryDef: MetadataLookup) => {
  const { metadata } = getLookupEntryDef
  let buildDefinition = getLookupBuilder(getLookupEntryDef)

  const prefix = metadata.pallets
    .find((x) => x.name === "System")
    ?.constants.find((x) => x.name === "SS58Prefix")

  let ss58Prefix: number | undefined
  if (prefix) {
    try {
      const prefixVal = buildDefinition(prefix.type).dec(prefix.value)
      if (typeof prefixVal === "number") {
        ss58Prefix = prefixVal
        buildDefinition = getLookupBuilder(
          getLookupEntryDef,
          scale.AccountId(prefixVal),
        )
      }
    } catch (_) {}
  }

  const storagePallets = new Map<string, ReturnType<typeof scale.Storage>>()

  const buildStorage = (pallet: string, entry: string) => {
    let storagePallet = storagePallets.get(pallet)
    if (!storagePallet)
      storagePallets.set(pallet, (storagePallet = scale.Storage(pallet)))

    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .storage!.items.find((s) => s.name === entry)!

    const storageWithFallback = (
      len: number,
      ...args: Parameters<ReturnType<typeof scale.Storage>>
    ) => {
      const result = storagePallet!(...args)
      return {
        ...result,
        len,
        fallback:
          storageEntry.modifier === 1
            ? result.dec(storageEntry.fallback)
            : undefined,
      }
    }

    if (storageEntry.type.tag === "plain")
      return storageWithFallback(
        0,
        entry,
        buildDefinition(storageEntry.type.value).dec,
      )

    const { key, value, hashers } = storageEntry.type.value
    const val = buildDefinition(value)
    const hashes = hashers.map((x) => scale[x.tag])

    const hashArgs: scale.EncoderWithHash<unknown>[] = (() => {
      if (hashes.length === 1) {
        return [[buildDefinition(key), hashes[0]]]
      }

      const keyDef = getLookupEntryDef(key)

      switch (keyDef.type) {
        case "array":
          return hashes.map((hash) => [buildDefinition(keyDef.value.id), hash])
        case "tuple":
          return keyDef.value.map((x, idx) => [
            buildDefinition(x.id),
            hashes[idx],
          ])
        default:
          throw new Error("Invalid key type")
      }
    })()

    return storageWithFallback(hashes.length, entry, val.dec, ...hashArgs)
  }

  const buildEnumEntry = (
    entry: EnumVar["value"][keyof EnumVar["value"]],
  ): Codec<any> => {
    switch (entry.type) {
      case "void":
        return scale._void
      case "lookupEntry":
        return buildDefinition(entry.value.id)
      case "tuple":
        return scale.Tuple(
          ...Object.values(entry.value).map((l) => buildDefinition(l.id)),
        )
      case "struct":
        return scale.Struct(
          mapObject(entry.value, (x) => buildDefinition(x.id)) as StringRecord<
            Codec<any>
          >,
        )
      case "array":
        return scale.Vector(buildDefinition(entry.value.id), entry.len)
    }
  }

  const buildConstant = (pallet: string, constantName: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .constants!.find((s) => s.name === constantName)!

    return buildDefinition(storageEntry.type as number)
  }

  const buildVariant =
    (type: "errors" | "events" | "calls") =>
    (
      pallet: string,
      name: string,
    ): {
      codec: Codec<any>
      location: [number, number]
    } => {
      const palletEntry = metadata.pallets.find((x) => x.name === pallet)!
      const lookup = getLookupEntryDef(palletEntry[type]!)
      if (lookup.type !== "enum") throw null
      const entry = lookup.value[name]

      return {
        location: [palletEntry.index, entry.idx],
        codec: buildEnumEntry(lookup.value[name]),
      }
    }

  const buildRuntimeCall = (api: string, method: string) => {
    const entry = metadata.apis
      .find((x) => x.name === api)
      ?.methods.find((x) => x.name === method)
    if (!entry) throw null

    return {
      args: scale.Tuple(...entry.inputs.map((x) => buildDefinition(x.type))),
      value: buildDefinition(entry.output),
    }
  }

  return {
    buildDefinition,
    buildStorage,
    buildEvent: buildVariant("events"),
    buildError: buildVariant("errors"),
    buildRuntimeCall,
    buildCall: buildVariant("calls"),
    buildConstant,
    ss58Prefix,
  }
}
