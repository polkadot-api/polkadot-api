import { Descriptors, V15 } from "@polkadot-api/substrate-bindings"

export type Whitelist<D extends Descriptors> = Array<DescriptorKey<D>>

export function applyWhitelist(metadata: V15, whitelist: string[] | null): V15 {
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
    lookupIdx: number | undefined,
  ) => {
    if (!lookupIdx) return lookupIdx
    if (
      whitelist.includes(`${whitelistPrefix}.*`) ||
      whitelist.includes(`${whitelistPrefix}.${palletName}.*`)
    )
      return lookupIdx

    const def = metadata.lookup[lookupIdx].def
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
      ...metadata.lookup[lookupIdx],
      id: idx,
      def: {
        tag: "variant",
        value,
      },
    })
    return idx
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

  const pallets = metadata.pallets
    .map((pallet) => {
      if (fullPallets.includes(pallet.name)) return pallet

      return {
        ...pallet,
        calls: filterEnum("tx", pallet.name, pallet.calls),
        constants: filterList("const", pallet.name, pallet.constants),
        errors: filterEnum("error", pallet.name, pallet.errors),
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
        getEnumLength(pallet.calls) +
        pallet.constants.length +
        getEnumLength(pallet.errors) +
        getEnumLength(pallet.events) +
        (pallet.storage?.items.length ?? 0),
    )

  return {
    ...metadata,
    apis,
    pallets,
  }
}

type DescriptorKey<D extends Descriptors> =
  | PalletKey<D>
  | ApiKey<D>
  | `query.${NestedKey<PickDescriptors<0, D["pallets"]>>}`
  | `tx.${NestedKey<PickDescriptors<1, D["pallets"]>>}`
  | `event.${NestedKey<PickDescriptors<2, D["pallets"]>>}`
  | `error.${NestedKey<PickDescriptors<3, D["pallets"]>>}`
  | `const.${NestedKey<PickDescriptors<4, D["pallets"]>>}`

type PalletKey<D extends Descriptors> = `*.${keyof D["pallets"] & string}`
type NestedKey<D extends Record<string, Record<string, any>>> =
  | "*"
  | {
      [P in keyof D & string]:
        | `${P}.*`
        | {
            [N in keyof D[P] & string]: `${P}.${N}`
          }[keyof D[P] & string]
    }[keyof D & string]

type ApiKey<D extends Descriptors> =
  | "api.*"
  | {
      [P in keyof D["apis"] & string]:
        | `api.${P}.*`
        | {
            [N in keyof D["apis"][P] & string]: `api.${P}.${N}`
          }[keyof (keyof D["apis"][P]) & string]
    }[keyof D["apis"] & string]

type PickDescriptors<
  Idx extends 0 | 1 | 2 | 3 | 4,
  T extends Descriptors["pallets"],
> = {
  [K in keyof T]: T[K][Idx]
}
