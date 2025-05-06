import { NormalizedMetadata } from "@polkadot-api/substrate-bindings"
import { getUsedTypes } from "./get-used-types"
import {
  getChecksumBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders"

export function applyWhitelist(
  metadata: NormalizedMetadata,
  whitelist: string[] | null,
): NormalizedMetadata {
  if (!whitelist) return metadata

  const allApis = whitelist.includes("api.*")
  const fullApiRegex = /^api\.(\w+)\.\*$/
  const fullApiIncluded = whitelist
    .map((w) => fullApiRegex.exec(w)?.[1])
    .filter((v) => !!v)
  const apis = allApis
    ? metadata.apis
    : metadata.apis
        .map((api) => {
          if (fullApiIncluded.includes(api.name)) return api

          return {
            ...api,
            methods: api.methods.filter((method) =>
              whitelist.includes(`api.${api.name}.${method.name}`),
            ),
          }
        })
        .filter((api) => api.methods.length > 0)

  const fullPalletRegex = /^\*\.(\w+)$/
  const fullPallets = whitelist
    .map((w) => fullPalletRegex.exec(w)?.[1])
    .filter((v) => !!v)

  const filterEnum = (
    whitelistPrefix: string,
    palletName: string,
    entry: NormalizedMetadata["pallets"][number]["calls"],
  ): NormalizedMetadata["pallets"][number]["calls"] => {
    if (!entry) return entry
    if (
      whitelist.includes(`${whitelistPrefix}.*`) ||
      whitelist.includes(`${whitelistPrefix}.${palletName}.*`)
    )
      return entry

    const def = metadata.lookup[entry.type].def
    if (def.tag !== "variant") throw new Error(whitelistPrefix + " not an enum")

    const prefixNotIncluded = whitelist.every(
      (e) => !e.startsWith(`${whitelistPrefix}.${palletName}`),
    )

    const value = prefixNotIncluded
      ? []
      : def.value.filter(({ name }) =>
          whitelist.includes(`${whitelistPrefix}.${palletName}.${name}`),
        )

    const idx = metadata.lookup.length
    metadata.lookup.push({
      ...metadata.lookup[entry.type],
      id: idx,
      def: {
        tag: "variant",
        value,
      },
    })
    return "deprecationInfo" in entry
      ? {
          type: idx,
          deprecationInfo: entry.deprecationInfo,
        }
      : { type: idx }
  }
  const getEnumLength = (lookupIdx: number | undefined) => {
    if (!lookupIdx) return 0
    const def = metadata.lookup[lookupIdx].def
    if (def.tag !== "variant") throw new Error("not an enum")
    return def.value.length
  }

  const filterList = <T extends { name: string }>(
    whitelistPrefix: string,
    palletName: string,
    list: Array<T>,
  ) => {
    if (
      whitelist.includes(`${whitelistPrefix}.*`) ||
      whitelist.includes(`${whitelistPrefix}.${palletName}.*`)
    )
      return list

    const prefixNotIncluded = whitelist.every(
      (e) => !e.startsWith(`${whitelistPrefix}.${palletName}`),
    )
    if (prefixNotIncluded) return []

    return list.filter(({ name }) =>
      whitelist.includes(`${whitelistPrefix}.${palletName}.${name}`),
    )
  }

  const filterPallets = (
    pallets: NormalizedMetadata["pallets"],
    filterErrors: boolean,
  ): NormalizedMetadata["pallets"] =>
    pallets
      .map((pallet) => {
        if (fullPallets.includes(pallet.name)) return pallet

        return {
          ...pallet,
          calls: filterEnum("tx", pallet.name, pallet.calls),
          constants: filterList("const", pallet.name, pallet.constants),
          errors: filterErrors ? undefined : pallet.errors,
          events: filterEnum("event", pallet.name, pallet.events),
          storage: pallet.storage
            ? {
                ...pallet.storage,
                items: filterList("query", pallet.name, pallet.storage.items),
              }
            : undefined,
        }
      })
      .filter(
        (pallet) =>
          getEnumLength(pallet.calls?.type) +
          pallet.constants.length +
          getEnumLength(pallet.errors?.type) +
          getEnumLength(pallet.events?.type) +
          (pallet.storage?.items.length ?? 0),
      )

  const pallets = filterPallets(metadata.pallets, false)

  const visitedIdxs: number[] = []
  const lookup = getLookupFn({ ...metadata, apis, pallets })
  getUsedTypes(lookup, getChecksumBuilder(lookup)).checksums.forEach((_, idx) =>
    visitedIdxs.push(idx),
  )
  let hasModuleError = false
  for (const idx of visitedIdxs) {
    const visited = lookup(idx)
    // the only type we add byteLength is the decoded module error
    if (visited.type === "enum" && visited.byteLength != null) {
      hasModuleError = true
      break
    }
  }

  return {
    ...metadata,
    apis,
    pallets: hasModuleError ? pallets : filterPallets(pallets, true),
  }
}
