import {
  getChecksumBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders"
import type { V14, V15 } from "@polkadot-api/substrate-bindings"
import { mapObject } from "@polkadot-api/utils"
import { getTypesBuilder } from "./types-builder"

const isDocs = (x: any) => {
  if (typeof x !== "object") return false
  const keys = new Set(Object.keys(x))
  if (keys.size !== 2) return false
  return keys.has("docs") && keys.has("value")
}

const customStringifyObject = (
  input: string | Record<string, any> | Array<any>,
): string => {
  if (typeof input === "string") return input

  if (Array.isArray(input))
    return `[${input.map(customStringifyObject).join(", ")}]`

  return `{${Object.entries(
    mapObject(input, (x) => (isDocs(x) ? x : customStringifyObject(x))),
  )
    .map(([key, value]) => {
      if (isDocs(value)) {
        return `\n\n/**\n${value.docs
          .map((doc: string) => ` *${doc}`)
          .join("\n")}\n */\n${key}: ${customStringifyObject(value.value)}`
      }
      return `${key}: ${value}`
    })
    .join(",\n")}}`
}

export const generateDescriptors = (
  metadata: V14 | V15,
  checksums: string[],
  typesBuilder: ReturnType<typeof getTypesBuilder>,
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
  prefix: string,
  paths: {
    client: string
    checksums: string
    types: string
  },
) => {
  const buildEnumObj = <T>(
    val: number | undefined,
    cb: (name: string, docs: string[]) => T,
  ): Record<string, T> => {
    if (val === undefined) return {}

    const lookup = metadata.lookup[val]
    if (lookup.def.tag !== "variant") throw null
    return Object.fromEntries(
      lookup.def.value.map((x) => {
        return [x.name!, cb(x.name, x.docs)]
      }),
    )
  }

  const storage = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        Object.fromEntries(
          pallet.storage?.items.map(({ name, modifier, docs }) => {
            const { key, val } = typesBuilder.buildStorage(pallet.name, name)
            const checksum = checksumBuilder.buildStorage(pallet.name, name)!
            const type = `StorageDescriptor<${key}, ${val}, ${!modifier}>`
            return [
              name,
              {
                checksum: checksums.indexOf(checksum),
                type,
                name: `stg_${pallet.name}_${name}`,
                docs,
              },
            ]
          }) ?? [],
        ),
      ]
    }),
  )

  const constants = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        Object.fromEntries(
          pallet.constants?.map(({ name, docs }) => {
            const checksum = checksumBuilder.buildConstant(pallet.name, name)!
            const type = `PlainDescriptor<${typesBuilder.buildConstant(
              pallet.name,
              name,
            )}>`
            return [
              name,
              {
                checksum: checksums.indexOf(checksum),
                type,
                name: `const_${pallet.name}_${name}`,
                docs,
              },
            ]
          }) ?? [],
        ),
      ]
    }),
  )

  const calls = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        buildEnumObj(pallet.calls, (name, docs) => ({
          checksum: checksums.indexOf(
            checksumBuilder.buildCall(pallet.name, name)!,
          ),
          type: `TxDescriptor<${typesBuilder.buildCall(pallet.name, name)}>`,
          name: `call_${pallet.name}_${name}`,
          docs,
        })),
      ]
    }),
  )

  const events = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        buildEnumObj(pallet.events, (name, docs) => ({
          checksum: checksums.indexOf(
            checksumBuilder.buildEvent(pallet.name, name)!,
          ),
          type: `PlainDescriptor<${typesBuilder.buildEvent(
            pallet.name,
            name,
          )}>`,
          name: `evt_${pallet.name}_${name}`,
          docs,
        })),
      ]
    }),
  )

  const errors = Object.fromEntries(
    metadata.pallets.map((pallet) => {
      return [
        pallet.name,
        buildEnumObj(pallet.errors, (name, docs) => {
          return {
            checksum: checksums.indexOf(
              checksumBuilder.buildError(pallet.name, name)!,
            ),
            type: `PlainDescriptor<${typesBuilder.buildError(
              pallet.name,
              name,
            )}>`,
            name: `err_${pallet.name}_${name}`,
            docs,
          }
        }),
      ]
    }),
  )

  const descriptorDeclarations: string[] = []

  const runtimeCalls = Object.fromEntries(
    metadata.apis.map((api) => [
      api.name,
      {
        docs: api.docs,
        methods: Object.fromEntries(
          api.methods.map((method) => {
            const { args, value } = typesBuilder.buildRuntimeCall(
              api.name,
              method.name,
            )
            return [
              method.name,
              {
                checksum: checksums.indexOf(
                  checksumBuilder.buildRuntimeCall(api.name, method.name)!,
                ),
                type: `RuntimeDescriptor<${args}, ${value}>`,
                name: `runtime_${api.name}_${method.name}`,
                docs: method.docs,
              },
            ]
          }),
        ),
      },
    ]),
  )

  ;[
    storage,
    calls,
    events,
    errors,
    constants,
    mapObject(runtimeCalls, (x) => x.methods),
  ].forEach((entryType) => {
    Object.values(entryType).forEach((x) =>
      Object.values(x).forEach(({ checksum, type, name }) => {
        descriptorDeclarations.push(
          `const ${name}: ${type} = ${checksum} as ${type};`,
        )
      }),
    )
  })

  const iPallets = mapObject(storage, (_, pallet) => {
    return [
      mapObject(storage[pallet], ({ docs, type: value }) => ({ docs, value })),
      mapObject(calls[pallet], ({ docs, type: value }) => ({ docs, value })),
      mapObject(events[pallet], ({ docs, type: value }) => ({ docs, value })),
      mapObject(errors[pallet], ({ docs, type: value }) => ({ docs, value })),
      mapObject(constants[pallet], ({ docs, type: value }) => ({
        docs,
        value,
      })),
    ]
  })

  const pallets = mapObject(storage, (_, pallet) => {
    return [
      mapObject(storage[pallet], (x) => x.name),
      mapObject(calls[pallet], (x) => x.name),
      mapObject(events[pallet], (x) => x.name),
      mapObject(errors[pallet], (x) => x.name),
      mapObject(constants[pallet], (x) => x.name),
    ]
  })

  const iRuntimeCalls = mapObject(runtimeCalls, (api) => ({
    docs: api.docs,
    value: mapObject(api.methods, ({ docs, type: value }) => ({ docs, value })),
  }))

  const runtimeCallsObj = mapObject(runtimeCalls, (api) =>
    mapObject(api.methods, (x) => x.name),
  )

  const clientImports = [
    "StorageDescriptor",
    "PlainDescriptor",
    "AssetDescriptor",
    "TxDescriptor",
    "RuntimeDescriptor",
    "Enum",
    "_Enum",
    "Binary",
    "FixedSizeBinary",
    "FixedSizeArray",
    "QueryFromDescriptors",
    "TxFromDescriptors",
    "EventsFromDescriptors",
    "ErrorsFromDescriptors",
    "ConstFromDescriptors",
    ...typesBuilder.getClientFileImports(),
  ]

  const assetPayment = metadata.extrinsic.signedExtensions.find(
    (x) => x.identifier === "ChargeAssetTxPayment",
  )

  let _assetId: null | number = null
  if (assetPayment) {
    const assetTxPayment = getLookupFn(metadata.lookup)(assetPayment.type)
    if (assetTxPayment.type === "struct") {
      const optionalAssetId = assetTxPayment.value.asset_id
      if (optionalAssetId.type === "option") _assetId = optionalAssetId.value.id
    }
  }

  const asset =
    _assetId === null
      ? null
      : {
          checksum: checksumBuilder.buildDefinition(_assetId),
          type: typesBuilder.buildTypeDefinition(_assetId),
        }

  const imports = `import {${clientImports.join(", ")}} from "${paths.client}";
  import {${typesBuilder.getTypeFileImports().join(", ")}} from "${
    paths.types
  }";

  const checksums = import("${paths.checksums}").then(module => 'default' in module ? module.default : module);
  `

  return `${imports}

type AnonymousEnum<T extends {}> = T & {
  __anonymous: true
}

type MyTuple<T> = [T, ...T[]]

type SeparateUndefined<T> = undefined extends T
  ? undefined | Exclude<T, undefined>
  : T


type Anonymize<T> = SeparateUndefined<
  T extends FixedSizeBinary<infer L>
    ? number extends L
      ? Binary
      : FixedSizeBinary<L>
    : T extends
          | string
          | number
          | bigint
          | boolean
          | void
          | undefined
          | null
          | symbol
          | Uint8Array
          | Enum<any>
      ? T
      : T extends AnonymousEnum<infer V>
        ? Enum<V>
        : T extends MyTuple<any>
          ? {
              [K in keyof T]: T[K]
            }
          : T extends []
            ? []
            : T extends FixedSizeArray<infer L, infer T>
              ? number extends L
                ? Array<T>
                : FixedSizeArray<L, T>
              : {
                  [K in keyof T & string]: T[K]
                }
>

${descriptorDeclarations.join("\n")}

type IPallets = ${customStringifyObject(iPallets)};
const pallets: IPallets = ${customStringifyObject(pallets)};

type IRuntimeCalls = ${customStringifyObject(iRuntimeCalls)};
const apis: IRuntimeCalls = ${customStringifyObject(runtimeCallsObj)};

type IAsset = AssetDescriptor<${asset?.type ?? "void"}>
const asset: IAsset = "${asset?.checksum ?? ""}" as IAsset

type IDescriptors = { pallets: IPallets, apis: IRuntimeCalls, asset: IAsset, checksums: Promise<string[]> };
const _allDescriptors: IDescriptors = { pallets, apis, asset, checksums };
export default _allDescriptors;


export type ${prefix}Queries = QueryFromDescriptors<IDescriptors>
export type ${prefix}Calls = TxFromDescriptors<IDescriptors>
export type ${prefix}Events = EventsFromDescriptors<IDescriptors>
export type ${prefix}Errors = ErrorsFromDescriptors<IDescriptors>
export type ${prefix}Constants = ConstFromDescriptors<IDescriptors>

export type ${prefix}WhitelistEntry =
  | PalletKey
  | ApiKey<IDescriptors>
  | \`query.\${NestedKey<PickDescriptors<0, IPallets>>}\`
  | \`tx.\${NestedKey<PickDescriptors<1, IPallets>>}\`
  | \`event.\${NestedKey<PickDescriptors<2, IPallets>>}\`
  | \`error.\${NestedKey<PickDescriptors<3, IPallets>>}\`
  | \`const.\${NestedKey<PickDescriptors<4, IPallets>>}\`

type PalletKey = \`*.\${keyof IPallets & string}\`
type NestedKey<D extends Record<string, Record<string, any>>> =
  | "*"
  | {
      [P in keyof D & string]:
        | \`\${P}.*\`
        | {
            [N in keyof D[P] & string]: \`\${P}.\${N}\`
          }[keyof D[P] & string]
    }[keyof D & string]

type ApiKey<D extends { apis: Record<string, Record<string, any>>}> =
  | "api.*"
  | {
      [P in keyof D["apis"] & string]:
        | \`api.\${P}.*\`
        | {
            [N in keyof D["apis"][P] & string]: \`api.\${P}.\${N}\`
          }[keyof (keyof D["apis"][P]) & string]
    }[keyof D["apis"] & string]

type PickDescriptors<
  Idx extends 0 | 1 | 2 | 3 | 4,
  T extends Record<string, Record<number, any>>
> = {
  [K in keyof T]: T[K][Idx]
}
`
}
